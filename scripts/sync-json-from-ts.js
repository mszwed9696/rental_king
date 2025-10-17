const fs = require('fs');
const path = require('path');

// Read properties.ts and extract the data
const tsContent = fs.readFileSync(path.join(__dirname, '../lib/properties.ts'), 'utf8');

// Extract properties array from TypeScript file
const propertiesMatch = tsContent.match(/export const properties: Property\[\] = \[([\s\S]*)\];/);
if (!propertiesMatch) {
  console.error('Could not find properties array in properties.ts');
  process.exit(1);
}

// Parse the properties (simple eval approach for this specific case)
const propertiesCode = 'const properties = [' + propertiesMatch[1] + ']; properties;';
const properties = eval(propertiesCode);

console.log(`Found ${properties.length} properties in properties.ts`);

// Read the JSON file
const jsonPath = path.join(__dirname, '../RENTAL_KING_COMPLETE_DATA.json');
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`Found ${jsonData.properties.length} properties in JSON`);

// Update JSON properties with data from TypeScript
jsonData.properties = jsonData.properties.map(jsonProp => {
  const tsProp = properties.find(p => p.address === jsonProp.address);

  if (tsProp) {
    return {
      ...jsonProp,
      status: tsProp.status,
      parking: tsProp.parking,
      leaseStart: tsProp.leaseStart,
      type: tsProp.type || jsonProp.type,
      beds: tsProp.beds !== undefined ? tsProp.beds : jsonProp.beds,
      baths: tsProp.baths !== undefined ? tsProp.baths : jsonProp.baths,
      rent: tsProp.rent !== undefined ? tsProp.rent : jsonProp.rent,
    };
  }

  return jsonProp;
});

// Write back to JSON file
fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
console.log('✓ Updated RENTAL_KING_COMPLETE_DATA.json with parking, leaseStart, and status from properties.ts');
