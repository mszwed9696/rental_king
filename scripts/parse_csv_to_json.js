const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, '..', 'property_data.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Parse CSV
function parseCSV(text) {
  const rows = [];
  let row = [], cur = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (inQ) {
      if (c === '"' && n === '"') { cur += '"'; i++; }
      else if (c === '"') { inQ = false; }
      else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ',') { row.push(cur); cur = ''; }
      else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
      else if (c !== '\r') { cur += c; }
    }
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

const rows = parseCSV(csvContent);
const headers = rows[0];

console.log('Headers:', headers);
console.log('Total rows:', rows.length - 1);

// Parse properties
const properties = [];

for (let i = 1; i < rows.length; i++) {
  const row = rows[i];

  // Skip empty rows
  if (!row[0] && !row[2]) continue;

  const id = row[0] || '';
  const title = row[1] || row[2] || id;
  const address = row[2] || '';
  const city = row[3] || '';
  const email = row[4] || 'rentalkinginfo@gmail.com'; // Column E (index 4)
  const beds = parseFloat(row[5]) || 0;
  const baths = parseFloat(row[6]) || 0;
  const rentRaw = row[7] || '';
  const rent = rentRaw.toUpperCase() === 'RENTED' ? 0 : (parseFloat(rentRaw) || 0);
  const sqft = row[8] || '';
  const status = (row[9] || '').toLowerCase().includes('rented') ? 'rented' : 'available';
  const photo_folder_id = row[10] || '';
  const photo_urls = row[11] || '';
  const map_link = row[12] || '';
  const parking = parseFloat(row[13]) || 0;
  const lease_start = row[14] || '';

  // Parse lat/lng from column 16 (index 15)
  // Format is like: "39.71316647164147, -75.11282905179587"
  const latLngRaw = row[15] || '';
  let lat = null;
  let lng = null;

  if (latLngRaw) {
    const parts = latLngRaw.split(',').map(s => s.trim());
    if (parts.length === 2) {
      lat = parseFloat(parts[0]);
      lng = parseFloat(parts[1]);

      // Validate coordinates
      if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
        lat = null;
        lng = null;
      }
    }
  }

  // Determine property type from city column
  let type = '';
  if (city.includes('New Construction')) {
    type = 'New Construction';
  } else if (city.includes('Commercial') || row[7] === '' && beds === 0) {
    type = 'Commercial';
  } else if (city.includes('CUL-DE-SAC') || city.includes('LOGAN TWP')) {
    type = 'Townhome';
  }

  properties.push({
    id,
    title,
    address,
    city: city.includes('New Construction') ? '' : city,
    email,
    type,
    beds,
    baths,
    rent,
    sqft,
    status,
    photo_folder_id,
    photo_urls,
    map_link,
    parking,
    leaseStart: lease_start,
    lat,
    lng
  });
}

// Sort by rent (highest first), then by address
properties.sort((a, b) => {
  if (b.rent !== a.rent) return b.rent - a.rent;
  return a.address.localeCompare(b.address);
});

const output = {
  properties,
  meta: {
    total: properties.length,
    available: properties.filter(p => p.status === 'available').length,
    rented: properties.filter(p => p.status === 'rented').length,
    updated: new Date().toISOString()
  }
};

// Write to JSON file
const outputPath = path.join(__dirname, '..', 'RENTAL_KING_COMPLETE_DATA.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log('\n✅ Successfully parsed CSV and created JSON file');
console.log(`📊 Total properties: ${output.meta.total}`);
console.log(`🟢 Available: ${output.meta.available}`);
console.log(`🔴 Rented: ${output.meta.rented}`);
console.log(`📍 Properties with coordinates: ${properties.filter(p => p.lat && p.lng).length}`);
console.log(`📧 Properties with custom emails: ${properties.filter(p => p.email !== 'rentalkinginfo@gmail.com').length}`);
