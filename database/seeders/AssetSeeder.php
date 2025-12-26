<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AssetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Path ke file CSV
        $csvFile = base_path('database/seeders/data/asset.csv');
        
        // Cek apakah file ada
        if (!file_exists($csvFile)) {
            $this->command->error('File CSV tidak ditemukan di: ' . $csvFile);
            $this->command->info('Silakan copy file CSV Anda ke: database/seeders/data/asset.csv');
            return;
        }

        // Baca file CSV
        $file = fopen($csvFile, 'r');
        
        // Skip header row
        $header = fgetcsv($file);
        
        $insertedCount = 0;
        $errorCount = 0;
        
        // Baca setiap baris
        while (($row = fgetcsv($file)) !== false) {
            try {
                // Skip jika data tidak lengkap atau kode_tempat kosong
                if (empty($row[0]) || strlen(trim($row[0])) > 20) {
                    continue;
                }
                
                $kodeTempat = trim($row[0]);
                
                // Validasi kode_tempat ada di tabel tempat
                $tempatExists = DB::table('tempat')
                    ->where('kode_tempat', $kodeTempat)
                    ->exists();
                
                if (!$tempatExists) {
                    $errorCount++;
                    continue;
                }
                
                // Map kolom CSV ke field database
                $asset = [
                    'kode_tempat' => $kodeTempat,
                    'jenis_perangkat' => trim($row[1] ?? ''),
                    'hostname' => trim($row[2] ?? ''),
                    'merk_spek' => trim($row[3] ?? ''),
                    'ip_perangkat' => trim($row[4] ?? '0.0.0.0'),
                    'kondisi' => in_array(trim($row[5] ?? 'SO'), ['SO', 'TSO']) ? trim($row[5] ?? 'SO') : 'SO',
                    'lokasi' => trim($row[6] ?? ''),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                
                // Insert ke database
                DB::table('asset')->insert($asset);
                $insertedCount++;
                
            } catch (\Exception $e) {
                $errorCount++;
                // Hanya tampilkan error jika bukan masalah parsing CSV
                if ($this->command->getOutput()->isVerbose()) {
                    $this->command->warn('Error: ' . $e->getMessage());
                }
            }
        }
        
        fclose($file);
        
        $this->command->info("Asset seeder selesai!");
        $this->command->info("Total berhasil: {$insertedCount} asset");
        if ($errorCount > 0) {
            $this->command->warn("Total error: {$errorCount} baris");
        }
    }
}
