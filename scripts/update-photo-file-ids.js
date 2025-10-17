const fs = require('fs');
const path = require('path');

// Read both JSON files
const dataPath = path.join(__dirname, '..', 'RENTAL_KING_COMPLETE_DATA.json');
const photoIdsPath = path.join(__dirname, '..', 'property_photo_file_ids.json');

const completeData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const photoFileIds = JSON.parse(fs.readFileSync(photoIdsPath, 'utf8'));

// Update photo_folder_id with actual file IDs
let updated = 0;

completeData.properties.forEach(property => {
  const fileId = photoFileIds[property.id];

  if (fileId) {
    if (property.photo_folder_id !== fileId) {
      console.log(`${property.id}: Updating photo ID`);
      console.log(`  Old (folder): ${property.photo_folder_id}`);
      console.log(`  New (file):   ${fileId}`);
      property.photo_folder_id = fileId;
      updated++;
    }
  } else {
    console.log(`${property.id}: No file ID found (keeping existing)`);
  }
});

// Save updated data
fs.writeFileSync(dataPath, JSON.stringify(completeData, null, 2));
console.log(`\n✓ Updated ${updated} properties with photo file IDs`);
console.log(`✓ Saved to ${dataPath}`);
