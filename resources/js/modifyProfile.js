import $ from "jquery";
import Swal from 'sweetalert2';
import axios from 'axios';
import { constituencies, programmeName } from "./data";
import { toggleProfilePanel } from "./utils";

// add option to select
(() => {
  let $programmeSelect = $('#modifyPanelProgrammeSelect');
  for (const name of Object.values(programmeName)) {
    $programmeSelect.append(
      `
      <option value="${name}">${name}</option>
    `
    );
  }
})();

// add option to select
constituencies.forEach((name) => {
    $("#constituencySelect").append(`
    <option value="${name}">${name}</option>
  `);
});

// initialize setlect option for date of birth
(() => {
  let yearEl = document.getElementById('yearOfBirth');
  let monthEl = document.getElementById('monthOfBirth');
  let dayEl = document.getElementById('dayOfBirth');
  // year range 1950 ~ 2008
  Array(58)
    .fill(1950)
    .map((x, y) => x + y)
    .forEach((year) => {
      yearEl.insertAdjacentHTML(
        'beforeend',
        `<option value="${year}">${year}</option>`
      );
    });
  // month Jan ~ Dec
  Array(12)
    .fill(1)
    .map((x, y) => x + y)
    .forEach((month) => {
      monthEl.insertAdjacentHTML(
        'beforeend',
        `<option value="${month}">${month}</option>`
      );
    });
  // day
  Array(31)
    .fill(1)
    .map((x, y) => x + y)
    .forEach((day) => {
      dayEl.insertAdjacentHTML(
        'beforeend',
        `<option value="${day}">${day}</option>`
      );
    });
  yearEl.addEventListener('change', modifyDays);
  monthEl.addEventListener('change', modifyDays);
  function modifyDays() {
    dayEl.querySelector('option[value="29"]').hidden = false;
    dayEl.querySelector('option[value="30"]').hidden = false;
    dayEl.querySelector('option[value="31"]').hidden = false;
    if (monthEl.value == '2') {
      dayEl.querySelector('option[value="30"]').hidden = true;
      dayEl.querySelector('option[value="31"]').hidden = true;
      if (!isLeapYear(yearEl.value)) {
        dayEl.querySelector('option[value="29"]').hidden = true;
      }
    } else if (['4', '6', '9', '11'].includes(monthEl.value)) {
      dayEl.querySelector('option[value="31"]').hidden = true;
    }
  }
  function isLeapYear(yyyy) {
    yyyy = parseInt(yyyy);
    if ((yyyy % 4 == 0 && yyyy % 100 != 0) || yyyy % 400 == 0) {
      return true;
    } else {
      return false;
    }
  }
})();

// initialize bootstrap form validation
 (() => {
  let forms = document.querySelectorAll('.needs-validation');
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      'submit',
      function (event) {
        form.classList.add('was-validated');
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          let $errorInput = $(
            '.form-control:invalid, .form-control.is-invalid'
          );
          let $errorRadio = $(
            '.was-validated .form-check-input:invalid~.form-check-label'
          );
          if ($errorInput.length > 0) {
            $errorInput.get(0).focus();
          } else if ($errorRadio.length > 0) {
            // $errorRadio.get(0).scrollIntoView();
            $errorRadio.get(0).focus();
          }
        } else if (
          !document.getElementById('chooseNationalIdCardPhoto').photoString
        ) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();

          $('#national-id-card-warning').show();
          $('#nidlabel').get(0).scrollIntoView();

          setTimeout(() => {
            Swal.fire({
              title: 'Required',
              text: `Please provide your National ID Card.`,
              icon: 'warning',
              confirmButtonColor: '#00a0e9',
            });
          }, 600);
        }
      },
      false
    );
  });
})();

