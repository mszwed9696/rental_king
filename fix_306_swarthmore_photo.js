const fs = require('fs');
const path = require('path');

console.log('=== Fixing 306 Swarthmore Rd Photo ===\n');

// Read current JSON data
const jsonPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`Total properties in JSON: ${data.properties.length}\n`);

// Create backup
const backupPath = path.join(__dirname, `RENTAL_KING_COMPLETE_DATA.backup.${Date.now()}.json`);
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
console.log(`📦 Backup created: ${path.basename(backupPath)}\n`);

// Find and update 306 Swarthmore
const property = data.properties.find(p => p.id === 'Insana5' && p.address === '306 Swarthmore Rd');

if (property) {
  const oldPhoto = property.photoUrl;
  const newFileId = '1TXfGXFlptTXTiexhp11HXLMnwWFxmDT2';
  const newPhotoUrl = `https://lh3.googleusercontent.com/d/${newFileId}=w800-h600-c`;

  property.photoUrl = newPhotoUrl;

  console.log(`✓ Insana5 - 306 Swarthmore Rd`);
  console.log(`  Old photo: ${oldPhoto}`);
  console.log(`  New photo: ${newPhotoUrl}\n`);

  // Update metadata
  data.meta.updated = new Date().toISOString();

  // Save
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

  console.log(`✅ SUCCESS!`);
  console.log(`   Updated 306 Swarthmore Rd photo`);
  console.log(`   File saved: ${jsonPath}`);
} else {
  console.log(`❌ Property not found: Insana5 - 306 Swarthmore Rd`);
}
