<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed locations first, then assets
        $this->call([
            TempatSeeder::class,
            AssetSeeder::class,
        ]);

        // Create a test user
        User::create([
            'name' => 'Test User',
            'email' => 'test@gmail.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
        ]);
    }
}
