const fs = require('fs');
const path = require('path');

// Read current JSON data
const jsonPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('=== Fixing Duplicate P041 ===\n');

// Find both P041 properties
const p041Properties = [];
data.properties.forEach((prop, index) => {
  if (prop.id === 'P041') {
    p041Properties.push({ prop, index });
  }
});

console.log(`Found ${p041Properties.length} properties with ID P041\n`);

p041Properties.forEach((item, i) => {
  console.log(`P041 #${i + 1} (index ${item.index}):`);
  console.log(`  Address: ${item.prop.address}`);
  console.log(`  Status: ${item.prop.status}`);
  console.log(`  Beds: ${item.prop.beds}, Rent: $${item.prop.rent}`);
});

// Based on CSV, the properties should be:
// - Allen1: 5 WILSON
// - Pink8: 7 SPANISH OAK CT

// Rename them
p041Properties.forEach((item) => {
  if (item.prop.address === '5 WILSON') {
    item.prop.id = 'Allen1';
    console.log(`\n✓ Renamed 5 WILSON to: Allen1`);
  } else if (item.prop.address === '7 SPANISH OAK CT') {
    item.prop.id = 'Pink8';
    console.log(`✓ Renamed 7 SPANISH OAK CT to: Pink8`);
  }
});

// Verify no more duplicates
const ids = data.properties.map(p => p.id);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

console.log(`\n=== Verification ===`);
console.log(`Total properties: ${data.properties.length}`);
console.log(`Unique IDs: ${new Set(ids).size}`);
console.log(`Duplicates: ${duplicates.length ? duplicates.join(', ') : 'None'}`);

if (duplicates.length > 0) {
  console.log(`\n❌ Still have duplicates! Aborting.`);
  process.exit(1);
}

// Create backup
const backupPath = path.join(__dirname, `RENTAL_KING_COMPLETE_DATA.backup.${Date.now()}.json`);
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
console.log(`\n📦 Backup created`);

// Update metadata
data.meta.updated = new Date().toISOString();

// Save updated data
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log(`\n✅ SUCCESS!`);
console.log(`   Fixed duplicate P041 IDs`);
console.log(`   File saved: ${jsonPath}`);
