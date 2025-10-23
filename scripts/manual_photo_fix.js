const fs = require('fs');
const path = require('path');

/**
 * EMERGENCY FIX: Manually add working photo URLs
 * This uses publicly accessible Google Drive links that should work immediately
 */

const jsonPath = path.join(__dirname, '..', 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('Applying emergency photo fix...\n');

// Update all properties to use a working photo format
let updated = 0;

data.properties.forEach(property => {
  if (property.photo_folder_id) {
    // Use the thumbnail API which works with folder IDs
    property.photoUrl = `https://drive.google.com/thumbnail?id=${property.photo_folder_id}&sz=w800`;

    // Also add iframe embed as backup
    property.photoUrlBackup = `https://drive.google.com/file/d/${property.photo_folder_id}/preview`;

    updated++;
    console.log(`✓ ${property.id}: ${property.address}`);
  }
});

// Save updated data
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log(`\n✅ Updated ${updated} properties with thumbnail URLs`);
console.log('📸 Format: https://drive.google.com/thumbnail?id={ID}&sz=w800');
