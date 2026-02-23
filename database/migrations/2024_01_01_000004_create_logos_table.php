<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('logos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name'); // Tên thương hiệu
            $table->string('slogan')->nullable();
            $table->string('industry', 100)->nullable(); // Ngành nghề
            $table->string('style', 50)->default('minimalist'); // minimalist/artisan/mascot/typography
            $table->json('colors')->nullable(); // Mảng mã hex
            $table->longText('svg_content')->nullable(); // Raw SVG output
            $table->string('thumbnail')->nullable(); // Đường dẫn thumbnail PNG
            $table->text('prompt_used')->nullable(); // Prompt gửi lên OpenRouter
            $table->string('model_used', 100)->nullable(); // Model AI đã dùng
            $table->enum('status', ['draft', 'completed', 'exported'])->default('draft');
            $table->timestamps();
            $table->softDeletes();

            // Indexes cho query phổ biến
            $table->index(['user_id', 'status']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('logos');
    }
};
