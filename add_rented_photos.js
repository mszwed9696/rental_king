const fs = require('fs');
const path = require('path');

// Load current property data
const dataPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('=== Adding Photos for Rented Properties ===\n');

// Photo mappings for Insana2 and Insana3
const rentedPhotos = {
  'Insana2': {
    address: '305 N. Yale Rd',
    fileId: '10JjLg_8nQd92-WW8g76SJry_pirF2fKV'
  },
  'Insana3': {
    address: '308 Swarthmore Rd',
    fileId: '1IZZrOZOf6MIcdmlddwEfZ9eZbcQ1cAC4'
  }
};

let updatedCount = 0;

Object.keys(rentedPhotos).forEach(propId => {
  const property = data.properties.find(p => p.id === propId);

  if (property) {
    const photoData = rentedPhotos[propId];
    const newPhotoUrl = `https://lh3.googleusercontent.com/d/${photoData.fileId}=w800-h600-c`;
    const oldUrl = property.photoUrl || 'NONE';

    property.photoUrl = newPhotoUrl;
    updatedCount++;

    console.log(`✓ Updated ${propId} - ${photoData.address}`);
    console.log(`  Old: ${oldUrl}`);
    console.log(`  New: ${newPhotoUrl}\n`);
  } else {
    console.log(`✗ Property not found: ${propId}\n`);
  }
});

if (updatedCount > 0) {
  // Create backup
  const backupPath = path.join(__dirname, `RENTAL_KING_COMPLETE_DATA.backup.${Date.now()}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
  console.log(`📦 Backup created: ${backupPath}`);

  // Update metadata
  data.meta.updated = new Date().toISOString();

  // Save updated data
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  console.log(`\n✅ SUCCESS!`);
  console.log(`   Updated: ${updatedCount} rented properties`);
  console.log(`   File saved: ${dataPath}`);
} else {
  console.log('\n❌ No properties were updated.');
}
