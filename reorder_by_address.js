const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = '/Users/mszwed9696/.playwright-mcp/Rental-King-Properties---listings-from-master-complete.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Read current JSON data
const jsonPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('=== Reordering Properties by Address to Match Google Sheet ===\n');

// Normalize address for matching
function normalizeAddress(addr) {
  if (!addr) return '';
  return addr
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/\./g, '')
    .replace(/APT\s*/gi, '')
    .replace(/UNIT\s*/gi, '')
    .replace(/\s*[A-Z]$/, '') // Remove trailing unit letters
    .trim();
}

// Parse CSV to get addresses in order
const csvLines = csvContent.split('\n');
const orderedAddresses = [];

csvLines.forEach((line, index) => {
  if (index === 0) return; // Skip header
  if (!line.trim()) return; // Skip empty lines

  const columns = line.split(',');
  const csvId = columns[0]?.trim();
  const address = columns[2]?.trim();

  if (csvId && address) {
    orderedAddresses.push({
      csvId,
      address,
      normalizedAddress: normalizeAddress(address)
    });
  }
});

console.log(`CSV has ${orderedAddresses.length} properties in order\n`);

// Create a map of existing properties by normalized address
const propertyByAddress = {};
const propertyById = {};

data.properties.forEach(prop => {
  const normalized = normalizeAddress(prop.address);
  if (normalized) {
    // For properties with same address, use ID to differentiate
    const key = `${normalized}|${prop.id}`;
    propertyByAddress[key] = prop;

    // Also store just by address for initial lookup
    if (!propertyByAddress[normalized]) {
      propertyByAddress[normalized] = [];
    }
    propertyByAddress[normalized].push(prop);
  }
  propertyById[prop.id] = prop;
});

// Reorder properties array to match CSV order
const reorderedProperties = [];
const matched = new Set();
const notMatched = [];

orderedAddresses.forEach(csvEntry => {
  const normalized = csvEntry.normalizedAddress;
  const candidates = propertyByAddress[normalized];

  if (candidates && Array.isArray(candidates)) {
    // Find unmatched candidate
    const property = candidates.find(p => !matched.has(p.id));
    if (property) {
      reorderedProperties.push(property);
      matched.add(property.id);
    } else if (candidates.length > 0) {
      // All candidates already matched, use first one (shouldn't happen often)
      const prop = candidates[0];
      if (!matched.has(prop.id)) {
        reorderedProperties.push(prop);
        matched.add(prop.id);
      }
    }
  } else {
    notMatched.push(`${csvEntry.csvId} - ${csvEntry.address}`);
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
console.log(`Properties matched and reordered: ${matched.size}`);
console.log(`CSV entries not matched in JSON: ${notMatched.length}`);
if (notMatched.length > 0 && notMatched.length <= 10) {
  console.log('Not matched:');
  notMatched.forEach(m => console.log(`  - ${m}`));
}
console.log(`JSON properties not in CSV (added to end): ${notInCsv.length}`);
if (notInCsv.length > 0 && notInCsv.length <= 10) {
  console.log('Not in CSV:');
  notInCsv.forEach(m => console.log(`  - ${m}`));
}

// Show first 10 in new order
console.log(`\n=== First 10 Properties in New Order ===`);
reorderedProperties.slice(0, 10).forEach((prop, index) => {
  console.log(`${(index + 1).toString().padStart(3)}. ${prop.id.padEnd(15)} | ${prop.address}`);
});

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
console.log(`   Total properties: ${reorderedProperties.length}`);
console.log(`   Matched by address: ${matched.size}`);
console.log(`   File saved: ${jsonPath}`);
console.log(`\nProperties will now appear on website in the same order as Google Sheet.`);
