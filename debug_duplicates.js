const fs = require('fs');

// Read the CSV file
const csvPath = '/Users/mszwed9696/.playwright-mcp/Rental-King-Properties---listings-from-master-complete.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Read current JSON data
const data = JSON.parse(fs.readFileSync('RENTAL_KING_COMPLETE_DATA.json', 'utf8'));

console.log('=== Finding Duplicate Matches ===\n');

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

// Parse CSV
const csvLines = csvContent.split('\n');
const csvProperties = [];

csvLines.forEach((line, index) => {
  if (index === 0 || !line.trim()) return;

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

// Track all matches
const matchLog = [];
const matchCount = {};

csvProperties.forEach((csvProp) => {
  let jsonProp = null;
  let matchType = '';

  // Strategy 1: Try to match by ID
  if (jsonById[csvProp.csvId]) {
    jsonProp = jsonById[csvProp.csvId];
    matchType = 'by ID';
  }

  // Strategy 2: Try to match by normalized address
  if (!jsonProp) {
    const candidates = jsonByNormalizedAddress[csvProp.normalizedAddress];
    if (candidates && candidates.length > 0) {
      jsonProp = candidates[0]; // Take first for debugging
      matchType = `by address (${candidates.length} candidates)`;
    }
  }

  if (jsonProp) {
    matchCount[jsonProp.id] = (matchCount[jsonProp.id] || 0) + 1;
    matchLog.push({
      csvId: csvProp.csvId,
      csvAddress: csvProp.address,
      jsonId: jsonProp.id,
      jsonAddress: jsonProp.address,
      matchType
    });
  }
});

// Find duplicates
console.log('=== Properties Matched Multiple Times ===\n');
Object.keys(matchCount).forEach(jsonId => {
  if (matchCount[jsonId] > 1) {
    console.log(`JSON Property: ${jsonId}`);
    console.log(`  Matched ${matchCount[jsonId]} times by these CSV rows:`);
    matchLog.filter(m => m.jsonId === jsonId).forEach(m => {
      console.log(`    - CSV: ${m.csvId} | ${m.csvAddress} | ${m.matchType}`);
    });
    console.log('');
  }
});

// Check for duplicate CSV IDs
console.log('\n=== Duplicate CSV IDs ===\n');
const csvIdCount = {};
csvProperties.forEach(p => {
  csvIdCount[p.csvId] = (csvIdCount[p.csvId] || 0) + 1;
});

Object.keys(csvIdCount).forEach(id => {
  if (csvIdCount[id] > 1) {
    console.log(`CSV ID "${id}" appears ${csvIdCount[id]} times`);
  }
});