(() => {
  let $photo = $('#nationalIdCardPhoto');
  let $btn = $('#chooseNationalIdCardPhoto');
  $btn.on('change', function (event) {
    $('#national-id-card-warning').hide();
    if (event.target.files.length <= 0) {
      return;
    }

    let filesize = (event.target.files[0].size / 1024 / 1024).toFixed(2); //MiB

    if (filesize > 5) {
      Swal.fire({
        title: 'File size limit',
        text: `File is too big (${filesize}MiB). Max filesize: 5MiB.`,
        icon: 'warning',
        confirmButtonColor: '#00a0e9',
      });
      $btn.val('');
      return;
    }

    let src = URL.createObjectURL(event.target.files[0]);

    $photo.attr('src', src);

    var fr = new FileReader();
    fr.addEventListener('load', function (e) {
      let result = e.target.result;
      document.getElementById('chooseNationalIdCardPhoto').photoString = result;
    });

    fr.readAsDataURL(event.target.files[0]);
  });
})();

(() => {
  let btnEl = document.getElementById('recommendation');
  btnEl.fileString = '';
  btnEl.fileName = '';
  btnEl.addEventListener('change', function (event) {
    if (event.target.files.length <= 0) {
      return;
    }

    let filesize = (event.target.files[0].size / 1024 / 1024).toFixed(2); //MiB

    if (filesize > 5) {
      Swal.fire({
        title: 'File size limit',
        text: `File is too big (${filesize}MiB). Max filesize: 5MiB.`,
        icon: 'warning',
        confirmButtonColor: '#00a0e9',
      });
      btnEl.value = '';
      return;
    }

    var fr = new FileReader();
    fr.addEventListener('load', function (e) {
      let result = e.target.result;
      btnEl.fileString = result;
      btnEl.fileName = event.target.files[0].name;
    });

    fr.readAsDataURL(event.target.files[0]);
  });
})();

(() => {
  $('#givenName').on('input', function () {
    let limit = 20;
    if (this.value.length > limit) {
      Swal.fire({
        title: 'Text length limit',
        text: `${limit} characters max.`,
        icon: 'warning',
        confirmButtonColor: '#00a0e9',
      });
      this.value = this.value.slice(0, limit);
    }
  });

  $('#middleName').on('input', function () {
    let limit = 20;
    if (this.value.length > limit) {
      Swal.fire({
        title: 'Text length limit',
        text: `${limit} characters max.`,
        icon: 'warning',
        confirmButtonColor: '#00a0e9',
      });
      this.value = this.value.slice(0, limit);
    }
  });

  $('#lastName').on('input', function () {
    let limit = 20;
    if (this.value.length > limit) {
      Swal.fire({
        title: 'Text length limit',
        text: `${limit} characters max.`,
        icon: 'warning',
        confirmButtonColor: '#00a0e9',
      });
      this.value = this.value.slice(0, limit);
    }
  });

  $('#phoneNumber').on('input', function () {
    let limit = 20;
    if (this.value.length > limit) {
      Swal.fire({
        title: 'Text length limit',
        text: `${limit} characters max.`,
        icon: 'warning',
        confirmButtonColor: '#00a0e9',
      });
      this.value = this.value.slice(0, limit);
    }
  });

  $('#homeAddress').on('input', function () {
    let limit = 100;
    if (this.value.length > limit) {
      Swal.fire({
        title: 'Text length limit',
        text: `${limit} characters max.`,
        icon: 'warning',
        confirmButtonColor: '#00a0e9',
      });
      this.value = this.value.slice(0, limit);
    }
  });

  $(
    '#organization, #department, #icdfProgramTitle, #schoolName, #subject'
  ).on('input', function () {
    let limit = 100;
    if (this.value.length > limit) {
      Swal.fire({
        title: 'Text length limit',
        text: `${limit} characters max.`,
        icon: 'warning',
        confirmButtonColor: '#00a0e9',
      });
      this.value = this.value.slice(0, limit);
    }
  });

  $('#qualifications').on('input', function () {
    let limit = 1000;
    if (this.value.length > limit) {
      Swal.fire({
        title: 'Text length limit',
        text: `${limit} characters max.`,
        icon: 'warning',
        confirmButtonColor: '#00a0e9',
      });
      this.value = this.value.slice(0, limit);
    }
  });

  $('#relatedJobDescription, #objective').on('input', function () {
    let limit = 1000;
    if (this.value.length > limit) {
      Swal.fire({
        title: 'Text length limit',
        text: `${limit} characters max.`,
        icon: 'warning',
        confirmButtonColor: '#00a0e9',
      });
      this.value = this.value.slice(0, limit);
    }
  });
})();

