/**
 * Script to fetch photo file IDs from Google Drive folders
 *
 * This script will:
 * 1. Read the property data
 * 2. For each photo_folder_id, fetch the list of files in that folder
 * 3. Get the first image file ID
 * 4. Update the property with the correct photo URL
 */

const fs = require('fs');
const { google } = require('googleapis');

// Read property data
const dataPath = './RENTAL_KING_COMPLETE_DATA.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// You'll need to set up authentication
// Option 1: API Key (for public files)
// Option 2: OAuth 2.0 credentials
// Option 3: Service Account credentials

const API_KEY = process.env.GOOGLE_DRIVE_API_KEY || 'YOUR_API_KEY_HERE';

async function fetchPhotoFromFolder(folderId) {
  try {
    const drive = google.drive({ version: 'v3', auth: API_KEY });

    // List files in the folder
    const response = await drive.files.list({
      q: `'${folderId}' in parents and (mimeType='image/jpeg' or mimeType='image/png' or mimeType='image/jpg' or mimeType='image/webp')`,
      fields: 'files(id, name, mimeType, webContentLink)',
      orderBy: 'name',
      pageSize: 1 // Get only the first image
    });

    if (response.data.files && response.data.files.length > 0) {
      const file = response.data.files[0];
      return file.id;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching folder ${folderId}:`, error.message);
    return null;
  }
}

async function updateAllPhotos() {
  console.log('Starting photo update process...\n');

  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  for (const property of data.properties) {
    if (!property.photo_folder_id || property.photo_folder_id.length < 10) {
      console.log(`⏭️  Skipped ${property.id} - No folder ID`);
      skippedCount++;
      continue;
    }

    console.log(`Processing ${property.id} (${property.address})...`);

    const fileId = await fetchPhotoFromFolder(property.photo_folder_id);

    if (fileId) {
      property.photoUrl = `https://lh3.googleusercontent.com/d/${fileId}=w800-h600-c`;
      property.photoUrlBackup = `https://drive.google.com/uc?export=view&id=${fileId}`;
      console.log(`✅ Updated: ${property.photoUrl}`);
      successCount++;
    } else {
      console.log(`❌ Failed to fetch photo for ${property.id}`);
      failCount++;
    }

    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Update metadata
  data.meta.updated = new Date().toISOString();
  data.meta.photoUpdateStats = {
    successCount,
    failCount,
    skippedCount,
    lastUpdate: new Date().toISOString()
  };

  // Create backup
  const backupPath = `./RENTAL_KING_COMPLETE_DATA.backup.${Date.now()}.json`;
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
  console.log(`\n📦 Backup created: ${backupPath}`);

  // Save updated data
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log(`\n✅ Updated ${successCount} properties successfully!`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`⏭️  Skipped: ${skippedCount}`);
  console.log(`📁 File saved to: ${dataPath}`);
}

// Run if executed directly
if (require.main === module) {
  console.log('=== Google Drive Photo Fetcher ===\n');

  if (API_KEY === 'YOUR_API_KEY_HERE') {
    console.log('⚠️  WARNING: No API key configured!');
    console.log('\nTo use this script, you need to:');
    console.log('1. Go to https://console.cloud.google.com/');
    console.log('2. Create a project and enable Google Drive API');
    console.log('3. Create an API key');
    console.log('4. Set the environment variable:');
    console.log('   export GOOGLE_DRIVE_API_KEY="your_api_key_here"');
    console.log('\nOr run: GOOGLE_DRIVE_API_KEY="your_key" node fetch_drive_photos.js');
    process.exit(1);
  }

  updateAllPhotos().catch(console.error);
}

module.exports = { fetchPhotoFromFolder, updateAllPhotos };
