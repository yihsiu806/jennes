import $ from 'jquery';
import moment from 'moment';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export function toggleProfilePanel() {
  $('#viewProfileContainer').fadeToggle();
  $('#modifyProfileContainer').fadeToggle();
}

export function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function showLoading() {
  let spinnerEl = document
    .querySelector('.page-preloader')
    .querySelector('.spinner');
  let preloaderEl = document.querySelector('.page-preloader');

  preloaderEl.style.display = 'block';
  spinnerEl.classList.add('show');
  spinnerEl.classList.remove('hide');
  preloaderEl.classList.add('show');
  preloaderEl.classList.remove('hide-slow');
}

export function hideLoading() {
  let spinnerEl = document
    .querySelector('.page-preloader')
    .querySelector('.spinner');
  let preloaderEl = document.querySelector('.page-preloader');

  preloaderEl.style.display = 'none';
  spinnerEl.classList.remove('show');
  spinnerEl.classList.add('hide');
  preloaderEl.classList.remove('show');
  preloaderEl.classList.add('hide-slow');
}

export async function downloadPDF(profile) {
  let docDefinition = genDocDefinition(profile)
  

  if (profile.recommendation) {
    let ext = profile.recommendation.split('.').pop();

    if (ext != 'pdf') {
      let recommendationImage = await getBase64ImageFromURL(profile.recommendation)
      docDefinition.content[0].table.body.push([
        {
          image: recommendationImage,
          width: 350,
          colSpan: 2,
        },
        {},
      ]);
    }
  } else {
    docDefinition.content[0].table.body.push([
      {
        text: 'N/A',
        colSpan: 2,
      },
      {},
    ]);
  }

  const ddPdf = pdfMake.createPdf(docDefinition);
  if (!profile.recommendation || profile.recommendation.split('.').pop() != 'pdf') {
    ddPdf.download(`${profile.givenName} ${profile.lastName}.pdf`);
  } else if (profile.recommendation.split('.').pop() == 'pdf') {
    mergePdf();
  }

  async function mergePdf() {
    const pdfAttachmentBytes = await new Promise(function (resolve, reject) {
      ddPdf.getBlob((blob) => {
        resolve(blob);
      });
    }).then((res) => res.arrayBuffer());

    const recommendationAttachmentBytes = await fetch(
      profile.recommendation
    ).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.create();

    const pdfA = await PDFDocument.load(pdfAttachmentBytes);
    const pdfB = await PDFDocument.load(recommendationAttachmentBytes);

    const copiedPagesA = await pdfDoc.copyPages(pdfA, pdfA.getPageIndices());
    copiedPagesA.forEach((page) => pdfDoc.addPage(page));

    const copiedPagesB = await pdfDoc.copyPages(pdfB, pdfB.getPageIndices());
    copiedPagesB.forEach((page) => pdfDoc.addPage(page));

    const pdfBytes = await pdfDoc.save();

    saveByteArray(`${profile.givenName} ${profile.lastName}.pdf`, pdfBytes);

    function saveByteArray(reportName, byte) {
      var blob = new Blob([byte], { type: 'application/pdf' });
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      var fileName = reportName;
      link.download = fileName;
      link.click();
    }
  }

  function downloadZip() {
    let zip = new JSZip();
    let promiseRecommendation = fetch(profile.recommendation)
      .then((res) => res.blob())
      .then(function (bString) {
        zip.file(profile.recommendationName, bString, {
          binary: true,
        });
      });

    let promisePdf = new Promise(function (resolve, reject) {
      ddPdf.getBlob((blob) => {
        zip.file(
          `${moment().unix()}-${profile.givenName} ${profile.lastName}.pdf`,
          blob,
          {
            binary: true,
          }
        );
        resolve();
      });
    });

    Promise.allSettled([promiseRecommendation, promisePdf]).then(() => {
      zip.generateAsync({ type: 'blob' }).then(function (content) {
        saveAs(
          content,
          `${moment().format('DD-MM-YYYY')}-${profile.givenName}-${
            profile.lastName
          }.zip`
        );
      });
    });
  }
}