fillOutProfile();

function fillOutProfile() {
  if (!profile) {
    return;
  }
  
  if (profile.programme) {
    if (Object.values(programmeName).indexOf(profile.programme) > -1) {
      $('#modifyPanelProgrammeSelect').val(profile.programme);
    }
  }

  if (profile.givenName) {
    $('#givenName').val(profile.givenName);
  }

  if (profile.middleName) {
    $('#middleName').val(profile.middleName);
  }

  if (profile.lastName) {
    $('#lastName').val(profile.lastName);
  }

  if (profile.constituency) {
    $('#constituency').val(profile.constituency);
  }

  if (profile.dateOfBirth) {
    let year, month, day;
    [, year, month, day] = profile.dateOfBirth.match(/(\d{4})-(\d{2})-(\d{2})/);
    year = parseInt(year);
    month = parseInt(month);
    day = parseInt(day);

    let yearSelectEl = document.getElementById('yearOfBirth');
    let monthSelectEl = document.getElementById('monthOfBirth');
    let daySelectEl = document.getElementById('dayOfBirth');

    if (
      yearSelectEl.querySelector(`option[value="${year}"]`) &&
      monthSelectEl.querySelector(`option[value="${month}"]`) &&
      daySelectEl.querySelector(`option[value="${day}"]`)
    ) {
      yearSelectEl.value = year;
      monthSelectEl.value = month;
      daySelectEl.value = day;
    }
  }

  if (profile.gender) {
    let target = document.querySelector(
      `input[name="gender"][value="${profile.gender}"]`
    );
    if (target) {
      target.checked = true;
    }
  }

  if (profile.phoneNumber) {
    document.getElementById('phoneNumber').value = profile.phoneNumber;
  }

  if (profile.homeAddress) {
    document.getElementById('homeAddress').value = profile.homeAddress;
  }

  // if (profile.emailAddress) {
  //   document.getElementById('emailAddress').value = profile.emailAddress;
  // } else if (getUserInfo().email) {
  //   document.getElementById('emailAddress').value = getUserInfo().email;
  // }

  if (profile.jobPosition) {
    let target = document.querySelector(
      `input[name="jobPosition"][value="${profile.jobPosition}"]`
    );
    if (target) {
      target.checked = true;
    }
  }

  if (profile.organization) {
    document.getElementById('organization').value = profile.organization;
  }

  if (profile.department) {
    document.getElementById('department').value = profile.department;
  }

  if (profile.objective) {
    document.getElementById('objective').value = profile.objective;
  }

  if (profile.icdfTraining) {
    let target = document.querySelector(
      `input[name="icdfTraining"][value="${profile.icdfTraining}"]`
    );
    if (target) {
      target.checked = true;
    }
  }

  if (profile.icdfProgramTitle) {
    document.getElementById('icdfProgramTitle').value = profile.icdfProgramTitle;
  }

  if (profile.icdfTrainingFrom) {
    document.getElementById('icdfTrainingFrom').value = profile.icdfTrainingFrom;
  }

  if (profile.icdfTrainingTo) {
    document.getElementById('icdfTrainingTo').value = profile.icdfTrainingTo;
  }

  if (profile.schoolName) {
    document.getElementById('schoolName').value = profile.schoolName;
  }

  if (profile.subject) {
    document.getElementById('subject').value = profile.subject;
  }

  if (profile.qualifications) {
    document.getElementById('qualifications').value = profile.qualifications;
  }

  if (profile.relatedJobExperience) {
    let target = document.querySelector(
      `input[name="relatedJobExperience"][value="${profile.relatedJobExperience}"]`
    );
    if (target) {
      target.checked = true;
    }
  }

  if (profile.relatedJobDescription) {
    document.getElementById('relatedJobDescription').value =
      profile.relatedJobDescription;
  }
  
  if (profile.nationalIDCard) {
    let photoEl = document.getElementById('nationalIdCardPhoto');
    let btnEl = document.getElementById('chooseNationalIdCardPhoto');
    photoEl.src = profile.nationalIDCard;
    btnEl.photoString = 'exist';
  }
}

