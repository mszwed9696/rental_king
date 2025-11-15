const fs = require('fs');
const path = require('path');

console.log('=== Updating Photos for 4 Properties ===\n');

// Photo file IDs extracted from Google Drive
const photoUpdates = [
  {
    id: 'Coconut1',
    address: '18 WEST ST',
    fileId: '1BAe0zIGZ2u8zTJDDw95RfXTPoBVTGF_H'
  },
  {
    id: 'Coconut1',
    address: '202 CARPENTER ST',
    fileId: '1fLo106E-ZQ9MOu6CHfUM9v3u6Jn9jDBp'
  },
  {
    id: 'Pink3',
    address: '311 W. NEW ST',
    fileId: '17dQGRYKMw4TbVD9LvwTXDpRLHuAGuE3U'
  },
  {
    id: 'Pink3',
    address: '309 W. NEW ST',
    fileId: '1uPBQC5ZHBfmxpC6Yqap5w0V4mNlDmFII'
  }
];

// Read current JSON data
const jsonPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`Total properties in JSON: ${data.properties.length}\n`);

// Create backup
const backupPath = path.join(__dirname, `RENTAL_KING_COMPLETE_DATA.backup.${Date.now()}.json`);
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
console.log(`📦 Backup created: ${path.basename(backupPath)}\n`);

let updatedCount = 0;

// Update each property with correct photo
photoUpdates.forEach((update) => {
  const property = data.properties.find(p =>
    p.id === update.id && p.address === update.address
  );

  if (property) {
    const photoUrl = `https://lh3.googleusercontent.com/d/${update.fileId}=w800-h600-c`;
    const oldPhoto = property.photoUrl || '(none)';

    property.photoUrl = photoUrl;
    updatedCount++;

    console.log(`✓ ${update.id.padEnd(15)} | ${update.address.padEnd(35)}`);
    console.log(`  Old: ${oldPhoto}`);
    console.log(`  New: ${photoUrl}\n`);
  } else {
    console.log(`⚠️  Property not found: ${update.id} - ${update.address}\n`);
  }
});

console.log(`=== Summary ===`);
console.log(`Properties updated with new photos: ${updatedCount}/4`);

// Update metadata
data.meta.updated = new Date().toISOString();

// Save updated data
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log(`\n✅ SUCCESS!`);
console.log(`   Updated ${updatedCount} property photos`);
console.log(`   File saved: ${jsonPath}`);
