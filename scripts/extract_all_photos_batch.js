const fs = require('fs');
const path = require('path');

/**
 * Manually extracted photo file IDs from Google Drive folders
 * Format: propertyId: fileId
 *
 * Already extracted:
 * P028 (127 STATE ST): 1hWwdViw340dTg61LfHOFbflttapQz7ob ✓
 *
 * To add more, navigate to each folder and extract the file ID from the image src
 */

const photoFileIds = {
  // All photo file IDs extracted from previous version
  "P001": "1rKBLcW3XqjMEB-IHDU5abkcU7kfneX-1",
  "P002": "1hlz8DnoNM3K4j69bTgC10N0mUU4r3kP0",
  "P003": "1wa2pjpx-PZNlPKIRJwtXztPH7dmiJvY4",
  "p003": "1wa2pjpx-PZNlPKIRJwtXztPH7dmiJvY4",
  "P004": "1iMwlHDHgNNlaklRkrpk-5nkHYjWf_aT5",
  "P005": "1vQKv6ZS44uViG5HJlNUD2XNsH_a1KvgE",
  "P006": "17M5sgM2rbpAEXJWCMbPDgahDEoJXUeUT",
  "P007": "1H--xb3UVQMNR6F6e5ujuBF4ZvIOU96rM",
  "P008": "1ALj9Pg1IrKwQnBY5HlDLHMc_TJlKvHas",
  "P009": "1H2xLXYkJWAUyZah3wdU9gFa6msM2b_No",
  "P010": "1309OANWiYlrtVuv9437qmH7u5zFESgy3",
  "P011": "1FzxhB3IooDqk-0d6aMAx_rZqL3UwFggV",
  "P012": "1SORdSkEVLD4g425Q_2w2x3ATLIfUhjvE",
  "P013": "1dwx2Ab5C7QsNWZtly-6MwnQYwLc2lPKr",
  "P014": "1uPBQC5ZHBfmxpC6Yqap5w0V4mNlDmFII",
  "P015": "1lsYLPsYNVge52vJvo3xr0KM-dMXIdCQd",
  "P016": "17dQGRYKMw4TbVD9LvwTXDpRLHuAGuE3U",
  "P017": "1AnlIlRfFQB8QCS05ojSnichpT3zS75_f",
  "P018": "1R3ugG1mDupxZY3koXtHKDZJ7T4s7Fr6H",
  "P019": "1V4Pmiq1hoUE7ec8NK6LtSRSYXNSOuknZ",
  "P020": "1tQTb2qkRke81mAkxOAtAcIgJuiTbfp7k",
  "P021": "1dK99BUiNAADVIeemrWvvzYLXS7jPls7h",
  "P022": "1fLo106E-ZQ9MOu6CHfUM9v3u6Jn9jDBp",
  "P023": "1BAe0zIGZ2u8zTJDDw95RfXTPoBVTGF_H",
  "P024": "1_eSPLCFu1m7jvCZlKyoqKj5TCEIDy02b",
  "P025": "1n3Qd9DREInI7TrgcvtYrVZrwCrBmxAWb",
  "P026": "10l60uUO6Sv7yS6xLysCeN0hC1c07siCk",
  "P027": "1MORYDKCa7kFsFruX37z5_AycufVwUkLM",
  "P028": "1hWwdViw340dTg61LfHOFbflttapQz7ob",
  "P029": "1wRm9ANv5E3DRGr6ujr_WXOrCZNnua5mq",
  "P030": "1lvxy3ZNio1nv-E9Lgk0fcokr6ZxWReRn",
  "P031": "1onABz2EebDnWrX8DIJss_QOcAd-wOdUU",
  "P032": "1hvVPQwXdTssY7EH-Ie0lqLXQCGwScypd",
  "P033": "1DvRolviiB6k1tUPHDDMMndytQ27o1GAU",
  "P034": "1TkIt1rnQRxY4VZ7W6obG2t0kHNqnT-sP",
  "P035": "1TkIt1rnQRxY4VZ7W6obG2t0kHNqnT-sP",
  "P036": "1TkIt1rnQRxY4VZ7W6obG2t0kHNqnT-sP",
  "P037": "1TkIt1rnQRxY4VZ7W6obG2t0kHNqnT-sP",
  "P038": "1TkIt1rnQRxY4VZ7W6obG2t0kHNqnT-sP",
  "P039": "1TkIt1rnQRxY4VZ7W6obG2t0kHNqnT-sP",
  "P040": "1jpmEFIY-XXLIXbi8kP3NvphJHnAacYeG",
  "P041": "1UBl9fIAmDV0hvFcPRmUqY4bU3Ukskk1l"
};

