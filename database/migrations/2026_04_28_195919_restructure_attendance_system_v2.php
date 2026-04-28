<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        // Bersihkan tabel lama untuk desain baru
        Schema::dropIfExists('attendance_scans');
        Schema::dropIfExists('shifts');
        Schema::dropIfExists('global_settings');

        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->time('check_in_start');
            $table->time('check_in_end');
            $table->time('check_out_start');
            $table->time('check_out_end');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('attendance_scans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->time('check_in')->nullable();
            $table->time('check_out')->nullable();
            $table->string('check_in_status')->nullable();
            $table->string('check_out_status')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'date']);
        });

        Schema::create('global_settings', function (Blueprint $table) {
            $table->id();
            $table->time('scanner_active_start')->default('07:00:00');
            $table->time('scanner_active_end')->default('22:00:00');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    public function down(): void
    {
        Schema::dropIfExists('global_settings');
        Schema::dropIfExists('attendance_scans');
        Schema::dropIfExists('shifts');
    }
};
