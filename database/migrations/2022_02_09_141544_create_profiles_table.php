<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->bigInteger('uid')->unsigned();
            $table->string('givenName', 20);
            $table->string('middleName', 20)->nullable();
            $table->string('lastName', 20);
            $table->date('dateOfBirth');
            $table->enum('gender', ['Male', 'Female', 'Rather not say'])->default('Female');
            $table->string('phoneNumber', 20);
            $table->string('homeAddress', 100);
            $table->string('constituency', 255);
            $table->string('emailAddress', 100);
            $table->enum('jobPosition', ['Currently Employed', 'Currently Unemployment', 'Part-Time Employment', 'Self-employed'])->default('Currently Employed');
            $table->string('organization', 100)->nullable();
            $table->string('department', 100)->nullable();
            $table->string('objective', 1000);
            $table->enum('icdfTraining', array('Yes', 'No'))->default('No');
            $table->string('icdfProgramTitle', 100)->nullable();
            $table->date('icdfTrainingFrom')->nullable();
            $table->date('icdfTrainingTo')->nullable();
            $table->string('schoolName', 100);
            $table->string('subject', 100);
            $table->string('qualifications', 1000);
            $table->enum('relatedJobExperience', array('Yes', 'No'))->default('No');
            $table->string('relatedJobDescription', 1000)->nullable();
            $table->string('programme', 255);
            $table->string('nationalIDCard', 255);
            $table->string('recommendation', 255)->nullable();
            $table->timestamps();
            $table->foreign('uid')
                ->references('id')->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropForeign('profiles_uid_foreign');
        });
        Schema::dropIfExists('profiles');
    }
}
