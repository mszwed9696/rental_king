/**
 * SAFE Property Data Updater
 *
 * This script updates property information from the Google Sheet CSV
 * while PRESERVING the working photo URLs (photoUrl and photoUrlBackup).
 *
 * Updates these fields:
 * - rent, status, beds, baths, parking
 * - leaseStart, address, city, email
 * - lat/lng coordinates
 *
 * PRESERVES these fields (never overwrites):
 * - photoUrl, photoUrlBackup
 * - Any working photo file IDs
 */

const fs = require('fs');
const path = require('path');

// File paths
const csvPath = './property_data_new.csv';
const jsonPath = './RENTAL_KING_COMPLETE_DATA.json';

// Load existing property data with working photos
const existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Create a map of existing properties by ID for quick lookup
const existingPropsMap = {};
existingData.properties.forEach(prop => {
  existingPropsMap[prop.id] = prop;
});

console.log('=== SAFE Property Data Updater ===\n');
console.log(`Loaded ${existingData.properties.length} existing properties with working photos\n`);

// Read CSV file
const csvFile = fs.readFileSync(csvPath, 'utf-8');
const lines = csvFile.split('\n').filter(line => line.trim());

// Parse CSV
function parseCSVLine(line) {
  const values = [];
  let currentValue = '';
  let inQuotes = false;

  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  values.push(currentValue.trim());
  return values;
}

// Parse CSV and update properties
let updatedCount = 0;
let preservedPhotos = 0;
let skippedCount = 0;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;

  const values = parseCSVLine(line);
  const id = values[0];

  // Check if this property exists in our data
  if (!existingPropsMap[id]) {
    console.log(`⚠️  Skipped ${id} - Not found in existing data`);
    skippedCount++;
    continue;
  }

  const existingProp = existingPropsMap[id];

  // Extract coordinates
  const coordString = values[15] || '';
  let lat = existingProp.lat;
  let lng = existingProp.lng;

  if (coordString && coordString.includes(',')) {
    const coords = coordString.split(',').map(c => c.trim());
    lat = parseFloat(coords[0]) || lat;
    lng = parseFloat(coords[1]) || lng;
  }

  // Parse rent and status
  const rentValue = values[7] || '';
  const rent = rentValue.toUpperCase() === 'RENTED' ? 0 : parseInt(rentValue) || existingProp.rent;
  const statusValue = values[9] || 'available';
  const status = rentValue.toUpperCase() === 'RENTED' ? 'rented' : statusValue.toLowerCase();

  // Update ONLY safe fields, PRESERVE photos
  existingProp.address = values[2] || existingProp.address;
  existingProp.city = values[3] || existingProp.city;
  existingProp.email = values[4] || existingProp.email;
  existingProp.beds = parseInt(values[5]) || existingProp.beds;
  existingProp.baths = parseFloat(values[6]) || existingProp.baths;
  existingProp.rent = rent;
  existingProp.status = status;
  existingProp.parking = parseInt(values[13]) || existingProp.parking;
  existingProp.leaseStart = values[14] || existingProp.leaseStart;
  existingProp.lat = lat;
  existingProp.lng = lng;

  // ✅ PRESERVE PHOTOS - Do NOT touch these fields:
  // - photoUrl
  // - photoUrlBackup
  // These stay exactly as they are!

  if (existingProp.photoUrl) {
    preservedPhotos++;
  }

  updatedCount++;
}

// Update metadata
existingData.meta.updated = new Date().toISOString();
existingData.meta.lastSafeUpdate = new Date().toISOString();

// Create backup before saving
const backupPath = `./RENTAL_KING_COMPLETE_DATA.backup.${Date.now()}.json`;
fs.writeFileSync(backupPath, JSON.stringify(existingData, null, 2));
console.log(`\n📦 Backup created: ${backupPath}`);

// Save updated data
fs.writeFileSync(jsonPath, JSON.stringify(existingData, null, 2));

console.log(`\n✅ Successfully updated ${updatedCount} properties`);
console.log(`🖼️  Preserved ${preservedPhotos} working photo URLs`);
console.log(`⏭️  Skipped ${skippedCount} properties not found`);
console.log(`\n📁 File saved to: ${jsonPath}`);
console.log(`\n✨ All photo URLs preserved! Safe to deploy.`);
