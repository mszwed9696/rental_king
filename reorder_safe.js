const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = '/Users/mszwed9696/.playwright-mcp/Rental-King-Properties---listings-from-master-complete.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Read current JSON data
const jsonPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('=== Reordering Properties to Match Google Sheet (Safe Mode) ===\n');
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

// Reorder properties - Priority 1: Match by ID with matching address
const reorderedProperties = [];
const matched = new Set();

console.log('=== Phase 1: Match by ID where address also matches ===\n');

csvProperties.forEach((csvProp, index) => {
  const jsonProp = jsonById[csvProp.csvId];

  if (jsonProp && !matched.has(jsonProp.id)) {
    const jsonNormalized = normalizeAddress(jsonProp.address);
    // Only match if addresses are similar
    if (jsonNormalized === csvProp.normalizedAddress ||
        jsonNormalized.includes(csvProp.normalizedAddress) ||
        csvProp.normalizedAddress.includes(jsonNormalized)) {
      reorderedProperties.push(jsonProp);
      matched.add(jsonProp.id);
      if (index < 10) {
        console.log(`${(index + 1).toString().padStart(3)}. ${jsonProp.id.padEnd(15)} | ${jsonProp.address}`);
      }
    }
  }
});

console.log(`\nMatched ${matched.size} by ID with address verification`);

// Phase 2: Match remaining by address only (for properties not matched by ID)
console.log('\n=== Phase 2: Match by address only ===\n');

csvProperties.forEach((csvProp, index) => {
  // Skip if we already processed this CSV row in phase 1
  const potentialIdMatch = jsonById[csvProp.csvId];
  if (potentialIdMatch && matched.has(potentialIdMatch.id)) {
    return; // Already matched in phase 1
  }

  const candidates = jsonByNormalizedAddress[csvProp.normalizedAddress];
  if (candidates && candidates.length > 0) {
    const unmatched = candidates.find(p => !matched.has(p.id));
    if (unmatched) {
      reorderedProperties.push(unmatched);
      matched.add(unmatched.id);
      if (matched.size <= 60) {
        console.log(`${reorderedProperties.length.toString().padStart(3)}. ${unmatched.id.padEnd(15)} | ${unmatched.address}`);
      }
    }
  }
});

console.log(`\nTotal matched after phase 2: ${matched.size}`);

// Phase 3: Add remaining JSON properties at the end
console.log('\n=== Phase 3: Adding unmatched properties ===\n');

data.properties.forEach(prop => {
  if (!matched.has(prop.id)) {
    reorderedProperties.push(prop);
    if (reorderedProperties.length - matched.size <= 10) {
      console.log(`  ${prop.id.padEnd(15)} | ${prop.address}`);
    }
  }
});

console.log(`\n=== Final Summary ===`);
console.log(`Started with: ${data.properties.length} properties`);
console.log(`Final count: ${reorderedProperties.length}`);
console.log(`CSV-ordered: ${matched.size}`);
console.log(`Appended at end: ${reorderedProperties.length - matched.size}`);

if (reorderedProperties.length !== data.properties.length) {
  console.log(`\n❌ ERROR: Property count changed from ${data.properties.length} to ${reorderedProperties.length}`);
  console.log(`Aborting to prevent data loss.`);
  process.exit(1);
}

console.log('\n=== First 15 in final order ===');
reorderedProperties.slice(0, 15).forEach((prop, i) => {
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
console.log(`\nProperties now appear in Google Sheet order (where matches found), with extras at end.`);
