const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = '/Users/mszwed9696/.playwright-mcp/Rental-King-Properties---listings-from-master-complete.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Read current JSON data
const jsonPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('=== Reordering Properties to Match Google Sheet Order ===\n');
console.log(`JSON has ${data.properties.length} properties`);

// Normalize address for matching
function normalizeAddress(addr) {
  if (!addr) return '';
  return addr
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/\./g, '')
    .replace(/APARTMENT/gi, 'APT')
    .replace(/UNIT/gi, 'APT')
    .trim();
}

// Parse CSV to get properties in order
const csvLines = csvContent.split('\n');
const csvProperties = [];

csvLines.forEach((line, index) => {
  if (index === 0) return; // Skip header
  if (!line.trim()) return; // Skip empty lines

  const columns = line.split(',');
  const csvId = columns[0]?.trim();
  const address = columns[2]?.trim();

  if (csvId && address) {
    csvProperties.push({
      rowNumber: index,
      csvId,
      address,
      normalizedAddress: normalizeAddress(address)
    });
  }
});

console.log(`CSV has ${csvProperties.length} properties\n`);

// Create mappings for JSON properties
const jsonById = {};
const jsonByNormalizedAddress = {};

data.properties.forEach(prop => {
  jsonById[prop.id] = prop;

  const normalized = normalizeAddress(prop.address);
  if (!jsonByNormalizedAddress[normalized]) {
    jsonByNormalizedAddress[normalized] = [];
  }
  jsonByNormalizedAddress[normalized].push(prop);
});

// Reorder properties
const reorderedProperties = [];
const matched = new Set();
const notMatched = [];

csvProperties.forEach((csvProp, index) => {
  let jsonProp = null;

  // Strategy 1: Try to match by ID
  if (jsonById[csvProp.csvId] && !matched.has(csvProp.csvId)) {
    jsonProp = jsonById[csvProp.csvId];
  }

  // Strategy 2: Try to match by normalized address
  if (!jsonProp) {
    const candidates = jsonByNormalizedAddress[csvProp.normalizedAddress];
    if (candidates && candidates.length > 0) {
      // Find first unmatched candidate
      jsonProp = candidates.find(p => !matched.has(p.id));
    }
  }

  if (jsonProp) {
    reorderedProperties.push(jsonProp);
    matched.add(jsonProp.id);
    if (index < 10) {
      console.log(`${(index + 1).toString().padStart(3)}. ${jsonProp.id.padEnd(15)} | ${jsonProp.address}`);
    }
  } else {
    notMatched.push(`Row ${csvProp.rowNumber}: ${csvProp.csvId} - ${csvProp.address}`);
    if (notMatched.length <= 5) {
      console.log(`${(index + 1).toString().padStart(3)}. [NOT FOUND] ${csvProp.csvId} - ${csvProp.address}`);
    }
  }
});

// Add any properties not found in CSV to the end
const notInCsv = [];
data.properties.forEach(prop => {
  if (!matched.has(prop.id)) {
    reorderedProperties.push(prop);
    notInCsv.push(`${prop.id} - ${prop.address}`);
  }
});

console.log(`\n=== Reorder Summary ===`);
console.log(`Total JSON properties: ${data.properties.length}`);
console.log(`Total CSV rows: ${csvProperties.length}`);
console.log(`Properties matched: ${matched.size}`);
console.log(`CSV rows not matched: ${notMatched.length}`);
console.log(`JSON properties not in CSV: ${notInCsv.length}`);

if (notMatched.length > 0) {
  console.log(`\n=== CSV Rows Not Matched (first 10) ===`);
  notMatched.slice(0, 10).forEach(m => console.log(`  ${m}`));
}

if (notInCsv.length > 0) {
  console.log(`\n=== JSON Properties Not in CSV (first 10) ===`);
  notInCsv.slice(0, 10).forEach(m => console.log(`  ${m}`));
}

// Create backup
const backupPath = path.join(__dirname, `RENTAL_KING_COMPLETE_DATA.backup.${Date.now()}.json`);
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
console.log(`\n📦 Backup created`);

// Update properties array
data.properties = reorderedProperties;

// Update metadata
data.meta.updated = new Date().toISOString();

// Save updated data
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log(`\n✅ SUCCESS!`);
console.log(`   Reordered ${reorderedProperties.length} properties`);
console.log(`   File saved: ${jsonPath}`);
console.log(`\nProperties will now appear on website in Google Sheet order.`);
