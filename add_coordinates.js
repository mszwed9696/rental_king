const fs = require('fs');
const path = require('path');

// Read the CSV file with lat/lng data
const csvPath = '/Users/mszwed9696/.playwright-mcp/Rental-King-Properties-UPDATED.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Read current JSON data
const jsonPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('=== Adding Coordinates to Properties ===\n');
console.log(`Total properties in JSON: ${data.properties.length}\n`);

// Parse CSV
const csvLines = csvContent.split('\n');
const coordinateMap = {};

csvLines.forEach((line, index) => {
  if (index === 0) return; // Skip header
  if (!line.trim()) return; // Skip empty lines

  const columns = line.split(',');
  const id = columns[0]?.trim();
  const latLngStr = columns[15]?.trim(); // lat,lng column

  if (id && latLngStr) {
    // Parse "lat, lng" format
    const coords = latLngStr.split(',').map(c => parseFloat(c.trim()));
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      coordinateMap[id] = {
        lat: coords[0],
        lng: coords[1]
      };
    }
  }
});

console.log(`Found coordinates for ${Object.keys(coordinateMap).length} properties in CSV\n`);

// Create backup
const backupPath = path.join(__dirname, `RENTAL_KING_COMPLETE_DATA.backup.${Date.now()}.json`);
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
console.log(`📦 Backup created: ${path.basename(backupPath)}\n`);

// Update properties with coordinates
let updatedCount = 0;
let notFoundCount = 0;

data.properties.forEach((property, index) => {
  if (coordinateMap[property.id]) {
    property.lat = coordinateMap[property.id].lat;
    property.lng = coordinateMap[property.id].lng;
    updatedCount++;

    if (index < 10) {
      console.log(`${(index + 1).toString().padStart(3)}. ${property.id.padEnd(15)} | ${property.address.padEnd(30)} | ${property.lat}, ${property.lng}`);
    }
  } else {
    notFoundCount++;
    if (notFoundCount <= 5) {
      console.log(`❌ No coords for ${property.id} (${property.address})`);
    }
  }
});

console.log(`\n=== Summary ===`);
console.log(`Properties updated with coords: ${updatedCount}`);
console.log(`Properties without coords: ${notFoundCount}`);
console.log(`Total: ${data.properties.length}`);

// Update metadata
data.meta.updated = new Date().toISOString();

// Save updated data
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log(`\n✅ SUCCESS!`);
console.log(`   Added coordinates to ${updatedCount} properties`);
console.log(`   File saved: ${jsonPath}`);
