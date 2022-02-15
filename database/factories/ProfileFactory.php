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
            'givenName' => 'Jenny',
            'middleName' =>  null,
            'lastName' => 'Chen',
            'dateOfBirth' => $this->faker->date(),
            'gender' => 'Female',
            'phoneNumber' => '123',
            'homeAddress' => '$this->faker->text',
            'constituency' => '$this->faker->text',
            'jobPosition' => 'Currently Employed',
            'organization' => null,
            'department' => null,
            'objective' => '$this->faker->text',
            'icdfTraining' => 'No',
            'icdfProgramTitle' => null,
            'icdfTrainingFrom' => null,
            'icdfTrainingTo' => null,
            'schoolName' => '$this->faker->text',
            'subject' => '$this->faker->text',
            'qualifications' => '$this->faker->text',
            'relatedJobExperience' => 'No',
            'relatedJobDescription' => null,
            'programme' => '$this->faker->text',
            'nationalIDCard' => '$this->faker->text',
            'recommendation' => null,
        ];
    }
}
