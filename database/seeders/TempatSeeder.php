<?php

namespace Database\Seeders;

use App\Models\Tempat;
use Illuminate\Database\Seeder;

class TempatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lokasiData = [
            ['kode_tempat' => 'JNR',   'nama_tempat' => 'Stasiun Jenar',             'jenis_tempat' => 'stasiun', 'latitude' => -7.802724, 'longitude' => 110.001230, 'gambar' => null],
            ['kode_tempat' => 'WOJO',  'nama_tempat' => 'Stasiun Wojo',              'jenis_tempat' => 'stasiun', 'latitude' => -7.861899, 'longitude' => 110.040487, 'gambar' => null],
            ['kode_tempat' => 'WTS',   'nama_tempat' => 'Stasiun Wates',             'jenis_tempat' => 'stasiun', 'latitude' => -7.859508, 'longitude' => 110.157847, 'gambar' => null],
            ['kode_tempat' => 'STO',   'nama_tempat' => 'Stasiun Sentolo',           'jenis_tempat' => 'stasiun', 'latitude' => -7.833232, 'longitude' => 110.220120, 'gambar' => null],
            ['kode_tempat' => 'RWL',   'nama_tempat' => 'Stasiun Rewulu',            'jenis_tempat' => 'stasiun', 'latitude' => -7.796048, 'longitude' => 110.284224, 'gambar' => null],
            ['kode_tempat' => 'PTK',   'nama_tempat' => 'Stasiun Patukan',           'jenis_tempat' => 'stasiun', 'latitude' => -7.790779, 'longitude' => 110.325429, 'gambar' => null],
            ['kode_tempat' => 'TUG',   'nama_tempat' => 'Stasiun Tugu Jogja',        'jenis_tempat' => 'stasiun', 'latitude' => -7.789256, 'longitude' => 110.363481, 'gambar' => null],
            ['kode_tempat' => 'LPN',   'nama_tempat' => 'Stasiun Lempuyangan',       'jenis_tempat' => 'stasiun', 'latitude' => -7.790303, 'longitude' => 110.375519, 'gambar' => null],
            ['kode_tempat' => 'MGW',   'nama_tempat' => 'Stasiun Maguwo',            'jenis_tempat' => 'stasiun', 'latitude' => -7.784908, 'longitude' => 110.436901, 'gambar' => null],
            ['kode_tempat' => 'BRB',   'nama_tempat' => 'Stasiun Brambanan',         'jenis_tempat' => 'stasiun', 'latitude' => -7.756483, 'longitude' => 110.500419, 'gambar' => null],
            ['kode_tempat' => 'SRW',   'nama_tempat' => 'Stasiun Srowot',            'jenis_tempat' => 'stasiun', 'latitude' => -7.741355, 'longitude' => 110.549125, 'gambar' => null],
            ['kode_tempat' => 'KLT',   'nama_tempat' => 'Stasiun Klaten',            'jenis_tempat' => 'stasiun', 'latitude' => -7.712299, 'longitude' => 110.602916, 'gambar' => null],
            ['kode_tempat' => 'CPR',   'nama_tempat' => 'Stasiun Ceper',             'jenis_tempat' => 'stasiun', 'latitude' => -7.668834, 'longitude' => 110.674789, 'gambar' => null],
            ['kode_tempat' => 'DLG',   'nama_tempat' => 'Stasiun Delanggu',          'jenis_tempat' => 'stasiun', 'latitude' => -7.622201, 'longitude' => 110.706479, 'gambar' => null],
            ['kode_tempat' => 'GWK',   'nama_tempat' => 'Stasiun Gawok',             'jenis_tempat' => 'stasiun', 'latitude' => -7.589354, 'longitude' => 110.744398, 'gambar' => null],
            ['kode_tempat' => 'PWS',   'nama_tempat' => 'Stasiun Purwosari',         'jenis_tempat' => 'stasiun', 'latitude' => -7.561676, 'longitude' => 110.796355, 'gambar' => null],
            ['kode_tempat' => 'SLP',   'nama_tempat' => 'Stasiun Solo Balapan',      'jenis_tempat' => 'stasiun', 'latitude' => -7.557015, 'longitude' => 110.821259, 'gambar' => null],
            ['kode_tempat' => 'JBS',   'nama_tempat' => 'Stasiun Solo Jebres',       'jenis_tempat' => 'stasiun', 'latitude' => -7.562237, 'longitude' => 110.839458, 'gambar' => null],
            ['kode_tempat' => 'PLR',   'nama_tempat' => 'Stasiun Palur',             'jenis_tempat' => 'stasiun', 'latitude' => -7.568108, 'longitude' => 110.875705, 'gambar' => null],
            ['kode_tempat' => 'KMR',   'nama_tempat' => 'Stasiun Kemiri',            'jenis_tempat' => 'stasiun', 'latitude' => -7.534887, 'longitude' => 110.901355, 'gambar' => null],
            ['kode_tempat' => 'MSR',   'nama_tempat' => 'Stasiun Masaran',           'jenis_tempat' => 'stasiun', 'latitude' => -7.468044, 'longitude' => 110.947690, 'gambar' => null],
            ['kode_tempat' => 'SRG',   'nama_tempat' => 'Stasiun Sragen',            'jenis_tempat' => 'stasiun', 'latitude' => -7.468049, 'longitude' => 110.947690, 'gambar' => null],
            ['kode_tempat' => 'DPS',   'nama_tempat' => 'Dipo Lokomotif Solo',       'jenis_tempat' => 'gudang',  'latitude' => -7.556959, 'longitude' => 110.815541, 'gambar' => null],
            ['kode_tempat' => 'DPY',   'nama_tempat' => 'Dipo Lokomotif Yogyakarta', 'jenis_tempat' => 'gudang',  'latitude' => -7.788259, 'longitude' => 110.361882, 'gambar' => null],
            ['kode_tempat' => 'DAOP6', 'nama_tempat' => 'Kantor DAOP 6 Yogyakarta',  'jenis_tempat' => 'kantor',  'latitude' => -7.789856, 'longitude' => 110.372745, 'gambar' => null],
        ];

        foreach ($lokasiData as $lokasi) {
            Tempat::create($lokasi);
        }

        $this->command->info('Tempat seeder berhasil dijalankan!');
    }
}
