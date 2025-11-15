const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = '/Users/mszwed9696/.playwright-mcp/Rental-King-Properties---listings-from-master-complete.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Read current JSON data
const jsonPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('=== Reordering Properties to Match Google Sheet ===\n');

// Parse CSV to get property IDs in order
const csvLines = csvContent.split('\n');
const orderedIds = [];

csvLines.forEach((line, index) => {
  if (index === 0) return; // Skip header
  if (!line.trim()) return; // Skip empty lines

  const columns = line.split(',');
  const csvId = columns[0]?.trim();

  if (csvId) {
    orderedIds.push(csvId);
  }
});

console.log(`CSV Order (${orderedIds.length} properties):`);
orderedIds.forEach((id, index) => {
  console.log(`${(index + 1).toString().padStart(3)}. ${id}`);
});

// Create a map of existing properties
const propertyMap = {};
data.properties.forEach(prop => {
  propertyMap[prop.id] = prop;
});

// Reorder properties array to match CSV order
const reorderedProperties = [];
const notFoundInJson = [];
const notFoundInCsv = [];

orderedIds.forEach(csvId => {
  if (propertyMap[csvId]) {
    reorderedProperties.push(propertyMap[csvId]);
  } else {
    notFoundInJson.push(csvId);
  }
});

// Check for properties in JSON but not in CSV order
data.properties.forEach(prop => {
  if (!orderedIds.includes(prop.id)) {
    notFoundInCsv.push(prop.id);
  }
});

console.log(`\n\n=== Reorder Summary ===`);
console.log(`Properties reordered: ${reorderedProperties.length}`);
console.log(`CSV IDs not found in JSON: ${notFoundInJson.length}`);
if (notFoundInJson.length > 0) {
  console.log('  Missing:', notFoundInJson.join(', '));
}
console.log(`JSON IDs not found in CSV: ${notFoundInCsv.length}`);
if (notFoundInCsv.length > 0) {
  console.log('  Extra:', notFoundInCsv.join(', '));
}

// Create backup
const backupPath = path.join(__dirname, `RENTAL_KING_COMPLETE_DATA.backup.${Date.now()}.json`);
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
console.log(`\n📦 Backup created: ${backupPath}`);

// Update properties array
data.properties = reorderedProperties;

// Update metadata
data.meta.updated = new Date().toISOString();

// Save updated data
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log(`\n✅ SUCCESS!`);
console.log(`   Properties reordered: ${reorderedProperties.length}`);
console.log(`   File saved: ${jsonPath}`);
console.log(`\nProperties will now appear on website in the same order as Google Sheet (top to bottom, left to right).`);
