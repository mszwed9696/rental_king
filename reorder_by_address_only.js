const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = '/Users/mszwed9696/.playwright-mcp/Rental-King-Properties---listings-from-master-complete.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Read current JSON data
const jsonPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('=== Reordering by ADDRESS ONLY (ignoring CSV IDs) ===\n');
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
    .replace(/STREET/gi, 'ST')
    .replace(/AVENUE/gi, 'AVE')
    .replace(/ROAD/gi, 'RD')
    .replace(/BOULEVARD/gi, 'BLVD')
    .replace(/LANE/gi, 'LN')
    .replace(/DRIVE/gi, 'DR')
    .trim();
}

// Parse CSV to get addresses in order
const csvLines = csvContent.split('\n');
const csvAddresses = [];

csvLines.forEach((line, index) => {
  if (index === 0) return; // Skip header
  if (!line.trim()) return; // Skip empty lines

  const columns = line.split(',');
  const csvId = columns[0]?.trim();
  const address = columns[2]?.trim();

  if (csvId && address) {
    csvAddresses.push({
      rowNumber: index,
      csvId,
      address,
      normalizedAddress: normalizeAddress(address)
    });
  }
});

console.log(`CSV has ${csvAddresses.length} addresses\n`);

// Create mapping by normalized address
const jsonByNormalizedAddress = {};

data.properties.forEach(prop => {
  const normalized = normalizeAddress(prop.address);
  if (!jsonByNormalizedAddress[normalized]) {
    jsonByNormalizedAddress[normalized] = [];
  }
  jsonByNormalizedAddress[normalized].push(prop);
});

console.log('=== Matching by address only ===\n');

// Match properties by address in CSV order
const reorderedProperties = [];
const matched = new Set();
const notMatched = [];

csvAddresses.forEach((csvAddr, index) => {
  const candidates = jsonByNormalizedAddress[csvAddr.normalizedAddress];

  if (candidates && candidates.length > 0) {
    // Find first unmatched candidate
    const jsonProp = candidates.find(p => !matched.has(p.id));

    if (jsonProp) {
      reorderedProperties.push(jsonProp);
      matched.add(jsonProp.id);

      if (index < 30) {
        console.log(`${(index + 1).toString().padStart(3)}. ${jsonProp.id.padEnd(15)} | ${jsonProp.address}`);
      }
    } else {
      // All candidates already matched
      notMatched.push(`Row ${csvAddr.rowNumber}: ${csvAddr.csvId} - ${csvAddr.address} (all candidates matched)`);
    }
  } else {
    notMatched.push(`Row ${csvAddr.rowNumber}: ${csvAddr.csvId} - ${csvAddr.address} (no match)`);
    if (index < 30) {
      console.log(`${(index + 1).toString().padStart(3)}. [NO MATCH] ${csvAddr.csvId} - ${csvAddr.address}`);
    }
  }
});

// Add remaining properties not in CSV at the end
console.log(`\n=== Adding properties not in CSV ===\n`);
const notInCsv = [];

data.properties.forEach(prop => {
  if (!matched.has(prop.id)) {
    reorderedProperties.push(prop);
    notInCsv.push(prop);
    if (notInCsv.length <= 15) {
      console.log(`  ${prop.id.padEnd(15)} | ${prop.address}`);
    }
  }
});

console.log(`\n=== Summary ===`);
console.log(`CSV addresses: ${csvAddresses.length}`);
console.log(`Matched: ${matched.size}`);
console.log(`CSV not matched: ${notMatched.length}`);
console.log(`JSON not in CSV: ${notInCsv.length}`);
console.log(`Total: ${reorderedProperties.length}`);
console.log(`Expected: ${data.properties.length}`);

if (notMatched.length > 0) {
  console.log(`\n=== Unmatched CSV rows (first 10) ===`);
  notMatched.slice(0, 10).forEach(m => console.log(`  ${m}`));
}

if (reorderedProperties.length !== data.properties.length) {
  console.log(`\n❌ ERROR: Count mismatch! Aborting.`);
  process.exit(1);
}

console.log('\n=== First 30 in final order ===');
reorderedProperties.slice(0, 30).forEach((prop, i) => {
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
console.log(`   Reordered ${reorderedProperties.length} properties by address`);
console.log(`   File saved: ${jsonPath}`);
