const fs = require('fs');
const path = require('path');

// Read CSV file
const csvFile = fs.readFileSync('property_data_new.csv', 'utf-8');
const lines = csvFile.split('\n').filter(line => line.trim());

// Parse header
const headers = lines[0].split(',');
console.log('Headers:', headers);

// Parse data
const properties = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;

  // Parse CSV line (handle commas in quotes)
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

  // Extract coordinates
  const coordString = values[15] || ''; // lat column
  let lat = null, lng = null;

  if (coordString && coordString.includes(',')) {
    const coords = coordString.split(',').map(c => c.trim());
    lat = parseFloat(coords[0]) || null;
    lng = parseFloat(coords[1]) || null;
  }

  // Extract photo URL from folder ID
  const folderId = values[10] || ''; // photo_folder_id column
  let photoUrl = '/logo.svg'; // default

  if (folderId && folderId.length > 10) {
    // Use Google Drive direct link format that works
    photoUrl = `https://lh3.googleusercontent.com/d/${folderId}=w800-h600-c`;
  }

  // Parse rent (handle "RENTED" text)
  const rentValue = values[7] || '';
  const rent = rentValue.toUpperCase() === 'RENTED' ? 0 : parseInt(rentValue) || 0;

  // Parse status
  const statusValue = values[9] || 'available';
  let status = statusValue.toLowerCase();

  // If rent is "RENTED" or status contains construction/coming, adjust status
  if (rentValue.toUpperCase() === 'RENTED') {
    status = 'rented';
  } else if (statusValue.includes('Construction') || statusValue.includes('Coming')) {
    status = 'available'; // or keep as construction status
  }

  const property = {
    id: values[0] || `prop_${i}`,
    title: values[1] || values[2] || 'Untitled Property',
    address: values[2] || '',
    city: values[3] || '',
    email: values[4] || 'rentalkinginfo@gmail.com',
    type: 'Residential',
    beds: parseInt(values[5]) || 0,
    baths: parseFloat(values[6]) || 0,
    rent: rent,
    sqft: values[8] || '',
    status: status,
    photo_folder_id: folderId,
    photo_urls: values[11] || '',
    map_link: values[12] || '',
    parking: parseInt(values[13]) || 0,
    leaseStart: values[14] || '',
    lat: lat,
    lng: lng,
    primaryPhoto: values[17] || '',
    photoUrl: photoUrl,
    photoUrlBackup: folderId ? `https://drive.google.com/file/d/${folderId}/preview` : ''
  };

  properties.push(property);
}

// Create output JSON
const output = {
  meta: {
    updated: new Date().toISOString(),
    totalProperties: properties.length
  },
  properties: properties
};

// Write to file
fs.writeFileSync('RENTAL_KING_COMPLETE_DATA.json', JSON.stringify(output, null, 2));

console.log(`\n✅ Conversion complete!`);
console.log(`Total properties: ${properties.length}`);
console.log(`Output written to: RENTAL_KING_COMPLETE_DATA.json`);

// Show sample of first 3 properties
console.log('\nFirst 3 properties:');
properties.slice(0, 3).forEach(prop => {
  console.log(`- ${prop.id}: ${prop.title} (${prop.status}) - Beds: ${prop.beds}, Rent: $${prop.rent}`);
});
