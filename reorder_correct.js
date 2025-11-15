const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = '/Users/mszwed9696/.playwright-mcp/Rental-King-Properties---listings-from-master-complete.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Read current JSON data
const jsonPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('=== Reordering Properties to Match CSV Row Order ===\n');
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
      csvRowIndex: index,
      csvId,
      address,
      normalizedAddress: normalizeAddress(address)
    });
  }
});

console.log(`CSV has ${csvProperties.length} rows\n`);

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

// Process CSV row by row and match to JSON properties
const reorderedProperties = [];
const matched = new Set();
const csvNotMatched = [];

console.log('=== Matching CSV rows in order ===\n');

csvProperties.forEach((csvProp, index) => {
  let jsonProp = null;
  let matchMethod = '';

  // Try to match by ID first
  if (jsonById[csvProp.csvId]) {
    jsonProp = jsonById[csvProp.csvId];
    matchMethod = 'ID';

    // Verify address similarity
    const jsonNormalized = normalizeAddress(jsonProp.address);
    const similarAddress = jsonNormalized === csvProp.normalizedAddress ||
                          jsonNormalized.includes(csvProp.normalizedAddress) ||
                          csvProp.normalizedAddress.includes(jsonNormalized);

    if (!similarAddress && !matched.has(jsonProp.id)) {
      // ID match but address doesn't match - might be wrong match
      console.log(`⚠️  ID match but address mismatch: CSV ${csvProp.csvId} (${csvProp.address}) vs JSON ${jsonProp.id} (${jsonProp.address})`);
    }
  }

  // If not matched by ID, try by address
  if (!jsonProp || matched.has(jsonProp.id)) {
    const candidates = jsonByNormalizedAddress[csvProp.normalizedAddress];
    if (candidates && candidates.length > 0) {
      jsonProp = candidates.find(p => !matched.has(p.id));
      matchMethod = 'address';
    }
  }

  if (jsonProp && !matched.has(jsonProp.id)) {
    reorderedProperties.push(jsonProp);
    matched.add(jsonProp.id);

    if (index < 15) {
      console.log(`${(index + 1).toString().padStart(3)}. [${matchMethod}] ${jsonProp.id.padEnd(15)} | ${jsonProp.address}`);
    }
  } else {
    csvNotMatched.push(csvProp);
    if (index < 15) {
      console.log(`${(index + 1).toString().padStart(3)}. [SKIP] ${csvProp.csvId.padEnd(15)} | ${csvProp.address}`);
    }
  }
});

// Add remaining JSON properties at the end
console.log(`\n=== Adding unmatched JSON properties at end ===\n`);
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

console.log(`\n=== Summary ===`);
console.log(`CSV rows: ${csvProperties.length}`);
console.log(`Matched from CSV: ${matched.size}`);
console.log(`CSV not matched: ${csvNotMatched.length}`);
console.log(`JSON not in CSV: ${notInCsv.length}`);
console.log(`Total in reordered array: ${reorderedProperties.length}`);
console.log(`Expected: ${data.properties.length}`);

if (reorderedProperties.length !== data.properties.length) {
  console.log(`\n❌ ERROR: Count mismatch! Aborting.`);
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
console.log(`   All ${reorderedProperties.length} properties reordered to match CSV`);
console.log(`   File saved: ${jsonPath}`);
