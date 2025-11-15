const fs = require('fs');
const path = require('path');

// Read the NEW CSV file
const csvPath = '/Users/mszwed9696/.playwright-mcp/Rental-King-Properties-UPDATED.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Read current JSON data
const jsonPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const currentData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('=== Syncing from Updated Google Sheet CSV ===\n');
console.log(`Current JSON has ${currentData.properties.length} properties\n`);

// Parse CSV
const csvLines = csvContent.split('\n');
const csvProperties = [];

csvLines.forEach((line, index) => {
  if (index === 0) return; // Skip header
  if (!line.trim()) return; // Skip empty lines

  const columns = line.split(',');

  const id = columns[0]?.trim();
  const title = columns[1]?.trim();
  const address = columns[2]?.trim() || title; // Use title if address is empty
  const city = columns[3]?.trim();
  const email = columns[4]?.trim();
  const beds = parseInt(columns[5]?.trim()) || 0;
  const baths = parseFloat(columns[6]?.trim()) || 0;
  const rentStr = columns[7]?.trim();
  const rent = rentStr && rentStr !== 'RENTED' ? parseInt(rentStr) || 0 : 0;
  const sqft = columns[8]?.trim();
  const status = columns[9]?.trim() || 'available';
  const photo_folder_id = columns[10]?.trim();
  const photo_urls = columns[11]?.trim();
  const map_link = columns[12]?.trim();
  const parking = parseInt(columns[13]?.trim()) || 0;
  const leaseStart = columns[14]?.trim();
  const latLng = columns[15]?.trim();
  const primaryPhoto = columns[17]?.trim();

  if (id && address) {
    // Parse lat/lng
    let lat = 0, lng = 0;
    if (latLng) {
      const coords = latLng.split(',').map(c => parseFloat(c.trim()));
      if (coords.length === 2) {
        lat = coords[0];
        lng = coords[1];
      }
    }

    csvProperties.push({
      id,
      title: title || address,
      address,
      city: city || '',
      email: email || '',
      type: city || 'Residential',
      beds,
      baths,
      rent,
      sqft: sqft || '',
      status,
      photo_folder_id: photo_folder_id || '',
      photo_urls: photo_urls || '',
      map_link: map_link || '',
      parking,
      leaseStart: leaseStart || '',
      lat,
      lng,
      primaryPhoto: primaryPhoto || ''
    });
  }
});

console.log(`CSV has ${csvProperties.length} properties\n`);

// Create a map of existing JSON properties to preserve photoUrl
const existingByAddress = {};
const existingById = {};

function normalizeAddress(addr) {
  return addr.toUpperCase().replace(/\s+/g, ' ').replace(/\./g, '').trim();
}

currentData.properties.forEach(prop => {
  existingById[prop.id] = prop;
  const normalized = normalizeAddress(prop.address);
  existingByAddress[normalized] = prop;
});

// Sync properties from CSV
const syncedProperties = [];
let addedCount = 0;
let updatedCount = 0;

csvProperties.forEach((csvProp, index) => {
  // Check if property exists
  const existing = existingById[csvProp.id] || existingByAddress[normalizeAddress(csvProp.address)];

  if (existing) {
    // Update existing property, but preserve photoUrl if it exists
    const updated = {
      ...csvProp,
      photoUrl: existing.photoUrl || '', // Preserve existing photo
      photoUrlBackup: existing.photoUrlBackup || ''
    };
    syncedProperties.push(updated);
    updatedCount++;

    if (index < 10) {
      console.log(`${(index + 1).toString().padStart(3)}. [UPDATE] ${csvProp.id.padEnd(15)} | ${csvProp.address}`);
    }
  } else {
    // New property
    const newProp = {
      ...csvProp,
      photoUrl: '',
      photoUrlBackup: ''
    };
    syncedProperties.push(newProp);
    addedCount++;
    console.log(`  + [NEW] ${csvProp.id.padEnd(15)} | ${csvProp.address}`);
  }
});

console.log(`\n=== Summary ===`);
console.log(`CSV properties: ${csvProperties.length}`);
console.log(`Updated existing: ${updatedCount}`);
console.log(`Added new: ${addedCount}`);
console.log(`Total in synced array: ${syncedProperties.length}`);

console.log(`\n=== New Properties (if any) ===`);
if (addedCount > 0) {
  syncedProperties.forEach((prop, index) => {
    const wasNew = !existingById[prop.id] && !existingByAddress[normalizeAddress(prop.address)];
    if (wasNew) {
      console.log(`  ${prop.id.padEnd(15)} | ${prop.address.padEnd(35)} | ${prop.beds}bed/${prop.baths}bath | $${prop.rent}/mo`);
    }
  });
} else {
  console.log('  None - all properties already existed');
}

// Create backup
const backupPath = path.join(__dirname, `RENTAL_KING_COMPLETE_DATA.backup.${Date.now()}.json`);
fs.writeFileSync(backupPath, JSON.stringify(currentData, null, 2));
console.log(`\n📦 Backup created`);

// Update data
const newData = {
  meta: {
    updated: new Date().toISOString(),
    totalProperties: syncedProperties.length
  },
  properties: syncedProperties
};

// Save updated data
fs.writeFileSync(jsonPath, JSON.stringify(newData, null, 2));

console.log(`\n✅ SUCCESS!`);
console.log(`   Synced ${syncedProperties.length} properties from CSV`);
console.log(`   File saved: ${jsonPath}`);

console.log(`\n=== First 10 in order ===`);
syncedProperties.slice(0, 10).forEach((prop, i) => {
  console.log(`${(i + 1).toString().padStart(3)}. ${prop.id.padEnd(15)} | ${prop.address}`);
});