export function genDocDefinition(profile) {
  let icdfTrainingDuration =
    profile.icdfTrainingFrom && profile.icdfTrainingTo
      ? `${profile.icdfTrainingFrom} ~ ${profile.icdfTrainingTo}`
      : 'N/A';

  let docDefinition = {
    content: [
      {
        // layout: 'lightHorizontalLines', // optional
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 0,
          widths: ['auto', '*'],

          body: [
            [
              {
                text: 'Programme',
                style: 'tableHeader',
                colSpan: 2,
                alignment: 'center',
              },
              {},
            ],
            [
              {
                text: profile.programme,
                colSpan: 2,
                alignment: 'center',
                fontSize: 16,
              },
              {},
            ],
            [
              { text: 'Name', style: 'tableHeader' },
              {
                text: `${profile.givenName} ${
                  profile.middleName ? profile.middleName : ''
                } ${profile.lastName}`,
              },
            ],

            [
              { text: 'Date of Birth', style: 'tableHeader' },
              { text: profile.dateOfBirth },
            ],
            [
              { text: 'Age', style: 'tableHeader' },
              { text: getAge(profile.dateOfBirth) },
            ],
            [
              { text: 'Gender', style: 'tableHeader' },
              { text: profile.gender },
            ],
            [
              { text: 'Phone Number', style: 'tableHeader' },
              { text: profile.phoneNumber },
            ],
            [
              { text: 'Constituency', style: 'tableHeader' },
              { text: profile.constituency },
            ],
            [
              { text: 'Home Address', style: 'tableHeader' },
              { text: profile.homeAddress },
            ],
            [
              { text: 'E-Mail Address', style: 'tableHeader' },
              { text: user.email },
            ],
            [
              { text: 'Job Position', style: 'tableHeader' },
              { text: profile.jobPosition },
            ],
            [
              {
                text: 'If employed, what is the name of your organization?',
                style: 'tableHeader',
                colSpan: 2,
              },
              {},
            ],
            [
              {
                text: profile.organization ? profile.organization : 'N/A',
                colSpan: 2,
              },
              {},
            ],
            [
              {
                text: 'If employed, which department or division do you work in, within your organization?',
                style: 'tableHeader',
                colSpan: 2,
              },
              {},
            ],
            [
              {
                text: profile.department ? profile.department : 'N/A',
                colSpan: 2,
              },
              {},
            ],
            [
              {
                text: 'Please indicate your reason(s) for applying to this programme.',
                style: 'tableHeader',
                colSpan: 2,
              },
              {},
            ],
            [
              {
                text: profile.objective ? profile.objective : 'N/A',
                colSpan: 2,
              },
              {},
            ],
            [
              {
                text: 'Do you have any previous training with Taiwan ICDF?',
                style: 'tableHeader',
                colSpan: 2,
              },
              {},
            ],
            [
              {
                text: profile.icdfTraining ? profile.icdfTraining : 'N/A',
                colSpan: 2,
              },
              {},
            ],
            [
              {
                text: 'If yes, what is the training program title?',
                style: 'tableHeader',
                colSpan: 2,
              },
              {},
            ],
            [
              {
                text: profile.icdfProgramTitle
                  ? profile.icdfProgramTitle
                  : 'N/A',
                colSpan: 2,
              },
              {},
            ],
            [
              {
                text: 'If yes, what is the training program period?',
                style: 'tableHeader',
                colSpan: 2,
              },
              {},
            ],
            [
              {
                text: icdfTrainingDuration,
                colSpan: 2,
              },
              {},
            ],

            [
              { text: 'School Name', style: 'tableHeader' },
              { text: profile.schoolName },
            ],

            [
              { text: 'Subject', style: 'tableHeader' },
              { text: profile.subject },
            ],

            [
              { text: 'Qualifications', style: 'tableHeader' },
              { text: profile.qualifications },
            ],

            [
              {
                text: 'Do you have any related job experience?',
                style: 'tableHeader',
                colSpan: 2,
              },
              {},
            ],
            [
              {
                text: profile.relatedJobExperience
                  ? profile.relatedJobExperience
                  : 'N/A',
                colSpan: 2,
              },
              {},
            ],

            [
              {
                text: 'If yes, please specify.',
                style: 'tableHeader',
                colSpan: 2,
              },
              {},
            ],
            [
              {
                text: profile.relatedJobDescription
                  ? profile.relatedJobDescription
                  : 'N/A',
                colSpan: 2,
              },
              {},
            ],

            [
              {
                text: 'National ID Card',
                style: 'tableHeader',
                colSpan: 2,
              },
              {},
            ],
            [
              {
                image: getBase64Image(document.getElementById("profileNationalIdCard"))
                ,
                width: 350,
                height: 200,
                colSpan: 2,
              },
              {},
            ],
            [
              {
                text: 'Recommendation',
                style: 'tableHeader',
                colSpan: 2,
              },
              {},
            ],
          ],
        },
      },
    ],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black',
      },
      tableInfo: {
        fontSize: 18,
        margin: [0, 0, 20, 0],
      },
    },
  };

  return docDefinition;
}

function getBase64ImageFromURL(url) {
  return new Promise((resolve, reject) => {

    let img = new Image();
    img.onload = () => {
      var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          var dataURL = canvas.toDataURL();
          resolve(dataURL);
    }
  
    img.onerror = error => {
      reject(error);
    }
  
    img.src = url;
  });
}

function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL();
  // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  return dataURL;
}

