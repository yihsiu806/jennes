import axios from "axios";
import $ from "jquery";
import Swal from 'sweetalert2';
import {programmeName, programmeThumb} from './data';
import {toggleProfilePanel, getAge, downloadPDF } from './utils';

if (!profile) {
  $('#modifyProfileBtn').text('Create');
  $('#noProgrammeApplied').show();
  $('#hasProgrammeApplied').hide();
} else {
  $( '#downloadProfilePDFBtn' ).prop( 'disabled', false );
  $('#modifyBtn').text('Modify');
  $('#displayNoProfileData').hide();
  $('#displayProfileData').show();
  $('#profileName').text(
    `${profile.givenName} ${profile.middleName || ''} ${profile.lastName}`
  );
  $('#profileBirthday').text(profile.dateOfBirth);
  $('#profileAge').text(getAge(profile.dateOfBirth));
  $('#profileGender').text(profile.gender);
  $('#profileConstituency').text(profile.constituency);
  $('#profilePhoneNumber').text(profile.phoneNumber);
  $('#profileHomeAddress').text(profile.homeAddress);
  $('#profileEmail').text(user.email);
  $('#profileJobPosition').text(profile.jobPosition);
  $('#profileOrganization').text(profile.organization || 'N/A');
  $('#profileDepartment').text(profile.department || 'N/A');
  $('#profileObjective').text(profile.objective);
  $('#profileIcdfTraining').text(profile.icdfTraining);
  $('#profileIcdfProgramTitle').text(profile.icdfProgramTitle || 'N/A');
  let trainingPeorid;
  if (profile.icdfTrainingFrom || profile.icdfTrainingTo) {
    trainingPeorid = `${profile.icdfTrainingFrom} ~ ${profile.icdfTrainingTo}`;
  } else {
    trainingPeorid = 'N/A';
  }
  $('#profileicdfTrainingPeorid').text(trainingPeorid);
  $('#profileSchool').text(profile.schoolName);
  $('#profileSubject').text(profile.subject);
  $('#profileQualifications').text(profile.qualifications);
  $('#profileRelatedJobExperience').text(profile.relatedJobExperience);
  $('#profileRelatedJobDescription').text(profile.relatedJobDescription || 'N/A');
  $('#profileNationalIdCard').attr('src', profile.nationalIDCard);
  $('#profileRecommendation').text('Recommendation' || 'N/A');
}

$('#downloadProfilePDFBtn').on('click', function () {
  // window.print();

  if (!profile) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
    });
    return;
  }

  downloadPDF(profile);
});

if (profile) {
  let target = profile.programme;
  if (programmeName.indexOf(profile.programme) < 0) {
    target = programmeName[0];
  }
  $('#programmeName').text(target);
  $('#programmeThumb').attr('src', '/images/' + programmeThumb[target]);

  $('#noProgrammeApplied').hide();
  $('#hasProgrammeApplied').show();
}

$('#modifyProfileBtn').on('click', function () {
  toggleProfilePanel();
});

if (profile && profile.recommendation) {
  $('#profileRecommendationDownload').show();
  $('#profileNoRecommendation').hide();
} else {
  $('#profileRecommendationDownload').hide();
  $('#profileNoRecommendation').show();
}

$('#downloadRecommendation').on('click', function () {
  if (!profile || !profile.recommendation) {
    return;
  }

  let ext = profile.recommendation.split('.').pop();

  let dlnk = document.getElementById('downloadRecommendationLink');
  dlnk.setAttribute('download', 'Recommendation.'+ext);
  dlnk.href = profile.recommendation;

  dlnk.click();
});

$('#removeRecommendation').on('click', function() {
  axios.delete('/profile/recommendation')
  .finally(function() {
    profile.recommendation = null;
    $('#profileRecommendationDownload').hide();
    $('#profileNoRecommendation').show();
    Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      text: 'Recommendation file has been deleted.',
      confirmButtonColor: '#00a0e9',
    })
  })
})