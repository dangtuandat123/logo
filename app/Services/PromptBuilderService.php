<?php

declare(strict_types=1);

namespace App\Services;

/**
 * PromptBuilderService
 * Biến đổi input từ user (brand name, industry, style, colors) thành system prompt
 * chuẩn bị gửi lên OpenRouter API để sinh SVG logo.
 */
class PromptBuilderService
{
    /**
     * Xây dựng prompt cho AI dựa trên thông tin onboarding của user
     */
    public function build(array $data): string
    {
        $brandName = $data['name'] ?? 'Brand';
        $slogan = $data['slogan'] ?? '';
        $industry = $data['industry'] ?? 'general';
        $style = $data['style'] ?? 'minimalist';
        $colors = $data['colors'] ?? ['#2563EB', '#1E293B'];

        // Chuyển đổi style sang mô tả chi tiết cho AI
        $styleDescription = $this->getStyleDescription($style);
        $colorString = implode(', ', $colors);

        $prompt = <<<PROMPT
You are an expert logo designer specializing in SVG vector graphics. Create a professional, high-quality logo based on these specifications:

**Brand Name:** {$brandName}
**Slogan:** {$slogan}
**Industry:** {$industry}
**Design Style:** {$styleDescription}
**Color Palette:** {$colorString}

## STRICT OUTPUT RULES:
1. Return ONLY valid SVG code. No markdown, no explanations, no code fences.
2. The SVG must use a viewBox of "0 0 400 300".
3. Use ONLY the specified colors from the palette.
4. Include the brand name as a prominent <text> element with a web-safe or Google Font family.
5. If a slogan is provided, include it as a smaller <text> element below the brand name.
6. Create a meaningful icon/symbol that represents the {$industry} industry.
7. Ensure all SVG elements are properly closed and valid.
8. Use clean, minimal paths — avoid overly complex shapes.
9. The logo must look professional and modern.
10. Do NOT include any <script> tags or external references.

## SVG STRUCTURE:
- Root <svg> with xmlns="http://www.w3.org/2000/svg"
- Icon/symbol group
- Brand name text
- Optional slogan text
- All elements centered in the viewBox
PROMPT;

        return trim($prompt);
    }

    /**
     * Chuyển đổi style code thành mô tả chi tiết cho AI
     */
    private function getStyleDescription(string $style): string
    {
        return match ($style) {
            'minimalist' => 'Minimalist — Clean, simple geometric shapes. Thin lines, plenty of whitespace. Modern and elegant.',
            'artisan' => 'Artisan/Badge — Hand-crafted feel with badge or emblem styling. Classic, established look with decorative borders.',
            'mascot' => 'Mascot — A friendly character or iconic figure representing the brand. Expressive and memorable.',
            'typography' => 'Typography-focused — Creative letterforms and typographic treatments. The text IS the design element.',
            default => 'Modern and professional — Balance between creativity and clarity.',
        };
    }
}
