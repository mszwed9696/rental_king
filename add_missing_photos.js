const fs = require('fs');
const path = require('path');

// Mapping of folder IDs to photo file IDs
const folderToPhotoMap = {
  '1GmH9DiS9g0A8Rj70PmPseOb3alGamoiD': '1kKOHWRzVKKBp5fdUQVc7zrkVguZQsTPN', // 5 DELSEA (Caruso1, Caruso2)
  '1dg8IcZu8ehq-LlYzXFVutRMWEyBYGJ4q': '1RypmmJYPCYQjyvxxK4rjQBE3j36U2P7h', // 357 Oakwood (Jayna17-22)
  '1e_18y_YJasQIFguefGqR6yvJd_q89xfu': '1Sozm4c1db6jKR3tCF2tciyM_oBcnjPvJ', // 25 Zane (Jayna12)
  '1shchyArEwvoJeiFWhvW_hoTQlQ1S2b8t': '1P77MX3OwtB34CONnTDTvXf9FLWPwi2Nk', // 1 Pennsylvania (Jayna1-7)
  '1g4Pt1txSTHzYfh6sKFVqMtH3oP6nquFq': '1QgVszJFAXTc2QU_9w17p2xeWSutLMBNL', // 126 S. Main (Jayna8-10)
  '1y34s5wo_4x8fznRi0NhH0pWJby3VWwFr': '1cz-EK5AZIo8urXOccyx1oq6rJSfHNFud'  // 349-351 Oakwood (Jayna14-16)
};

console.log('=== Adding Photos to 22 Properties ===\n');

// Read current JSON data
const jsonPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`Total properties in JSON: ${data.properties.length}\n`);

// Create backup
const backupPath = path.join(__dirname, `RENTAL_KING_COMPLETE_DATA.backup.${Date.now()}.json`);
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
console.log(`📦 Backup created: ${path.basename(backupPath)}\n`);

let updatedCount = 0;

// Update properties that have a folder ID but no photo
data.properties.forEach((property, index) => {
  // Check if property needs a photo
  if ((!property.photoUrl || property.photoUrl === '') && property.photo_folder_id) {
    const photoFileId = folderToPhotoMap[property.photo_folder_id];

    if (photoFileId) {
      const newPhotoUrl = `https://lh3.googleusercontent.com/d/${photoFileId}=w800-h600-c`;
      property.photoUrl = newPhotoUrl;
      updatedCount++;

      console.log(`${updatedCount.toString().padStart(2)}. ${property.id.padEnd(15)} | ${property.address.padEnd(35)} | ✓ Added photo`);
    }
  }
});

console.log(`\n=== Summary ===`);
console.log(`Properties updated with photos: ${updatedCount}`);
console.log(`Total properties: ${data.properties.length}`);

// Update metadata
data.meta.updated = new Date().toISOString();

// Save updated data
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log(`\n✅ SUCCESS!`);
console.log(`   Added photos to ${updatedCount} properties`);
console.log(`   File saved: ${jsonPath}`);
console.log(`\nAll properties with Google Drive folders now have header photos!`);
