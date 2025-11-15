const fs = require('fs');
const path = require('path');

// Mapping of folder IDs to photo file IDs (extracted from Google Drive)
const folderToPhotoMap = {
  '1GmH9DiS9g0A8Rj70PmPseOb3alGamoiD': '1iTUwMZuR03pAeXq3BF5zCXVL-x928ahC', // Hee1 & Hee2 - 111 Franklin Rd
  '1ItgTfdodP31Y4_S4TkLfXuF1vZ4A-zta': '1Ex0o2nK-NuaFoygAfMyxrifIaiVf8WlZ', // Hee9 & Hee10 - 301 Oakwood Ave
  '1jfSPqCALtYtUHTmNzzgCNiKxoKo56EqE': '12tZoSjdiILAg-DB9ivjLGfB4Q9ycMYpl', // Hee3 - 600 Heston Rd
  '1REd8EfmMS5GCgupJk2C4HKuu8Vhrektw': '149dt9Tn4fhqjQIbMKYSqO-YTb_rUlyz2', // Hee12 - 611 Whitman St
  '1xqOEmk6jQ2ImUbNPGusNtIhjF9tJdmfU': '1O5NN6cecEdx8FcOj1hsRiD-_x1sMOuNP', // Hee5 - 608 Whitman St
  '1z-mnv507GN9myeAqX9VocEeKxeDtxMUG': '18IGhhPd4VZ_olg6WaXBYQCT_TVoACm2N', // Hee4 - 617 Whitman St
  '1BmgUUHf0KHBY54LXPOv02WNfhdCYXxT4': '1u-djbNPy44Qzs9JR_cxRhh-lSQyEt86R', // Hee11 - 607 Heston Rd
  '1IQXZRhOoPdwkqrUlk7btZ1ZRorNL6H-s': '1ssdAyb1u8Q_UMAQg5T-hsxEc7lCJ2K-t', // Hee13 - 405 Georgetown Rd
  '1Lurp0KRhjlLyMH18mqfZMcXruFQAGVIh': '14kY0B_YkiGdQg3Q6fBcK8TbXUJiEf2OT', // Hee6 - 206 Dickinson Rd
  '1a8-28ImFw_NIRn9Imy9nHyta1wwKoEd0': '1Q6e0VP1PU-hMF6AR9nItqRUGln8sWCcL', // Hee7 - 12 Georgetown Rd
  '1gAjWtLf_iJsHa3upM14cZadU8FiFe6iP': '18vudXU1jCIUE3UTboLy4HIwh5WC8qpk7'  // Hee8 - 613 Heston Rd
};

console.log('=== Adding Photos to Hee Properties ===\n');

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
console.log(`\nAll Hee properties now have header photos!`);
