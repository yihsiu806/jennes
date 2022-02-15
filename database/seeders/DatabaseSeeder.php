<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Schema::disableForeignKeyConstraints();
        // \App\Models\User::factory(1000)->create();

        // $users = \App\Models\User::all(['id']);

        \App\Models\Profile::factory(1000)->create();
        // Schema::enableForeignKeyConstraints();
    }
}
