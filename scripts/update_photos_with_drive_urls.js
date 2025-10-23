const fs = require('fs');
const path = require('path');

/**
 * This script updates the property data JSON to use Google Drive folder thumbnails
 * Since we cannot programmatically access Drive folders without OAuth,
 * we'll use alternative URL formats that work with public folders
 */

// Read the current JSON data
const jsonPath = path.join(__dirname, '..', 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`Processing ${data.properties.length} properties...\n`);

// Counter for properties with photos
let withPhotos = 0;
let withoutPhotos = 0;

data.properties.forEach((property) => {
  if (property.photo_folder_id && property.photo_folder_id.length > 10) {
    // For properties with folder IDs, we'll use multiple strategies:

    // Strategy 1: Try to use the lh3.googleusercontent.com format
    // This works if the folder ID actually points to a file
    const lh3Url = `https://lh3.googleusercontent.com/d/${property.photo_folder_id}=w800-h600-c`;

    // Strategy 2: Google Drive embed thumbnail (works with folders sometimes)
    const thumbnailUrl = `https://drive.google.com/thumbnail?id=${property.photo_folder_id}&sz=w400`;

    // Strategy 3: Try uc?export=view format
    const ucUrl = `https://drive.google.com/uc?export=view&id=${property.photo_folder_id}`;

    // We'll use lh3 as primary since it's fastest when it works
    property.photoUrl = lh3Url;
    property.photoUrlAlt = thumbnailUrl;
    property.photoUrlUc = ucUrl;

    withPhotos++;
    console.log(`✓ ${property.id}: ${property.address}`);
  } else {
    withoutPhotos++;
    console.log(`⊗ ${property.id}: ${property.address} - No folder ID`);
  }
});

// Save updated data
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log(`\n=== Summary ===`);
console.log(`✓ Properties with photos: ${withPhotos}`);
console.log(`⊗ Properties without photos: ${withoutPhotos}`);
console.log(`\n📝 Updated RENTAL_KING_COMPLETE_DATA.json`);
console.log(`\n💡 Note: The lh3.googleusercontent.com URLs will only work if:`);
console.log(`   1. The folders are publicly accessible`);
console.log(`   2. The folder contains images`);
console.log(`   3. Google's CDN can generate thumbnails`);
console.log(`\n🔧 For best results, we need individual file IDs from each folder.`);
