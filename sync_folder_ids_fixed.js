const fs = require('fs');
const path = require('path');

// Proper CSV parser that handles quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current); // Add last field

  return result;
}

// Read the CSV file
const csvPath = '/Users/mszwed9696/.playwright-mcp/Rental-King-Properties---listings-from-master-complete.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Read current JSON data
const jsonPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('=== Syncing folder IDs from CSV ===\n');
console.log(`Total properties in JSON: ${data.properties.length}\n`);

// Parse CSV
const csvLines = csvContent.split('\n');
const folderIdMap = {};

csvLines.forEach((line, index) => {
  if (index === 0) return; // Skip header
  if (!line.trim()) return; // Skip empty lines

  const columns = parseCSVLine(line);
  const id = columns[0]?.trim();
  const photo_folder_id = columns[10]?.trim();

  if (id && photo_folder_id) {
    folderIdMap[id] = photo_folder_id;
  }
});

console.log(`Found folder IDs for ${Object.keys(folderIdMap).length} properties in CSV\n`);

// Create backup
const backupPath = path.join(__dirname, `RENTAL_KING_COMPLETE_DATA.backup.${Date.now()}.json`);
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
console.log(`📦 Backup created: ${path.basename(backupPath)}\n`);

// Update properties with folder IDs
let updatedCount = 0;

data.properties.forEach((property, index) => {
  const csvFolderId = folderIdMap[property.id];

  // Only update if CSV has a folder ID and it's different from current
  if (csvFolderId && csvFolderId !== property.photo_folder_id) {
    const oldId = property.photo_folder_id || '(none)';
    property.photo_folder_id = csvFolderId;
    updatedCount++;

    if (updatedCount <= 15) {
      console.log(`${updatedCount.toString().padStart(2)}. ${property.id.padEnd(15)} | ${property.address.padEnd(35)} | Updated folder ID`);
    }
  }
});

console.log(`\n=== Summary ===`);
console.log(`Properties with updated folder IDs: ${updatedCount}`);
console.log(`Total properties: ${data.properties.length}`);

// Update metadata
data.meta.updated = new Date().toISOString();

// Save updated data
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log(`\n✅ SUCCESS!`);
console.log(`   Updated folder IDs for ${updatedCount} properties`);
console.log(`   File saved: ${jsonPath}`);
