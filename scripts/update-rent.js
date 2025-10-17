const fs = require('fs');
const path = require('path');

// Read both JSON files
const dataPath = path.join(__dirname, '..', 'RENTAL_KING_COMPLETE_DATA.json');
const rentPath = path.join(__dirname, '..', 'property_rent_mapping.json');

const completeData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const rentMapping = JSON.parse(fs.readFileSync(rentPath, 'utf8'));

// Update rent for each property
let updated = 0;
completeData.properties.forEach(property => {
  const rentData = rentMapping[property.id];
  if (rentData && rentData.rent !== undefined) {
    if (property.rent !== rentData.rent) {
      console.log(`Updating ${property.id}: $${property.rent} → $${rentData.rent}`);
      property.rent = rentData.rent;
      updated++;
    }
  }
});

// Save updated data
fs.writeFileSync(dataPath, JSON.stringify(completeData, null, 2));
console.log(`\n✓ Updated ${updated} properties with correct rent amounts`);
console.log(`✓ Saved to ${dataPath}`);
