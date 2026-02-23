<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Logo;
use App\Services\OpenRouterService;
use App\Services\PromptBuilderService;
use App\Services\SvgSanitizerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LogoController extends Controller
{
    public function __construct(
        private readonly OpenRouterService $openRouter,
        private readonly PromptBuilderService $promptBuilder,
        private readonly SvgSanitizerService $svgSanitizer,
    ) {
    }

    /**
     * Tạo logo mới bằng AI
     */
    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slogan' => 'nullable|string|max:255',
            'industry' => 'required|string|max:100',
            'style' => 'required|in:minimalist,artisan,mascot,typography',
            'colors' => 'required|array|min:1|max:5',
            'colors.*' => 'string|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        // 1. Build prompt từ dữ liệu onboarding
        $prompt = $this->promptBuilder->build($validated);

        // 2. Gọi OpenRouter API
        $result = $this->openRouter->generateSvg($prompt);

        if (!$result['success']) {
            return response()->json([
                'status' => 'error',
                'message' => $result['error'] ?? 'Lỗi tạo logo.',
            ], 500);
        }

        // 3. Sanitize SVG output
        $cleanSvg = $this->svgSanitizer->sanitize($result['svg']);

        // 4. Lưu logo vào database
        $logo = Logo::create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'slogan' => $validated['slogan'] ?? null,
            'industry' => $validated['industry'],
            'style' => $validated['style'],
            'colors' => $validated['colors'],
            'svg_content' => $cleanSvg,
            'prompt_used' => $prompt,
            'model_used' => $result['model'],
            'status' => 'draft',
        ]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'logo' => $logo,
            ],
        ], 201);
    }

    /**
     * Danh sách logo của user
     */
    public function index(Request $request): JsonResponse
    {
        $logos = $request->user()
            ->logos()
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return response()->json([
            'status' => 'success',
            'data' => $logos,
        ]);
    }

    /**
     * Chi tiết 1 logo
     */
    public function show(Request $request, Logo $logo): JsonResponse
    {
        // Kiểm tra quyền sở hữu
        if ($logo->user_id !== $request->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không có quyền truy cập.',
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'logo' => $logo,
            ],
        ]);
    }

    /**
     * Cập nhật logo (SVG content sau khi edit trên Frontend)
     */
    public function update(Request $request, Logo $logo): JsonResponse
    {
        if ($logo->user_id !== $request->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không có quyền truy cập.',
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slogan' => 'nullable|string|max:255',
            'svg_content' => 'sometimes|string',
            'colors' => 'sometimes|array',
            'status' => 'sometimes|in:draft,completed,exported',
        ]);

        // Sanitize SVG nếu có update
        if (isset($validated['svg_content'])) {
            $validated['svg_content'] = $this->svgSanitizer->sanitize($validated['svg_content']);
        }

        $logo->update($validated);

        return response()->json([
            'status' => 'success',
            'data' => [
                'logo' => $logo->fresh(),
            ],
        ]);
    }

    /**
     * Xóa logo (soft delete)
     */
    public function destroy(Request $request, Logo $logo): JsonResponse
    {
        if ($logo->user_id !== $request->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không có quyền truy cập.',
            ], 403);
        }

        $logo->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logo đã được xóa.',
        ]);
    }
}
