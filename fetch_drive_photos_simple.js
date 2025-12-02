/**
 * Simplified script to update photo URLs for properties
 *
 * Since Google Drive folders contain multiple images, we'll use alternative
 * photo URL formats that work better with public folders
 */

const fs = require('fs');
const https = require('https');

// Read property data
const dataPath = './RENTAL_KING_COMPLETE_DATA.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function updatePhotoUrls() {
  console.log('Updating photo URLs with alternative formats...\n');

  let updatedCount = 0;

  data.properties.forEach(property => {
    if (property.photo_folder_id && property.photo_folder_id.length > 10) {
      const folderId = property.photo_folder_id;

      // Try multiple URL formats that might work with public folders
      // Format 1: Google Drive thumbnail API
      property.photoUrl = `https://drive.google.com/thumbnail?id=${folderId}&sz=w800`;

      // Format 2: Direct embedded viewer (backup)
      property.photoUrlBackup = `https://drive.google.com/uc?export=view&id=${folderId}`;

      // Format 3: Google User Content (alternative)
      property.photoUrlAlternative = `https://lh3.googleusercontent.com/d/${folderId}=w800-h600-c`;

      console.log(`✅ Updated ${property.id} (${property.address})`);
      updatedCount++;
    }
  });

  // Update metadata
  data.meta.updated = new Date().toISOString();

  // Create backup
  const backupPath = `./RENTAL_KING_COMPLETE_DATA.backup.${Date.now()}.json`;
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
  console.log(`\n📦 Backup created: ${backupPath}`);

  // Save updated data
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  console.log(`\n✅ Updated ${updatedCount} properties with alternative photo URLs`);
  console.log(`📁 File saved to: ${dataPath}`);
  console.log('\nNote: If photos still don\'t appear, you may need to:');
  console.log('1. Ensure Google Drive folders are publicly accessible');
  console.log('2. Use the Google Drive API script (fetch_drive_photos.js) with proper authentication');
  console.log('3. Manually extract individual file IDs from each folder');
}

// Run if executed directly
if (require.main === module) {
  console.log('=== Simple Photo URL Updater ===\n');
  updatePhotoUrls();
}

module.exports = { updatePhotoUrls };
