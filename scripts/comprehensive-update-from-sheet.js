const fs = require('fs');
const path = require('path');

// Parse CSV data from the Google Sheet
const csvContent = fs.readFileSync('/tmp/rental_king_sheet.csv', 'utf8');
const lines = csvContent.split('\n');
const headers = lines[0].split(',');

// Parse CSV into objects
const sheetData = {};
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;

  // Parse CSV line (handle quoted fields with commas)
  const values = [];
  let currentValue = '';
  let insideQuotes = false;

  for (let char of lines[i]) {
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      values.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  values.push(currentValue);

  const address = values[2]; // Column C - address

  // Parse coordinates from column P (format: "lat, lng")
  const coordString = values[16] || '';
  let lat = null;
  let lng = null;
  if (coordString && coordString.includes(',')) {
    const coords = coordString.split(',').map(c => c.trim());
    lat = parseFloat(coords[0]) || null;
    lng = parseFloat(coords[1]) || null;
  }

  sheetData[address] = {
    id: values[0],
    beds: parseInt(values[5]) || 0,
    baths: parseFloat(values[6]) || 0,
    rent: values[7] === 'RENTED' ? 0 : (parseInt(values[7]) || 0),
    status: values[9] === 'rented' ? 'rented' : 'available',
    parking: parseInt(values[13]) || 0,
    leaseStart: values[14] || '',
    lat: lat,
    lng: lng,
    city: values[3] || '',
    type: values[4] || ''
  };
}

console.log(`Parsed ${Object.keys(sheetData).length} properties from sheet`);

// Read the current properties.ts file
const propertiesPath = path.join(__dirname, '../lib/properties.ts');
let content = fs.readFileSync(propertiesPath, 'utf8');

// Extract the properties array
const propertiesMatch = content.match(/export const properties: Property\[\] = \[([\s\S]*)\];/);
if (!propertiesMatch) {
  console.error('Could not find properties array');
  process.exit(1);
}

// Parse existing properties to get structure
const propertiesCode = 'const properties = [' + propertiesMatch[1] + ']; properties;';
let properties;
try {
  properties = eval(propertiesCode);
} catch (e) {
  console.error('Error parsing properties:', e);
  process.exit(1);
}

console.log(`Found ${properties.length} properties in properties.ts`);

// Update each property with sheet data
const updatedProperties = properties.map(prop => {
  const sheetProp = sheetData[prop.address];

  if (sheetProp) {
    return {
      ...prop,
      beds: sheetProp.beds,
      baths: sheetProp.baths,
      rent: sheetProp.rent,
      status: sheetProp.status,
      parking: sheetProp.parking,
      leaseStart: sheetProp.leaseStart,
      lat: sheetProp.lat !== null ? sheetProp.lat : prop.lat,
      lng: sheetProp.lng !== null ? sheetProp.lng : prop.lng,
      type: sheetProp.type || prop.type,
      city: prop.city // Keep existing city format
    };
  }

  return prop;
});

// Generate new properties.ts content
const propertiesString = updatedProperties.map(prop => {
  return `  {
    id: '${prop.id}',
    title: '${prop.title}',
    address: '${prop.address}',
    city: '${prop.city}',
    type: '${prop.type || ''}',
    beds: ${prop.beds},
    baths: ${prop.baths},
    rent: ${prop.rent},${prop.sqft ? `\n    sqft: ${prop.sqft},` : ''}
    status: '${prop.status}',
    photo_folder_id: '${prop.photo_folder_id}',${prop.photoUrl ? `\n    photoUrl: '${prop.photoUrl}',` : ''}
    lat: ${prop.lat},
    lng: ${prop.lng},
    parking: ${prop.parking},
    leaseStart: '${prop.leaseStart}'
  }`;
}).join(',\n');

const newContent = `export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  type: string;
  beds: number;
  baths: number;
  rent: number;
  sqft?: number;
  status: 'available' | 'rented';
  photo_folder_id?: string;
  photoUrl?: string;
  lat?: number | null;
  lng?: number | null;
  parking?: number;
  leaseStart?: string;
}

// Property data from Google Sheets
export const properties: Property[] = [
${propertiesString}
];
`;

// Write the updated file
fs.writeFileSync(propertiesPath, newContent);
console.log('✓ Updated properties.ts with complete data from Google Sheet');
console.log('  - Updated rent prices');
console.log('  - Updated status (available/rented)');
console.log('  - Updated beds, baths, parking');
console.log('  - Updated lease start dates');
console.log('  - Updated map coordinates from column P');
