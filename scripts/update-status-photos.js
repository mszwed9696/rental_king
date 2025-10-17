const fs = require('fs');
const path = require('path');

// Read both JSON files
const dataPath = path.join(__dirname, '..', 'RENTAL_KING_COMPLETE_DATA.json');
const mappingPath = path.join(__dirname, '..', 'property_status_photo_mapping.json');

const completeData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const statusPhotoMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// Update status and photo_folder_id for each property
let statusUpdated = 0;
let photoUpdated = 0;

completeData.properties.forEach(property => {
  const mappingData = statusPhotoMapping[property.id];

  if (mappingData) {
    // Update status
    if (property.status !== mappingData.status) {
      console.log(`${property.id} (${property.address}): status "${property.status}" → "${mappingData.status}"`);
      property.status = mappingData.status;
      statusUpdated++;
    }

    // Update photo_folder_id (using photo_column_k from mapping)
    if (mappingData.photo_column_k) {
      if (property.photo_folder_id !== mappingData.photo_column_k) {
        console.log(`${property.id}: photo_folder_id updated`);
        property.photo_folder_id = mappingData.photo_column_k;
        photoUpdated++;
      }
    }
  }
});

// Save updated data
fs.writeFileSync(dataPath, JSON.stringify(completeData, null, 2));
console.log(`\n✓ Updated ${statusUpdated} property statuses`);
console.log(`✓ Updated ${photoUpdated} photo folder IDs`);
console.log(`✓ Saved to ${dataPath}`);
