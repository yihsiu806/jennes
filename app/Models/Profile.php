<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'uid',
        'givenName',
        'middleName',
        'lastName',
        'dateOfBirth',
        'gender',
        'phoneNumber',
        'homeAddress',
        'constituency',
        'emailAddress',
        'jobPosition',
        'organization',
        'department',
        'objective',
        'icdfTraining',
        'icdfProgramTitle',
        'icdfTrainingFrom',
        'icdfTrainingTo',
        'schoolName',
        'subject',
        'qualifications',
        'relatedJobExperience',
        'relatedJobDescription',
        'programme',
        'nationalIDCard',
        'recommendation',
    ];
}