// Properties with their folder IDs (for reference)
const folderMapping = {
  "P026": "1QVTUs88c41PoudjYPtQK2EuJS5bjkmpr",  // 1 SILVER AVE
  "P027": "1nrp7feQlcvRCMVDAYAOWlEkmDBXBPOd8",  // 110 N MAIN ST
  "P025": "1MS9mcTPJbVA6Oh08advP-g-x7GvXxIST",  // 101 E. NEW ST
  "P031": "10skcGxV0vOu56mOMCGA-bgDM4vnIEyf5",  // 38 CARPENTER ST
  "P032": "1o-CAFAyClQ-HeL1x8O5OpOWitKhWkaZI",  // 42 CARPENTER ST
  "P033": "17yxF5axiegs8g5KAfvEehsNZFvl60WWI",  // 46 CARPENTER ST
  "P030": "1X6BmJP9t4eMY6NRwHfe0rUahLkYOp3Yo",  // 113 SILVER AVE
  "P020": "1EpFrC-RflSSVPwt23czr6fOHWGJ99kcq",  // 34 CARPENTER ST
  "P023": "1JDGrHLWSE_1i1Xq6XQxXMFAixbnVlFfH",  // 18 WEST ST
  "P022": "1Ca_Oq3-tqhJVdhROmcBPvsvDSwY8fdtK",  // 202 CARPENTER ST
  "P021": "1Y-rfu1EBpvnYoCW2DWiG3O80mnFAOcPX",  // 5 SILVER AVE
  "P019": "1xm0Gl9FH2AdMbWUTOum1wAuGO3ePPN5Q",  // 18 N. ACADEMY ST
  "P018": "1SYjXZ0BCIJzm3Wc6Px_n0fZcKZInhL2n",  // 601 MORRIS AVE
  "P017": "1G5MfYkhDiqLwZum4gefZT92uwxMDnFzI",  // 7 NORMAL BLVD
  "P016": "1FDbZKeHo2T7X4rR2-SZjFiRtwNmtegVG",  // 311 W. NEW ST
  "P015": "13AxFU1_qJFvyS3aKxW19ZCwd8dRpqauL",  // 313 HAMILTON RD
  "P014": "1QavagCMjRk2anoVoHGTto-cBshSXGOsY",  // 309 W. NEW ST
  "P013": "19RySpKOINYk3E_m2vePTl0jwUt25s7yN",  // 109 STATE ST
  "P012": "1iCqQMGic0yrZjeGrHWD7fG6cTzM5Fpfy",  // 410 W. HIGH ST
  "P011": "1WDXe8bmjmU63POz65qspmwU54zklyojj",  // 306 HAMILTON RD
  "P010": "1tj4msqcbhj9xQ6GUxeU-vtgwdwgE2qzE",  // 110 STATE ST
};

function updatePropertyPhotos() {
  const jsonPath = path.join(__dirname, '..', 'RENTAL_KING_COMPLETE_DATA.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  let updated = 0;

  data.properties.forEach(property => {
    if (photoFileIds[property.id]) {
      const fileId = photoFileIds[property.id];
      property.photoUrl = `https://lh3.googleusercontent.com/d/${fileId}=w800-h600-c`;
      updated++;
      console.log(`✓ ${property.id}: ${property.address}`);
    }
  });

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

  console.log(`\n✅ Updated ${updated} properties with photos`);
  console.log(`📋 ${Object.keys(folderMapping).length - updated} properties still need photo extraction`);
}

console.log('📸 Photo Extraction Progress\n');
console.log(`Working photos: ${Object.keys(photoFileIds).length}`);
console.log(`Total properties with folders: ${Object.keys(folderMapping).length}\n`);

updatePropertyPhotos();
