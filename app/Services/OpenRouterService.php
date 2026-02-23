<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * OpenRouterService
 * Gọi OpenRouter API qua Guzzle/HTTP để sinh SVG logo.
 * API Key được giữ an toàn ở Backend, không expose ra Frontend.
 */
class OpenRouterService
{
    private string $apiKey;
    private string $baseUrl;
    private string $model;

    public function __construct()
    {
        $this->apiKey = config('services.openrouter.api_key', '');
        $this->baseUrl = config('services.openrouter.base_url', 'https://openrouter.ai/api/v1');
        $this->model = config('services.openrouter.model', 'google/gemini-2.5-flash-preview');
    }

    /**
     * Gửi prompt lên OpenRouter và nhận SVG response
     *
     * @param string $prompt System prompt đã build từ PromptBuilderService
     * @return array{success: bool, svg: string|null, model: string, error: string|null}
     */
    public function generateSvg(string $prompt): array
    {
        // Nếu không có API key, trả mock data để test UI
        if (empty($this->apiKey)) {
            Log::warning('OpenRouter API key chưa cấu hình, trả mock SVG.');
            return $this->getMockResponse();
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
                'HTTP-Referer' => config('app.url'),
                'X-Title' => config('app.name'),
            ])
                ->timeout(120) // Logo generation có thể mất thời gian
                ->post("{$this->baseUrl}/chat/completions", [
                    'model' => $this->model,
                    'messages' => [
                        [
                            'role' => 'user',
                            'content' => $prompt,
                        ],
                    ],
                    'max_tokens' => 4096,
                    'temperature' => 0.7,
                ]);

            if ($response->failed()) {
                Log::error('OpenRouter API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return [
                    'success' => false,
                    'svg' => null,
                    'model' => $this->model,
                    'error' => 'Lỗi kết nối OpenRouter API: ' . $response->status(),
                ];
            }

            $data = $response->json();
            $content = $data['choices'][0]['message']['content'] ?? '';

            // Trích xuất SVG từ response (có thể AI wrap trong markdown)
            $svg = $this->extractSvg($content);

            if (empty($svg)) {
                return [
                    'success' => false,
                    'svg' => null,
                    'model' => $data['model'] ?? $this->model,
                    'error' => 'AI không trả về SVG hợp lệ.',
                ];
            }

            return [
                'success' => true,
                'svg' => $svg,
                'model' => $data['model'] ?? $this->model,
                'error' => null,
            ];
        } catch (\Exception $e) {
            Log::error('OpenRouter exception', ['message' => $e->getMessage()]);
            return [
                'success' => false,
                'svg' => null,
                'model' => $this->model,
                'error' => 'Lỗi hệ thống: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Trích xuất SVG từ response text (loại bỏ markdown code fences nếu có)
     */
    private function extractSvg(string $content): ?string
    {
        // Thử trích xuất từ markdown code block
        if (preg_match('/```(?:svg|xml|html)?\s*([\s\S]*?)```/', $content, $matches)) {
            $content = trim($matches[1]);
        }

        // Tìm thẻ SVG trong content
        if (preg_match('/<svg[\s\S]*?<\/svg>/i', $content, $matches)) {
            return trim($matches[0]);
        }

        return null;
    }

    /**
     * Mock response khi không có API key (dùng để dev/test UI)
     */
    private function getMockResponse(): array
    {
        $mockSvg = <<<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#F8FAFC" rx="16"/>
  <circle cx="200" cy="110" r="50" fill="#2563EB" opacity="0.9"/>
  <circle cx="200" cy="110" r="30" fill="#F8FAFC"/>
  <path d="M185 110 L200 85 L215 110 Z" fill="#2563EB"/>
  <text x="200" y="200" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="32" font-weight="700" fill="#1E293B">Logo Master</text>
  <text x="200" y="230" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="14" fill="#64748B">AI-Powered Design</text>
</svg>
SVG;

        return [
            'success' => true,
            'svg' => $mockSvg,
            'model' => 'mock-model',
            'error' => null,
        ];
    }
}
