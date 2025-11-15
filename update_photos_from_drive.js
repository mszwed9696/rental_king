/**
 * Script to update property photos from Google Drive folders
 *
 * Each property folder in Google Drive has a 'header' subfolder with images.
 * This script will help map the correct photo URLs to each property.
 *
 * User needs to manually extract file IDs from Google Drive and this script will update the JSON.
 */

const fs = require('fs');
const path = require('path');

// Load current property data
const dataPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Properties that need photos (identified from analysis)
const propertiesToUpdate = [
  'xxx', 'Humbert1', 'Mcfadden2', 'Agnes1', 'Agnes 2', 'Mcfadden3',
  'McFadden1', 'Hildebrant2', 'Hildebrant1', 'Agnes 3', 'Humbert2',
  'Hildebrant3', 'Insana1', 'p002', 'p001', 'Insana5', 'Insana4',
  'Liscio1', 'Liscio2', 'Liscio3', 'Omalley1', 'Omalley2'
];

// Map of property folder IDs to header image file IDs
// User needs to fill this in by navigating to each property folder > header folder > get file ID
const folderToHeaderImageMap = {
  // Example format:
  // '17j6Q4M1_7MW1Qn6JTgniOcHN_hqEWBRo': '1abcd1234example', // 4 SILVER AVE
  // Add more mappings here
};

function updatePropertyPhotos(photoMappings) {
  let updatedCount = 0;

  data.properties.forEach(property => {
    if (property.photo_folder_id && photoMappings[property.photo_folder_id]) {
      const fileId = photoMappings[property.photo_folder_id];
      const newPhotoUrl = `https://lh3.googleusercontent.com/d/${fileId}=w800-h600-c`;

      property.photoUrl = newPhotoUrl;
      updatedCount++;

      console.log(`Updated ${property.id} (${property.address}): ${newPhotoUrl}`);
    }
  });

  // Update metadata
  data.meta.updated = new Date().toISOString();

  // Save updated data
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  console.log(`\nUpdated ${updatedCount} properties successfully!`);
  console.log(`File saved to: ${dataPath}`);
}

// Export for use
module.exports = { updatePropertyPhotos };

// If run directly, show instructions
if (require.main === module) {
  console.log('=== Google Drive Photo Update Script ===\n');
  console.log('Properties needing photos:\n');

  data.properties.forEach(prop => {
    if (propertiesToUpdate.includes(prop.id) && prop.status === 'available') {
      console.log(`Property: ${prop.address} (${prop.id})`);
      console.log(`  Folder ID: ${prop.photo_folder_id || 'NONE - Check Google Sheet column K'}`);
      if (prop.photo_folder_id) {
        console.log(`  Folder URL: https://drive.google.com/drive/folders/${prop.photo_folder_id}`);
      }
      console.log('---');
    }
  });

  console.log('\nTo update photos:');
  console.log('1. Navigate to each property folder in Google Drive');
  console.log('2. Go to the "header" subfolder');
  console.log('3. Right-click the image > Get link > Copy file ID');
  console.log('4. Add mappings to folderToHeaderImageMap in this script');
  console.log('5. Call updatePropertyPhotos(folderToHeaderImageMap)');
}
