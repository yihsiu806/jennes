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
              { text: profile.email },
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
  if (!img) {
    return errorImageBase64;
  }
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
          <td>${profile.gender}</td>
        </tr>
        <tr>
          <td>Phone Number</td>
          <td>${profile.phoneNumber}</td>
        </tr>

        <tr>
          <td>Constituency</td>
          <td>${profile.constituency}</td>
        </tr>

        <tr>
          <td>Home Address</td>
          <td>${profile.homeAddress}</td>
        </tr>

        <tr>
          <td>E-Mail Address</td>
          <td>${profile.email}</td>
        </tr>

        <tr>
          <td>Job Position</td>
          <td>${profile.jobPosition}</td>
        </tr>

        <tr>
          <td colspan="2" class="dark">If employed, what is the name of your organization?</td>
        </tr>

        <tr>
          <td colspan="2">${
            profile.organization ? profile.organization : 'N/A'
          }</td>
        </tr>

        <tr>
          <td colspan="2" class="dark">If employed, which department or division do you work in, within your organization?</td>
        </tr>

        <tr>
          <td colspan="2">${
            profile.department ? profile.department : 'N/A'
          }</td>
        </tr>
        
        <tr>
          <td>programme:</td>
          <td>${profile.programme}</td>
        </tr>
        
        <tr>
          <td colspan="2" class="dark">Please indicate your reason(s) for applying to this programme.</td>
        </tr>
        <tr>
          <td colspan="2">${profile.objective}</td>
        </tr>
        <tr>
          <td colspan="2" class="dark">Do you have any previous training with Taiwan ICDF?</td>
        </tr>
        <tr>
          <td colspan="2">${profile.icdfTraining}</td>
        </tr>
        <tr>
          <td colspan="2" class="dark">If yes, what is the training program title?</td>
        </tr>
        <tr>
          <td colspan="2">${
            profile.icdfProgramTitle ? profile.icdfProgramTitle : 'N/A'
          }</td>
        </tr>
        <tr>
          <td colspan="2" class="dark">If yes, what is the training program period?</td>
        </tr>
        <tr>
          <td colspan="2">${
            profile.icdfTrainingFrom && profile.icdfTrainingTo
              ? `${profile.icdfTrainingFrom} ~ ${profile.icdfTrainingTo}`
              : 'N/A'
          }</td>
        </tr>
        <tr>
          <td>School Name</td>
          <td>${profile.schoolName}</td>
        </tr>
        <tr>
          <td>Subject</td>
          <td>${profile.subject}
        </tr>
        <tr>
          <td>Qualifications</td>
          <td>${profile.qualifications}</td>
        </tr>
        <tr>
          <td colspan="2" class="dark">Do you have any related job experience?</td>
        </tr>
        <tr>
          <td colspan="2">${profile.relatedJobExperience}</td>
        </tr>
        <tr>
          <td colspan="2" class="dark">If yes, please specify.</td>
        </tr>
        <tr>
          <td colspan="2">${
            profile.relatedJobDescription
              ? profile.relatedJobDescription
              : 'N/A'
          }</td>
        </tr>
        <tr>
          <td colspan="2" class="dark">National ID Card</td>
        </tr>
        <tr>
          <td colspan="2"><img src="${
            profile.nationIdCard
          }" class="ui-nationalIdCard"></td>
        </tr>
        <tr>
          <td colspan="2" class="dark">Recommendation</td>
        </tr>
        <tr>
          <td colspan="2">${
            profile.recommendationName ? profile.recommendationName : 'N/A'
          }</td>
        </tr>
        ${showRecommendation(profile)}
      </tbody>
    </table>
  `;

  function showRecommendation(profile) {
    if (!profile.recommendation) {
      return '';
    } else if (profile.recommendation && profile.recommendation.split('.').pop() == 'pdf') {
      return `
        <tr>
          <td colspan="3">
          <embed src="${profile.recommendation}" type="application/pdf" width="100%" height="600px" navpanes="0" />
          </td>
        </tr>
        `;
    } else if (profile.recommendation) {
      return `
        <tr>
          <td colspan="3">
          <img src="${profile.recommendation}" class="ui-recommendation">
          </td>
        </tr>
        `;
    }
  }
}

const errorImageBase64 = 'data:image/jpeg;base64,/9j/4QC8RXhpZgAASUkqAAgAAAAGABIBAwABAAAAAQAAABoBBQABAAAAVgAAABsBBQABAAAAXgAAACgBAwABAAAAAgAAABMCAwABAAAAAQAAAGmHBAABAAAAZgAAAAAAAABgAAAAAQAAAGAAAAABAAAABgAAkAcABAAAADAyMTABkQcABAAAAAECAwAAoAcABAAAADAxMDABoAMAAQAAAP//AAACoAQAAQAAAGQAAAADoAQAAQAAAGQAAAAAAAAA/+EN9Gh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDIyLTAyLTE5PC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPjRkZmUyMjU4LWE3ODAtNGZkMC05YWE2LTVkNDcxYTg1Y2QzNjwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQxNzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5Jbml0aWFsIEZhc2hpb24gTG9nbzwvcmRmOmxpPgogICA8L3JkZjpBbHQ+CiAgPC9kYzp0aXRsZT4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6cGRmPSdodHRwOi8vbnMuYWRvYmUuY29tL3BkZi8xLjMvJz4KICA8cGRmOkF1dGhvcj5ZaWhzaXUgQ2hlbjwvcGRmOkF1dGhvcj4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6eG1wPSdodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvJz4KICA8eG1wOkNyZWF0b3JUb29sPkNhbnZhPC94bXA6Q3JlYXRvclRvb2w+CiA8L3JkZjpEZXNjcmlwdGlvbj4KPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0ndyc/Pv/bAEMABgQFBgUEBgYFBgcHBggKEAoKCQkKFA4PDBAXFBgYFxQWFhodJR8aGyMcFhYgLCAjJicpKikZHy0wLSgwJSgpKP/bAEMBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIAGQAZAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APp+iiioGFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABQAT0BNFeFfHl9IPxD8GQ+KNRuNP0KS3uvtMsU7xYxjbyvP3sDp3oQHupBHUEfhQAT0BNeUfCLTvAA1q8u/A+uXmp3cUHlzLLeyzKiOwwdrgDOV61k/FnTrDWvjF4T0zW76e00uXTLl5GjuzbfMrZX5gR3osFz2368UAE9ATXjvwcu2tPHni3w5pOsXOs+GbCOGW2nnm88wSt96ISdx1/L61U+LOnWGtfGLwnpmt309ppcumXLyNHdm2+ZWyvzAjvRYVz2368UV478HLtrTx54t8OaTrFzrPhmwjhltp55vPMErfeiEncdfy+tXfiFeap4n+IOn+A9J1GfS7E2Z1HVLq2bbM0W7asSN2z3Pv7YJYdz1XB9DRXini74fv8AD/QrnxP4C1XVLa+01PtE9rdXbTw3kS/fV1bvjJz/AC613+qasmtfCy91e2DRJeaPJcoM8puhJxn1H9KAOswe4P5UV8oLa6b4d+EmieLdE8T39v4wZIHFsNRMondnw0ZhJPGOf/119VWjySWsLzp5crIrOn91iBkfgc0NAS0UUUAFeR/Fmx1dPiF4R1zTvDN14gs7CC5WeCEJjLjCg7uO+enavXKTAoQHBeBvEGpX+sNa3Pw+vvDsDRMzXcphCkjopCDJzk1kePvBY8U/FvwzLquj/wBoeHodPuEuWkXMSyE5QNznOeleqYHpRRcDy/4XeH9S8C+J9b8Npp8snhm4c32n6gqjEZPDQSHrkdifT3qPx94LHin4t+GZdV0f+0PD0On3CXLSLmJZCcoG5znPSvVKKLhY8v8Ahd4f1LwL4n1vw2mnyyeGbhzfafqCqMRk8NBIeuR2J9Pep/iJ4b1238Wab418GRQ3eq2kDWd3p8r7BeW5OcK3Zgf6emD6TS0XA8a8RX/jj4iaY/h218KXfhiwu8R3+oajMjFYs/MsaryxPTP8uteh6xo62vw/vtG0qF3WLTJLS3iHLNiIqo+p4roaWgLHzxbfCq50r4feFfEOgaJHB430kR3NzauoLXhB+aNwTjdjkH6+1e/abcve6fbXMltNavNGrtBMMPESOVb3HSrFLRcAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Z';