$('#cancelModifyProfileBtn')
  .on('click', function () {
    toggleProfilePanel();
    $('#profileForm').removeClass('was-validated');
    window.scrollTo(0, 0);
});

$('#updateProfileBtn').on('click', function () {
  $('#hiddenSubmit').trigger('click');
});

$('#profileForm')
.on('submit', function (event) {
  event.preventDefault();
  event.stopPropagation();
  saveProfile();
});

function saveProfile() {
  startFormUpdate();

  let userProfile = {
    givenName: $('#givenName').val(),
    middleName: $('#middleName').val(),
    lastName: $('#lastName').val(),
    dateOfBirth: `${document.getElementById('yearOfBirth').value}-${(
      '0' + document.getElementById('monthOfBirth').value
    ).slice(-2)}-${('0' + document.getElementById('dayOfBirth').value).slice(
      -2
    )}`,
    gender: document.querySelector('input[name="gender"]:checked').value,
    phoneNumber: document.getElementById('phoneNumber').value,
    homeAddress: document.getElementById('homeAddress').value,
    constituency: $('#constituencySelect').val(),
    // emailAddress: document.getElementById('emailAddress').value,
    jobPosition: document.querySelector('input[name="jobPosition"]:checked').value,
    organization: document.getElementById('organization').value,
    department: document.getElementById('department').value,
    objective: document.getElementById('objective').value,
    icdfTraining: document.querySelector('input[name="icdfTraining"]:checked')
      .value,
    icdfProgramTitle: document.getElementById('icdfProgramTitle').value,
    icdfTrainingFrom: document.getElementById('icdfTrainingFrom').value,
    icdfTrainingTo: document.getElementById('icdfTrainingTo').value,
    schoolName: document.getElementById('schoolName').value,
    subject: document.getElementById('subject').value,
    qualifications: document.getElementById('qualifications').value,
    relatedJobExperience: document.querySelector(
      'input[name="relatedJobExperience"]:checked'
    ).value,
    relatedJobDescription: document.getElementById('relatedJobDescription')
      .value,
    programme: $('#modifyPanelProgrammeSelect').val(),
    // nationalIDCard: document.getElementById('chooseNationalIdCardPhoto').photoString,
    // recommendation: document.getElementById('recommendation').fileString,
    // recommendationName: document.getElementById('recommendation').fileName,
  };

  let nationalIDCardContent = document.getElementById('chooseNationalIdCardPhoto')
  .photoString;
  if (nationalIDCardContent && nationalIDCardContent != 'exist') {
    userProfile['nationalIDCard'] = nationalIDCardContent;
  }

  if (document.getElementById('recommendation').fileString) {
    userProfile['recommendation'] = document.getElementById('recommendation').fileString;
  }

  let req = null;

  if (profile && profile.uid) {
    req = axios.patch(`/profile/${profile.uid}`, userProfile)
  } else {
    req = axios.post('/profile', userProfile)
  }

    req.then(function (response) {
        
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function() {
        console.log('finish')
        endFormUpdate();
      });
}

function startFormUpdate() {
  window.scrollTo(0, 0);
  Swal.fire({
    title: 'Saving',
    didOpen: () => {
      Swal.showLoading();
    },
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
  document.getElementById('cancelModifyProfileBtn').disabled = true;
  document.getElementById('updateProfileBtn').disabled = true;
}

function endFormUpdate() {
  document.getElementById('cancelModifyProfileBtn').disabled = false;
  document.getElementById('updateProfileBtn').disabled = false;
  document.getElementById('profileForm').classList.remove('was-validated');
  Swal.close();
  $('#viewProfileContainer').fadeToggle();
  $('#modifyProfileContainer').fadeToggle();
  location.reload();
}