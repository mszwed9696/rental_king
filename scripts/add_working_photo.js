const fs = require('fs');
const path = require('path');

// Working photo ID we extracted from Google Drive
const photoMapping = {
  "P028": "1hWwdViw340dTg61LfHOFbflttapQz7ob"  // 127 STATE ST
};

const jsonPath = path.join(__dirname, '..', 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('Adding working photo URLs...\n');

data.properties.forEach(property => {
  if (photoMapping[property.id]) {
    const fileId = photoMapping[property.id];
    // Use the working lh3.googleusercontent.com format with the file ID
    property.photoUrl = `https://lh3.googleusercontent.com/d/${fileId}=w800-h600-c`;
    console.log(`✓ ${property.id}: ${property.address} - Photo added!`);
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
console.log('\n✅ Photo URL added successfully!');
