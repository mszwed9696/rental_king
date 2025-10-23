/**
 * Manual Photo ID Extraction Helper
 *
 * This script helps you manually extract photo file IDs from Google Drive folders
 *
 * INSTRUCTIONS:
 * 1. Open each folder URL below in your browser
 * 2. For each photo in the folder:
 *    - Right click on the photo → "Open in new tab"
 *    - Copy the file ID from the URL (format: /file/d/{FILE_ID}/view)
 * 3. Update the photoIds array below for each property
 * 4. Run: node scripts/create_photo_mapping_from_drive.js
 */

const fs = require('fs');
const path = require('path');

// Manual photo ID mapping - UPDATE THIS OBJECT
const manualPhotoMapping = {
  "P028": {
    // Folder: https://drive.google.com/drive/folders/1Cg0C5qNDMWst3_KfUsGlbSwljwC5KZXo
    // Property: 127 STATE ST
    photoIds: [
      // Add file IDs here, e.g.: "1abc123xyz456"
    ]
  },
  "P030": {
    // Folder: https://drive.google.com/drive/folders/1X6BmJP9t4eMY6NRwHfe0rUahLkYOp3Yo
    // Property: 113 SILVER AVE
    photoIds: []
  },
  // Add more properties as you extract them
};

// Function to convert photo IDs to usable URLs
function generatePhotoUrls(photoIds) {
  return photoIds.map(id => ({
    lh3: `https://lh3.googleusercontent.com/d/${id}=w1600-no`,
    drive: `https://drive.google.com/uc?export=view&id=${id}`,
    thumbnail: `https://drive.google.com/thumbnail?id=${id}&sz=w800`
  }));
}

function updatePropertyData() {
  const jsonPath = path.join(__dirname, '..', 'RENTAL_KING_COMPLETE_DATA.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  let updated = 0;

  data.properties.forEach(property => {
    if (manualPhotoMapping[property.id]) {
      const mapping = manualPhotoMapping[property.id];
      if (mapping.photoIds && mapping.photoIds.length > 0) {
        const photoUrls = generatePhotoUrls(mapping.photoIds);

        // Set primary photo (first in array)
        property.photoUrl = photoUrls[0].lh3;
        property.primaryPhotoId = mapping.photoIds[0];

        // Store all photo URLs
        property.photoGallery = photoUrls;

        updated++;
        console.log(`✓ Updated ${property.id}: ${property.address} (${photoUrls.length} photos)`);
      }
    }
  });

  if (updated > 0) {
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    console.log(`\n✅ Updated ${updated} properties with photo data`);
  } else {
    console.log(`\n⚠️  No manual photo mappings found. Please add photo IDs to the script.`);
  }
}

// Print extraction instructions
console.log('='.repeat(80));
console.log('GOOGLE DRIVE PHOTO EXTRACTION HELPER');
console.log('='.repeat(80));
console.log('\nTo extract photo IDs:\n');
console.log('1. Open folder URLs (listed below)');
console.log('2. Right-click each photo → "Open in new tab"');
console.log('3. Copy FILE_ID from URL: /file/d/{FILE_ID}/view');
console.log('4. Add IDs to manualPhotoMapping object in this script');
console.log('5. Run this script again\n');

// Read CSV to print all folder URLs
const csvPath = path.join(__dirname, '..', 'property_data.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

function parseCSV(text) {
  const rows = [];
  let row = [], cur = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (inQ) {
      if (c === '"' && n === '"') { cur += '"'; i++; }
      else if (c === '"') { inQ = false; }
      else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ',') { row.push(cur); cur = ''; }
      else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
      else if (c !== '\r') { cur += c; }
    }
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

const rows = parseCSV(csvContent);
console.log('\nFOLDER URLs:\n');

for (let i = 1; i <= Math.min(10, rows.length - 1); i++) {
  const row = rows[i];
  const id = row[0];
  const address = row[2];
  const folderId = row[10];

  if (folderId) {
    console.log(`${id} - ${address}`);
    console.log(`  https://drive.google.com/drive/folders/${folderId}\n`);
  }
}

console.log('='.repeat(80));

updatePropertyData();