export function format(profile, id) {
  return `
    <table ${
      id ? `id="${id}"` : ''
    } cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; min-width: 80%;">
      <thead></thead>

      <tbody>
        <tr>
          <td rowspan="5"><img src="${
            profile.photo == 'no photo' ? noPhotoBase64 : profile.photo
          }" class="ui-cv-photo"></td>
        </tr>

        <tr>
          <td>Name</td>
          <td>${profile.givenName} ${
    profile.middleName ? profile.middleName : ''
  } ${profile.lastName} </td>
        </tr>

        <tr>
          <td>Date of Birth</td>
          <td>${profile.dateOfBirth}</td>
        </tr>

        <tr>
          <td>Age</td>
          <td>${getAge(profile.dateOfBirth)}</td>
        </tr>

        <tr>
          <td>Gender</td>
          <td colspan="2">${profile.gender}</td>
        </tr>
        <tr>
          <td>Phone Number</td>
          <td colspan="2">${profile.phoneNumber}</td>
        </tr>

        <tr>
          <td>Constituency</td>
          <td colspan="2">${profile.constituency}</td>
        </tr>

        <tr>
          <td>Home Address</td>
          <td colspan="2">${profile.homeAddress}</td>
        </tr>

        <tr>
          <td>E-Mail Address</td>
          <td colspan="2">${profile.emailAddress}</td>
        </tr>

        <tr>
          <td>Job Position</td>
          <td colspan="2">${profile.jobPosition}</td>
        </tr>

        <tr>
          <td colspan="3">If employed, what is the name of your organization?</td>
        </tr>

        <tr>
          <td colspan="3">${
            profile.organization ? profile.organization : 'N/A'
          }</td>
        </tr>

        <tr>
          <td colspan="3">If employed, which department or division do you work in, within your organization?</td>
        </tr>

        <tr>
          <td colspan="3">${
            profile.department ? profile.department : 'N/A'
          }</td>
        </tr>
        
        <tr>
          <td>programme:</td>
          <td colspan="2">${profile.programme}</td>
        </tr>
        
        <tr>
          <td colspan="3">Please indicate your reason(s) for applying to this programme.</td>
        </tr>
        <tr>
          <td colspan="3">${profile.objective}</td>
        </tr>
        <tr>
          <td colspan="3">Do you have any previous training with Taiwan ICDF?</td>
        </tr>
        <tr>
          <td colspan="3">${profile.icdfTraining}</td>
        </tr>
        <tr>
          <td colspan="3">If yes, what is the training program title?</td>
        </tr>
        <tr>
          <td colspan="3">${
            profile.icdfProgramTitle ? profile.icdfProgramTitle : 'N/A'
          }</td>
        </tr>
        <tr>
          <td colspan="3">If yes, what is the training program period?</td>
        </tr>
        <tr>
          <td colspan="3">${
            profile.icdfTrainingFrom && profile.icdfTrainingTo
              ? `${profile.icdfTrainingFrom} ~ ${profile.icdfTrainingTo}`
              : 'N/A'
          }</td>
        </tr>
        <tr>
          <td>School Name</td>
          <td colspan="2">${profile.schoolName}</td>
        </tr>
        <tr>
          <td>Subject</td>
          <td colspan="2">${profile.subject}
        </tr>
        <tr>
          <td>Qualifications</td>
          <td colspan="2">${profile.qualifications}</td>
        </tr>
        <tr>
          <td colspan="3">Do you have any related job experience?</td>
        </tr>
        <tr>
          <td colspan="3">${profile.relatedJobExperience}</td>
        </tr>
        <tr>
          <td colspan="3">If yes, please specify.</td>
        </tr>
        <tr>
          <td colspan="3">${
            profile.relatedJobDescription
              ? profile.relatedJobDescription
              : 'N/A'
          }</td>
        </tr>
        <tr>
          <td colspan="3">National ID Card</td>
        </tr>
        <tr>
          <td colspan="3"><img src="${
            profile.nationIdCard
          }" class="ui-nationalIdCard"></td>
        </tr>
        <tr>
          <td colspan="3">Recommendation</td>
        </tr>
        <tr>
          <td colspan="3">${
            profile.recommendationName ? profile.recommendationName : 'N/A'
          }</td>
        </tr>
        ${showRecommendation(profile)}
      </tbody>
    </table>
  `;

  function showRecommendation(profile) {
    if (profile.recommendationName && profile.recommendation) {
      if (/^data:application\/pdf/.test(profile.recommendation)) {
        return `
      <tr>
        <td colspan="3">
        <embed src="${profile.recommendation}" type="application/pdf" width="100%" height="600px" navpanes="0" />
        </td>
      </tr>
      `;
      } else if (/^data:image\//.test(profile.recommendation)) {
        return `
      <tr>
        <td colspan="3">
        <img src="${profile.recommendation}" class="ui-recommendation">
        </td>
      </tr>
      `;
      }
    }
    return '';
  }
}