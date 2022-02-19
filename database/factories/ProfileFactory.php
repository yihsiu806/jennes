<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\User;
use Illuminate\Support\Str;

class ProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'uid' => \App\Models\User::all()->random()->id,
            'givenName' => $this->faker->text(10),
            'middleName' =>  $this->faker->text(10),
            'lastName' => $this->faker->text(10),
            'dateOfBirth' => $this->faker->dateTimeBetween('1950-01-01 00:00:00', '2008-12-31 23:59:59'),
            'gender' => $this->faker->randomElement(['Male', 'Female']),
            'phoneNumber' => $this->faker->phoneNumber,
            'homeAddress' => $this->faker->Address,
            'constituency' => $this->faker->randomElement([
                "Gros Islet",
                "Babonneau",
                "Castries North",
                "Castries East",
                "Castries Central",
                "Castries South",
                "Anse-La-Raye/Canaries",
                "Soufriere",
                "Choiseul",
                "Laborie",
                "Vieux-Fort South",
                "Vieux-Fort North",
                "Micoud South",
                "Micoud North",
                "Dennery South",
                "Dennery North",
                "Castries South East",
            ]),
            'jobPosition' => $this->faker->randomElement(['Currently Employed', 'Currently Unemployment', 'Part-Time Employment', 'Self-employed']),
            'organization' => null,
            'department' => null,
            'objective' => $this->faker->text(100),
            'icdfTraining' => 'No',
            'icdfProgramTitle' => null,
            'icdfTrainingFrom' => null,
            'icdfTrainingTo' => null,
            'schoolName' => $this->faker->text(20),
            'subject' => $this->faker->text(20),
            'qualifications' => $this->faker->text(20),
            'relatedJobExperience' => 'No',
            'relatedJobDescription' => null,
            'programme' => $this->faker->randomElement([
                'Digital and Creative Entrepreneurship',
                'Early Childhood Development Aide',
                'Health Aide',
                'Hospitality',
            ]),
            'nationalIDCard' => $this->faker->text(10),
            'recommendation' => null,
        ];
    }
}
