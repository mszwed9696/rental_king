const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = '/Users/mszwed9696/.playwright-mcp/Rental-King-Properties---listings-from-master-complete.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Read current JSON data
const jsonPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('=== Reordering Properties to Match Google Sheet Order ===\n');
console.log(`Starting with ${data.properties.length} properties\n`);

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
const csvNotMatched = [];

console.log('=== Matching CSV order ===\n');

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
    if (index < 15) {
      console.log(`${(index + 1).toString().padStart(3)}. Matched: ${jsonProp.id.padEnd(15)} | ${jsonProp.address}`);
    }
  } else {
    csvNotMatched.push(csvProp);
    if (index < 15) {
      console.log(`${(index + 1).toString().padStart(3)}. No match: ${csvProp.csvId.padEnd(15)} | ${csvProp.address}`);
    }
  }
});

// Add any properties not found in CSV to the end (preserve them!)
console.log(`\n=== Adding properties not in CSV ===\n`);
const notInCsv = [];

data.properties.forEach(prop => {
  if (!matched.has(prop.id)) {
    reorderedProperties.push(prop);
    notInCsv.push(prop);
    if (notInCsv.length <= 10) {
      console.log(`  ${prop.id.padEnd(15)} | ${prop.address}`);
    }
  }
});

console.log(`\n=== Final Summary ===`);
console.log(`Started with: ${data.properties.length} properties`);
console.log(`CSV rows: ${csvProperties.length}`);
console.log(`Matched from CSV: ${matched.size}`);
console.log(`CSV not matched: ${csvNotMatched.length}`);
console.log(`JSON not in CSV (appended to end): ${notInCsv.length}`);
console.log(`Final count: ${reorderedProperties.length}`);

if (reorderedProperties.length !== data.properties.length) {
  console.log(`\n⚠️  WARNING: Property count changed from ${data.properties.length} to ${reorderedProperties.length}`);
  console.log(`This should not happen! Aborting to prevent data loss.`);
  process.exit(1);
}

console.log('\n=== First 10 in final order ===');
reorderedProperties.slice(0, 10).forEach((prop, i) => {
  console.log(`${(i + 1).toString().padStart(3)}. ${prop.id.padEnd(15)} | ${prop.address}`);
});

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
console.log(`   All ${reorderedProperties.length} properties preserved and reordered`);
console.log(`   File saved: ${jsonPath}`);
console.log(`\nProperties will now appear on website in Google Sheet order, with extras at the end.`);
