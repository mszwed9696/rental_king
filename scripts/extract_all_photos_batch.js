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
  // Extracted photo IDs
  "P028": "1hWwdViw340dTg61LfHOFbflttapQz7ob",  // 127 STATE ST
  "P030": "1lvxy3ZNio1nv-E9Lgk0fcokr6ZxWReRn",  // 113 SILVER AVE
  "P026": "10l60uUO6Sv7yS6xLysCeN0hC1c07siCk",  // 1 SILVER AVE
  "P027": "1MORYDKCa7kFsFruX37z5_AycufVwUkLM",  // 110 N MAIN ST
  "P025": "1n3Qd9DREInI7TrgcvtYrVZrwCrBmxAWb",  // 101 E. NEW ST
  "P031": "1onABz2EebDnWrX8DIJss_QOcAd-wOdUU",  // 38 CARPENTER ST

  // Add more as we extract them
  // etc...
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
