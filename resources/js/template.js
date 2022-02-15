import $ from 'jquery';
import candidatePanel from "../template/candidate.html";
import viewProfile from "../template/viewProfile.html";
import modifyProfile from "../template/modifyProfile.html";

document
    .querySelector(".member-container")
    .insertAdjacentHTML("beforeend", candidatePanel);
document
    .getElementById("viewProfileContainer")
    .insertAdjacentHTML("beforeend", viewProfile);
document
    .getElementById("modifyProfileContainer")
    .insertAdjacentHTML("beforeend", modifyProfile);

$('.nav-link').on('click', function() {
    $('.nav-link').removeClass('active');
    $(this).addClass('active')
    let target = $(this).attr('data-bs-target');
    $('.tab-pane').removeClass('show active')
    $(target).addClass('show active')
})