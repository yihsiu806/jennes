import $ from 'jquery';
import adminPanel from "../template/admin.html";
import * as bootstrap from 'bootstrap';
import axios from "axios";
import Swal from 'sweetalert2';
import 'datatables.net/js/jquery.dataTables.min.js';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-dt/js/dataTables.dataTables.min.js';
import 'datatables.net-select/js/dataTables.select.min.js';
import 'datatables.net-select-dt/js/select.dataTables.min.js';
import 'datatables.net-select-dt/css/select.dataTables.min.css';
import 'datatables.net-searchpanes/js/dataTables.searchPanes';
import 'datatables.net-buttons/js/dataTables.buttons.min.js';
import 'datatables.net-datetime/dist/dataTables.dateTime.min.js';
import 'datatables.net-datetime/dist/dataTables.dateTime.min.css';
import 'datatables.net-searchbuilder/js/dataTables.searchBuilder.min.js';
import 'datatables.net-searchbuilder-dt/js/searchBuilder.dataTables.min.js';
import 'datatables.net-searchbuilder-dt/css/searchBuilder.dataTables.min.css';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-buttons-dt/js/buttons.dataTables.min.js';
import 'datatables.net-buttons-dt/css/buttons.dataTables.min.css';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import jsZip from 'jszip';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
window.pdfMake = pdfMake;
window.JSZip = jsZip;

import { Chart, registerables} from 'chart.js';
Chart.register(...registerables);

import {hideLoading,getAge,format,downloadPDF } from './utils';


$.fn.dataTable.Api.register('row().show()', function() {
	var page_info = this.table().page.info();
	// Get row index
	var new_row_index = this.index();
	// Row position
	var row_position = this.table()
		.rows({ search: 'applied' })[0]
		.indexOf(new_row_index);
	// Already on right page ?
	if ((row_position >= page_info.start && row_position < page_info.end) || row_position < 0) {
		// Return row object
		return this;
	}
	// Find page number
	var page_to_display = Math.floor(row_position / this.table().page.len());
	// Go to that page
	this.table().page(page_to_display);
	// Return row object
	return this;
});

document
    .querySelector(".admin-container")
    .insertAdjacentHTML("beforeend", adminPanel);

$('.nav-link').on('click', function() {
    $('.nav-link').removeClass('active');
    $(this).addClass('active')
    let target = $(this).attr('data-bs-target');
    $('.tab-pane').removeClass('show active')
    $(target).addClass('show active')
})

// initialize bootstrap popover
var popoverTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="popover"]')
);
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl);
});

$('#adminName').text(me.email);

let $allUsersTable = null;
let $allCandidatesTable = null;
let promise = null;
let currentCandidate = null;
let $smallLoading = $('#smalLoading')

initDashboard();
initUsersTable();
initCandidatesTable();
fetchAllUsers();
fetchAllCandidates();
initModal();
initRating();
initExport();
initSettings();

hideLoading();

