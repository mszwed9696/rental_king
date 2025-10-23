const fs = require('fs');
const path = require('path');

// Load the folder ID mappings
const folderMappings = require('./folder_ids_to_process.json');

// Load current property data
const dataPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('=== Adding Folder IDs to Properties ===\n');

let updatedCount = 0;

// Update each property with its folder ID
folderMappings.forEach(mapping => {
  const property = data.properties.find(p => p.id === mapping.jsonId);

  if (property) {
    if (!property.photo_folder_id || property.photo_folder_id === '') {
      property.photo_folder_id = mapping.folderId;
      console.log(`✓ Updated ${property.id} - ${property.address}`);
      console.log(`  Folder ID: ${mapping.folderId}\n`);
      updatedCount++;
    } else {
      console.log(`⚠ Skipped ${property.id} - already has folder ID: ${property.photo_folder_id}\n`);
    }
  } else {
    console.log(`✗ Property not found: ${mapping.jsonId}\n`);
  }
});

if (updatedCount > 0) {
  // Create backup
  const backupPath = path.join(__dirname, `RENTAL_KING_COMPLETE_DATA.backup.${Date.now()}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
  console.log(`\n📦 Backup created: ${backupPath}`);

  // Update metadata
  data.meta.updated = new Date().toISOString();

  // Save updated data
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  console.log(`\n✅ SUCCESS!`);
  console.log(`   Updated: ${updatedCount} properties`);
  console.log(`   File saved: ${dataPath}`);
} else {
  console.log('\n❌ No properties were updated.');
}
