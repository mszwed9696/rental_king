const fs = require('fs');
const path = require('path');

// Parse CSV data from the Google Sheet
const csvContent = fs.readFileSync('/tmp/rental_king_sheet.csv', 'utf8');
const lines = csvContent.split('\n');

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
    title: values[1],
    beds: parseInt(values[5]) || 0,
    baths: parseFloat(values[6]) || 0,
    rent: values[7] === 'RENTED' ? 0 : (parseInt(values[7]) || 0),
    status: values[9] === 'rented' ? 'rented' : 'available',
    parking: parseInt(values[13]) || 0,
    leaseStart: values[14] || '',
    lat: lat,
    lng: lng,
    city: values[3] || '',
    type: values[4] || '',
    photo_folder_id: values[10] || ''
  };
}

console.log(`Parsed ${Object.keys(sheetData).length} properties from sheet`);

// Read the JSON file which has all properties
const jsonPath = path.join(__dirname, '../RENTAL_KING_COMPLETE_DATA.json');
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`Found ${jsonData.properties.length} properties in JSON`);

// Create comprehensive property list from sheet data
const allProperties = Object.entries(sheetData).map(([address, data]) => {
  // Find matching property in JSON for photo URLs
  const jsonProp = jsonData.properties.find(p => p.address === address);

  return {
    id: data.id,
    title: data.title,
    address: address,
    city: data.city || 'Glassboro, NJ',
    type: data.type || '',
    beds: data.beds,
    baths: data.baths,
    rent: data.rent,
    status: data.status,
    photo_folder_id: data.photo_folder_id,
    photoUrl: jsonProp?.photoUrl || undefined,
    lat: data.lat,
    lng: data.lng,
    parking: data.parking,
    leaseStart: data.leaseStart
  };
});

console.log(`Created ${allProperties.length} properties`);

// Generate new properties.ts content
const propertiesString = allProperties.map(prop => {
  const parts = [`    id: '${prop.id}'`,
    `title: '${prop.title}'`,
    `address: '${prop.address}'`,
    `city: '${prop.city}'`,
    `type: '${prop.type}'`,
    `beds: ${prop.beds}`,
    `baths: ${prop.baths}`,
    `rent: ${prop.rent}`,
    `status: '${prop.status}'`,
    `photo_folder_id: '${prop.photo_folder_id}'`
  ];

  if (prop.photoUrl) {
    parts.push(`photoUrl: '${prop.photoUrl}'`);
  }

  parts.push(`lat: ${prop.lat}`);
  parts.push(`lng: ${prop.lng}`);
  parts.push(`parking: ${prop.parking}`);
  parts.push(`leaseStart: '${prop.leaseStart}'`);

  return `  {\n${parts.join(',\n    ')}\n  }`;
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
const propertiesPath = path.join(__dirname, '../lib/properties.ts');
fs.writeFileSync(propertiesPath, newContent);
console.log('✓ Rebuilt properties.ts with ALL properties from Google Sheet');
console.log('  - Total properties:', allProperties.length);
console.log('  - Updated rent prices, status, beds, baths, parking, lease start dates, coordinates');
