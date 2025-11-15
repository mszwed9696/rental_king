const fs = require('fs');
const path = require('path');

console.log('=== Adding Photo to 111 Franklin Rd Units ===\n');

// Read current JSON data
const jsonPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`Total properties in JSON: ${data.properties.length}\n`);

// Create backup
const backupPath = path.join(__dirname, `RENTAL_KING_COMPLETE_DATA.backup.${Date.now()}.json`);
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
console.log(`📦 Backup created: ${path.basename(backupPath)}\n`);

// File ID for 111 Franklin Rd photo
const fileId = '1iTUwMZuR03pAeXq3BF5zCXVL-x928ahC';
const photoUrl = `https://lh3.googleusercontent.com/d/${fileId}=w800-h600-c`;

let updatedCount = 0;

// Update Hee1 and Hee2 properties
data.properties.forEach((property) => {
  if (property.id === 'Hee1' || property.id === 'Hee2') {
    property.photoUrl = photoUrl;
    updatedCount++;
    console.log(`✓ ${property.id.padEnd(15)} | ${property.address.padEnd(35)} | Added photo`);
  }
});

console.log(`\n=== Summary ===`);
console.log(`Properties updated with photos: ${updatedCount}`);
console.log(`Total properties: ${data.properties.length}`);

// Update metadata
data.meta.updated = new Date().toISOString();

// Save updated data
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log(`\n✅ SUCCESS!`);
console.log(`   Added photos to ${updatedCount} properties`);
console.log(`   File saved: ${jsonPath}`);
