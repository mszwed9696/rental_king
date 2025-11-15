const fs = require('fs');
const path = require('path');

console.log('=== Comprehensive CSV to JSON Sync ===\n');

// CSV parser function
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Read CSV
const csvPath = path.join(process.env.HOME, '.playwright-mcp', 'Rental-King-Properties-latest.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');
const csvLines = csvContent.split('\n').filter(line => line.trim());

// Parse header
const headers = parseCSVLine(csvLines[0]);
console.log('CSV Headers:', headers);
console.log(`\nTotal CSV rows (including header): ${csvLines.length}`);
console.log(`Total properties in CSV: ${csvLines.length - 1}\n`);

// Parse all properties from CSV
const csvProperties = [];
for (let i = 1; i < csvLines.length; i++) {
  const values = parseCSVLine(csvLines[i]);
  const property = {};

  headers.forEach((header, index) => {
    property[header] = values[index] || '';
  });

  csvProperties.push(property);
}

// Read current JSON
const jsonPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`Total properties in JSON: ${data.properties.length}\n`);

// Create backup
const backupPath = path.join(__dirname, `RENTAL_KING_COMPLETE_DATA.backup.${Date.now()}.json`);
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
console.log(`📦 Backup created: ${path.basename(backupPath)}\n`);

// Track changes
const changes = {
  updated: 0,
  photoFolderChanged: [],
  coordsUpdated: [],
  statusChanged: [],
  rentChanged: [],
  bedsChanged: [],
  bathsChanged: [],
  emailChanged: []
};

// Create a map of JSON properties by ID
const jsonMap = new Map();
data.properties.forEach(prop => {
  jsonMap.set(prop.id, prop);
});