function initDashboard() {
  if (!stat) {
    return;
  }

  $('#totalUsers').text(stat.totalUsers || 'N/A')
  $('#totalCandidates').text(numberWithCommas(stat.totalCandidates))
  
  initProgrammeAnalysis();
  initConstituencyAnalysis();
  initAgeAnalysis();
  initGenderAnalysis();
  initJobAnalysis();

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function initProgrammeAnalysis() {
    let labels = stat.programme.map(item => {
      return item.programme;
    })
  
    let data = stat.programme.map(item => {
      return item.total
    })

    drawBarChart('programmeAnalysis', labels, data);
  }

  function initConstituencyAnalysis() {
    let labels = stat.constituency.map(item => {
      return item.constituency;
    })
  
    let data = stat.constituency.map(item => {
      return item.total
    })
    
    drawBarChart('constituencyAnalysis', labels, data);
  }

  function initAgeAnalysis() {
    let labels = stat.age.map(item => {
      return item.age;
    })
  
    let data = stat.age.map(item => {
      return item.total
    })
    
    drawBarChart('ageAnalysis', labels, data, 'line');
  }

  function initGenderAnalysis() {
    let labels = stat.gender.map(item => {
      return item.gender;
    })
  
    let data = stat.gender.map(item => {
      return item.total
    })
    
    drawBarChart('genderAnalysis', labels, data, 'pie');
  }

  function initJobAnalysis() {
    let labels = stat.job.map(item => {
      return item.jobPosition;
    })
  
    let data = stat.job.map(item => {
      return item.total
    })
    
    drawBarChart('jobAnalysis', labels, data);
  }

  function drawBarChart(id, labels, data, type='bar') {
    let ctx = document.getElementById(id).getContext('2d');
    new Chart(ctx, {
      type: type,
      data: {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
}

function initUsersTable() {
  let $tbody = $('#allUsers').find('tbody');

  $tbody.empty();

  $allUsersTable = $('#allUsers').DataTable({
    select: true,
    dom: `Q<'row justify-content-between'<'col-sm-12 col-md-4'B><'col-sm-12 col-md-4'l><'col-sm-12 col-md-4'f>>
            <'row'<'col-sm-12'tr>>
            <'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>`,
    buttons: {
      name: 'primary',
      buttons: ['copy', 'excel', 'pdf', 'print'],
    },
    select: {
      style: 'single',
    },
    order: [[2, 'asc']],
    // pageLength: 15,
  });
}

function initCandidatesTable() {
  let $tbody = $('#allCandidates').find('tbody');

  $tbody.empty();

  $allCandidatesTable = $('#allCandidates').DataTable({
    dom: `Q<'row justify-content-between'<'col-sm-12 col-md-4'B><'col-sm-12 col-md-4'l><'col-sm-12 col-md-4'f>>
            <'row'<'col-sm-12'tr>>
            <'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>`,
    buttons: {
      name: 'primary',
      buttons: ['copy', 'excel', 'pdf', 'print', 'colvis'],
    },
    order: [[7, 'desc']],
    select: true,
    select: {
      style: 'single',
    },
    // columnDefs: [
    //   {
    //     targets: 5,
    //     visible: false,
    //   },
    //   {
    //     targets: 6,
    //     visible: false,
    //   },
    // ],
  });
}

function fetchAllUsers() {
  $smallLoading.show();
  axios.get('/users').then(function(res) {
    updateUsersTable(res.data.data)
    if (res.data.next_page_url) {
      return fetchUsers(res.data.next_page_url)
    }
  })
  .catch(function(error) {
    console.log(error)
  })
  .then(function() {
    $smallLoading.hide();
  })

  function fetchUsers(url) {
    $smallLoading.show();
    return axios.get(url)
    .then(function(res) {
      updateUsersTable(res.data.data)
      if (res.data.next_page_url) {
        return fetchUsers(res.data.next_page_url)
      }
    })
    .catch(function() {

    })
    .then(function() {
      $smallLoading.hide();
    })
  }

  function updateUsersTable(users) {
    users.forEach(user => {
      let uid = user.id || 'N/A';
      let email = user.email || 'N/A';
      let role = user.permission || 'N/A';
      $allUsersTable.row.add([uid, email, role]);

      let currentPage = $allUsersTable.page();  
      $allUsersTable.page(currentPage).draw(false);
    })
  }
}

function fetchAllCandidates() {
  $smallLoading.show();
  axios.get('/candidates').then(function(res) {
    updateCandidatesTable(res.data.data)
    if (res.data.next_page_url) {
      return fetchCandidates(res.data.next_page_url)
    }
  })
  .catch(function() {

  })
  .then(function() {
    $smallLoading.hide();
  })

  function fetchCandidates(url) {
    $smallLoading.show();
    return axios.get(url)
    .then(function(res) {
      updateCandidatesTable(res.data.data)
      if (res.data.next_page_url) {
        return fetchCandidates(res.data.next_page_url)
      }
    })
    .catch(function(error) {
      console.log(error)
    })
    .then(function() {
      $smallLoading.hide();
    })
  }

  function updateCandidatesTable(candidates) {
    candidates.forEach(candidate => {
      let created = candidate.created_at.substring(0, 10);

      if (!candidate.score) {
        candidate.score = 0;
      }

      let rowNode = $allCandidatesTable.row
        .add([
          `${candidate.uid}`,
          `${candidate.programme}`,
          `${candidate.givenName} ${candidate.lastName}`,
          `${candidate.gender}`,
          `${getAge(candidate.dateOfBirth)}`,
          `${candidate.constituency}`,
          `${candidate.jobPosition}`,
          created,
          `${candidate.score}`,
        ])
        .node();

      $(rowNode).data(candidate);

      let currentPage = $allCandidatesTable.page();  
      $allCandidatesTable.page(currentPage).draw(false);

      let $dialog = $('#candidateDialog');
      let $modal = $('#candidateDetailModal');
      let $body = $('body');
      let $created = $('#candidateCreated')
      let $modified = $('#candidateModified')
      let $uid = $('#candidateUid');
      let $rating = $('input[type="radio"][name="rating"]');
      $(rowNode)
      .on('dblclick', function() {
        let $tr = $(this).closest('tr');
        let $row = $allCandidatesTable.row($tr);
        let index = $row.index();
        $row.select();
        $row.show().draw(false);

        let data = $tr.data();

        console.log(data)

        $rating.prop('checked', false);
        $rating.filter(`[value="${data.score}"]`).prop('checked', true);

        $uid.text(data.uid);
        $created.text(data.created_at)
        $modified.text(data.updated_at)

        $dialog.empty();
        $dialog.append(format(data));
        $modal.fadeIn();
        $body.addClass('hide-overflow');

        let $prevArrow = $('#previousCandidate');
        let $nextArrow = $('#nextCandidate');

        let pageInfo = $allCandidatesTable.page.info();
        let currentPage = pageInfo.page
        let totalPages = pageInfo.pages
        let totalRecords = pageInfo.recordsTotal

        if (index == 0 || ($tr.prev().length == 0 && currentPage == 0)) {
          $prevArrow.addClass('disable-arrow');
        } else {
          $prevArrow.removeClass('disable-arrow');
        }

        if (index == totalRecords - 1 || ($tr.next().length == 0 && currentPage == totalPages -1)) {
          $nextArrow.addClass('disable-arrow');
        } else {
          $nextArrow.removeClass('disable-arrow');
        }
      });
    })
  }
}

function initModal() {
  // close modal
  $('#closeCandidate').on('click', function () {
    $('#candidateDetailModal').fadeOut();
    $('body').removeClass('hide-overflow');
  });

  // previous
  $('#previousCandidate').on('click', function() {
    let $rows = $allCandidatesTable.rows('.selected');
    let pageInfo = $allCandidatesTable.page.info();
    let currentPage = pageInfo.page
    let $tr = $($rows.nodes()[0]);
    let $prevTr = $tr.prev();
    let $table = $('#allCandidates')

    if ($prevTr.length == 0) {
      if (currentPage == 0) {
        return;
      }
      $allCandidatesTable.page(currentPage - 1).draw(false);
      $prevTr = $table.find('tbody').find('tr');
      console.log($prevTr)
      if ($prevTr.length == 0) {
        return;
      }
      console.log($prevTr.last(0))
      $prevTr = $prevTr.last(0);
    }

    console.log('bbb')
    console.log($prevTr)
    $prevTr.trigger('dblclick');
  })

  // next
  $('#nextCandidate').on('click', function() {
    let $rows = $allCandidatesTable.rows('.selected');
    let pageInfo = $allCandidatesTable.page.info();
    let currentPage = pageInfo.page
    let totalPages = pageInfo.pages
    let $tr = $($rows.nodes()[0]);
    let $nextTr = $tr.next();
    let $table = $('#allCandidates')

    if ($nextTr.length == 0) {
      if (currentPage == totalPages - 1) {
        return;
      }
      $allCandidatesTable.page(currentPage + 1).draw(false);
      $nextTr = $table.find('tbody').find('tr');
      if ($nextTr.length == 0) {
        return;
      }
      $nextTr = $nextTr.first();
    }
    
    $nextTr.trigger('dblclick');
  })

  // download button
  $('#downloadCandidate').on('click', function () {
    let $row = $allCandidatesTable.rows('.selected');
    if ($row.nodes().length <= 0 || !$row.nodes()[0]) {
      return;
    }
    let profile = $($row.nodes()[0]).data();
    downloadPDF(profile);
  });
}

function initRating() {
  let $rating = $('input[type="radio"][name="rating"]');

  $rating.on('click', function() {
    let $row = $allCandidatesTable.rows('.selected');
    if ($row.nodes().length <= 0 || !$row.nodes()[0]) {
      return;
    }
    let profile = $($row.nodes()[0]).data()
    let score = $('input[type="radio"][name="rating"]:checked').val();
    if (!score) {
      score = 0;
    }
    profile.score = score;
    axios.patch('/score', {
      score: score,
      candidate: profile.uid
    })
  })
}

function initExport() {
  let $exportBtn = $('#exportBtn')
  $exportBtn.on('click', function() {
    Swal.fire({
      title: 'Processing',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    axios.get('/export')
    .then(function() {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Export successfully.',
        confirmButtonColor: '#00a0e9',
      })
    })
    .catch(function(error) {
      console.log(error)
    })
    .then(function() {
      Swal.close();
    })
  })
}

function initSettings() {
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
}