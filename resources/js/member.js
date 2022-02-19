import "./template";
import "./viewProfile";
import "./modifyProfile";
import {hideLoading} from "./utils";
import axios from "axios";
import Swal from 'sweetalert2';
import $ from 'jquery';

hideLoading();

if (profile) {
  profile.email = user.email;
}

$('#helloMsg').text(user.email)

document.getElementById('deleteAccountBtn').addEventListener('click', function() {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#00a0e9',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Deleting',
        didOpen: () => {
          Swal.showLoading();
        },
      });
      axios.delete('/user')
      .then(function () {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your account has been deleted.',
          confirmButtonColor: '#00a0e9',
        }).then(() => {
          location.reload();
        });
      })
      .catch(function() {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          confirmButtonColor: '#00a0e9',
        }).then(() => {
          location.reload();
        });
      })
    }
  });
  
})

$('#modifyPassword').on('submit', function (event) {
  if (!this.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation();
  }

  $(this).addClass('was-validated');
})

$('#modifyPassword').on('submit', function(event) {
  event.preventDefault();
  event.stopPropagation();
  let $this = $(this)
  Swal.fire({
    title: 'Processing',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
  axios.patch('/user/password', {
    currentPassword: $('#currentPassword').val(),
    newPassword: $('#newPassword').val()
  })
  .then(function() {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'You have changed Password successfully. Please log in again.',
      confirmButtonColor: '#00a0e9',
    }).then(() => {
      location.reload();
    });
  })
  .catch(function(error) {
    let errorMsg = '';

    if (error.response.data.notMatch) {
      errorMsg += 'Current password does not match. ';
    }
    if (error.response.data.lenghtError) {
      errorMsg += 'Length of new password should longer than eight.'
    }

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMsg,
      confirmButtonColor: '#00a0e9',
    })
  })
  .then(function() {
    $this.removeClass('was-validated')
  })
})