// Sync each CSV property to JSON
csvProperties.forEach((csvProp) => {
  const jsonProp = jsonMap.get(csvProp.id);

  if (!jsonProp) {
    console.log(`⚠️  Property ${csvProp.id} exists in CSV but not in JSON`);
    return;
  }

  let hasChanges = false;

  // Update basic fields
  if (csvProp.title && csvProp.title !== jsonProp.title) {
    jsonProp.title = csvProp.title;
    hasChanges = true;
  }

  if (csvProp.address && csvProp.address !== jsonProp.address) {
    jsonProp.address = csvProp.address;
    hasChanges = true;
  }

  if (csvProp.city && csvProp.city !== jsonProp.city) {
    jsonProp.city = csvProp.city;
    hasChanges = true;
  }

  if (csvProp.type && csvProp.type !== jsonProp.email && csvProp.type.includes('@')) {
    jsonProp.email = csvProp.type;
    changes.emailChanged.push(csvProp.id);
    hasChanges = true;
  }

  // Update beds/baths
  const csvBeds = parseInt(csvProp.beds) || 0;
  const csvBaths = parseFloat(csvProp.baths) || 0;

  if (csvBeds !== jsonProp.beds) {
    jsonProp.beds = csvBeds;
    changes.bedsChanged.push(`${csvProp.id}: ${jsonProp.beds} → ${csvBeds}`);
    hasChanges = true;
  }

  if (csvBaths !== jsonProp.baths) {
    jsonProp.baths = csvBaths;
    changes.bathsChanged.push(`${csvProp.id}: ${jsonProp.baths} → ${csvBaths}`);
    hasChanges = true;
  }

  // Update rent (handle "RENTED" text)
  let csvRent = 0;
  if (csvProp.rent && csvProp.rent.toUpperCase() === 'RENTED') {
    csvRent = 0;
  } else {
    csvRent = parseInt(csvProp.rent) || 0;
  }

  if (csvRent !== jsonProp.rent) {
    changes.rentChanged.push(`${csvProp.id}: $${jsonProp.rent} → $${csvRent}`);
    jsonProp.rent = csvRent;
    hasChanges = true;
  }

  // Update status
  if (csvProp.status && csvProp.status !== jsonProp.status) {
    changes.statusChanged.push(`${csvProp.id}: ${jsonProp.status} → ${csvProp.status}`);
    jsonProp.status = csvProp.status;
    hasChanges = true;
  }

  // Update photo_folder_id (CRITICAL for fixing wrong photos)
  if (csvProp.photo_folder_id && csvProp.photo_folder_id !== jsonProp.photo_folder_id) {
    changes.photoFolderChanged.push({
      id: csvProp.id,
      address: csvProp.address,
      oldFolder: jsonProp.photo_folder_id,
      newFolder: csvProp.photo_folder_id
    });
    jsonProp.photo_folder_id = csvProp.photo_folder_id;
    hasChanges = true;
  }

  // Update parking
  const csvParking = parseInt(csvProp.parking) || 0;
  if (csvParking !== jsonProp.parking) {
    jsonProp.parking = csvParking;
    hasChanges = true;
  }

  // Update lease start
  if (csvProp.lease_start && csvProp.lease_start !== jsonProp.leaseStart) {
    jsonProp.leaseStart = csvProp.lease_start;
    hasChanges = true;
  }

  // Update coordinates (parse from quoted format)
  if (csvProp.lat) {
    let latLng = csvProp.lat.replace(/"/g, '').split(',').map(v => v.trim());
    if (latLng.length === 2) {
      const newLat = parseFloat(latLng[0]);
      const newLng = parseFloat(latLng[1]);

      if (newLat && newLng && (newLat !== jsonProp.lat || newLng !== jsonProp.lng)) {
        changes.coordsUpdated.push(csvProp.id);
        jsonProp.lat = newLat;
        jsonProp.lng = newLng;
        hasChanges = true;
      }
    }
  }

  if (hasChanges) {
    changes.updated++;
  }
});

// Print summary
console.log('=== Sync Summary ===\n');
console.log(`Total properties updated: ${changes.updated}`);
console.log(`\nPhoto folder changes: ${changes.photoFolderChanged.length}`);
changes.photoFolderChanged.forEach(change => {
  console.log(`  ${change.id.padEnd(15)} | ${change.address.padEnd(35)}`);
  console.log(`    Old: ${change.oldFolder}`);
  console.log(`    New: ${change.newFolder}`);
});

console.log(`\nStatus changes: ${changes.statusChanged.length}`);
changes.statusChanged.forEach(change => console.log(`  ${change}`));

console.log(`\nRent changes: ${changes.rentChanged.length}`);
changes.rentChanged.forEach(change => console.log(`  ${change}`));

console.log(`\nBeds changes: ${changes.bedsChanged.length}`);
changes.bedsChanged.slice(0, 10).forEach(change => console.log(`  ${change}`));

console.log(`\nBaths changes: ${changes.bathsChanged.length}`);
changes.bathsChanged.slice(0, 10).forEach(change => console.log(`  ${change}`));

console.log(`\nCoordinates updated: ${changes.coordsUpdated.length}`);

// Properties that need photos extracted
console.log(`\n=== Properties That Need Photo Extraction ===`);
const needPhotos = changes.photoFolderChanged;
console.log(`Total: ${needPhotos.length}`);
needPhotos.forEach(prop => {
  console.log(`  ${prop.id} (${prop.address}): Folder ${prop.newFolder}`);
});

// Update metadata
data.meta.updated = new Date().toISOString();

// Save
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log(`\n✅ SUCCESS!`);
console.log(`   Updated ${changes.updated} properties`);
console.log(`   File saved: ${jsonPath}`);

// Output folder IDs that need photo extraction
if (needPhotos.length > 0) {
  console.log(`\n📸 Next step: Extract photos from these folders:`);
  const uniqueFolders = [...new Set(needPhotos.map(p => p.newFolder))];
  uniqueFolders.forEach(folder => {
    const props = needPhotos.filter(p => p.newFolder === folder);
    console.log(`\nFolder: ${folder}`);
    props.forEach(p => console.log(`  - ${p.id}: ${p.address}`));
  });
}
