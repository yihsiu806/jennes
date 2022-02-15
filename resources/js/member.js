import "./template";
import "./viewProfile";
import "./modifyProfile";
import {hideLoading} from "./utils";
import axios from "axios";
import Swal from 'sweetalert2';

hideLoading();

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