<?php

declare(strict_types=1);

namespace App\Services;

/**
 * SvgSanitizerService
 * Kiểm tra và làm sạch mã SVG do AI sinh ra trước khi trả về Frontend.
 * Loại bỏ script tags, event handlers, external references.
 */
class SvgSanitizerService
{
    /**
     * Sanitize SVG content — loại bỏ các phần tử nguy hiểm
     */
    public function sanitize(string $svg): string
    {
        // 1. Loại bỏ hoàn toàn script tags
        $svg = preg_replace('/<script[\s\S]*?<\/script>/i', '', $svg);

        // 2. Loại bỏ event handlers (onclick, onload, onerror, etc.)
        $svg = preg_replace('/\s+on\w+\s*=\s*["\'][^"\']*["\']/i', '', $svg);

        // 3. Loại bỏ javascript: protocol trong href/xlink:href
        $svg = preg_replace('/javascript\s*:/i', '', $svg);

        // 4. Loại bỏ data: protocol (có thể embed malicious content)
        // Giữ lại data:image cho embedded images hợp lệ
        $svg = preg_replace('/data\s*:\s*(?!image\/(png|jpeg|gif|svg\+xml))/i', '', $svg);

        // 5. Loại bỏ <foreignObject> (có thể chứa HTML/JS)
        $svg = preg_replace('/<foreignObject[\s\S]*?<\/foreignObject>/i', '', $svg);

        // 6. Loại bỏ <use> với external references
        $svg = preg_replace('/<use[^>]*href\s*=\s*["\']https?:\/\/[^"\']*["\'][^>]*\/?>/i', '', $svg);

        // 7. Đảm bảo có xmlns attribute
        if (stripos($svg, 'xmlns=') === false) {
            $svg = preg_replace('/<svg/', '<svg xmlns="http://www.w3.org/2000/svg"', $svg, 1);
        }

        return trim($svg);
    }

    /**
     * Kiểm tra SVG có hợp lệ không (well-formed XML)
     */
    public function isValid(string $svg): bool
    {
        // Kiểm tra basic structure
        if (empty($svg))
            return false;
        if (stripos($svg, '<svg') === false)
            return false;
        if (stripos($svg, '</svg>') === false)
            return false;

        // Thử parse XML
        libxml_use_internal_errors(true);
        $doc = simplexml_load_string($svg);
        $errors = libxml_get_errors();
        libxml_clear_errors();

        return $doc !== false && empty($errors);
    }
}
