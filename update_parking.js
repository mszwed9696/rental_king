const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = '/Users/mszwed9696/.playwright-mcp/Rental-King-Properties---listings-from-master-complete.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Read current JSON data
const jsonPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('=== Updating Parking Information from CSV ===\n');

// Parse CSV and create address-to-parking map
const parkingMap = {};
const csvLines = csvContent.split('\n');

csvLines.forEach((line, index) => {
  if (index === 0) return; // Skip header

  const columns = line.split(',');
  const csvId = columns[0]?.trim();
  const address = columns[2]?.trim();
  const parking = columns[6]?.trim(); // Column G is parking

  if (csvId && address && parking) {
    parkingMap[csvId] = {
      address,
      parking: parseInt(parking) || 0
    };
  }
});

console.log(`Loaded ${Object.keys(parkingMap).length} properties with parking data from CSV\n`);

// Properties missing parking
const missingParking = [
  'Humbert1', 'Mcfadden2', 'Agnes1', 'Agnes 2', 'Mcfadden3', 'McFadden1',
  'Hildebrant2', 'Hildebrant1', 'Agnes 3', 'Humbert2', 'Hildebrant3',
  'Insana1', 'Insana5', 'Insana4', 'Insana2', 'Insana3'
];

let updatedCount = 0;

missingParking.forEach(propId => {
  const property = data.properties.find(p => p.id === propId);

  if (property && parkingMap[propId]) {
    const oldParking = property.parking || 0;
    property.parking = parkingMap[propId].parking;
    console.log(`✓ Updated ${propId.padEnd(15)} | ${property.address.padEnd(35)} | Parking: ${oldParking} → ${property.parking}`);
    updatedCount++;
  } else if (property) {
    console.log(`✗ No CSV data for ${propId.padEnd(15)} | ${property.address}`);
  } else {
    console.log(`✗ Property not found: ${propId}`);
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
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

  console.log(`\n✅ SUCCESS!`);
  console.log(`   Updated: ${updatedCount} properties`);
  console.log(`   File saved: ${jsonPath}`);
} else {
  console.log('\n❌ No properties were updated.');
}
