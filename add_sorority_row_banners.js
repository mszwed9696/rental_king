const fs = require('fs');
const path = require('path');

console.log('=== Adding Sorority Row Banners ===\n');

// Properties that need Sorority Row designation
const sororityRowAddresses = [
  '38 CARPENTER ST',
  '42 CARPENTER ST',
  '46 CARPENTER ST'
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

// Update each sorority row property
data.properties.forEach((property) => {
  if (sororityRowAddresses.includes(property.address)) {
    const oldType = property.type || '';

    // Add "Sorority Row" to the type if not already present
    if (!oldType.includes('Sorority Row')) {
      property.type = oldType ? `${oldType} - Sorority Row` : 'Sorority Row';
      updatedCount++;

      console.log(`✓ ${property.id.padEnd(15)} | ${property.address.padEnd(35)}`);
      console.log(`  Old type: "${oldType}"`);
      console.log(`  New type: "${property.type}"\n`);
    } else {
      console.log(`→ ${property.id.padEnd(15)} | ${property.address.padEnd(35)} (already has Sorority Row)\n`);
    }
  }
});

console.log(`=== Summary ===`);
console.log(`Properties updated with Sorority Row: ${updatedCount}/3`);

// Update metadata
data.meta.updated = new Date().toISOString();

// Save
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log(`\n✅ SUCCESS!`);
console.log(`   Added Sorority Row banners to ${updatedCount} properties`);
console.log(`   File saved: ${jsonPath}`);
console.log(`\nBanner colors:`);
console.log(`  - 38 CARPENTER ST: Green (#32CD32)`);
console.log(`  - 42 CARPENTER ST: Purple (#D946EF)`);
console.log(`  - 46 CARPENTER ST: Pink (#FFB6C1)`);
