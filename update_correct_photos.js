const fs = require('fs');
const path = require('path');

// Properties with correct photo file IDs
const correctPhotos = {
  'Insana1': {
    address: '127 STATE ST',
    correctFileId: '1hWwdViw340dTg61LfHOFbflttapQz7ob'
  },
  'Insana2': {
    address: '110 N MAIN ST',
    correctFileId: '1MORYDKCa7kFsFruX37z5_AycufVwUkLM'
  },
  'Insana3': {
    address: '113 SILVER AVE',
    correctFileId: '1lvxy3ZNio1nv-E9Lgk0fcokr6ZxWReRn'
  },
  'Coconut1': {
    address: '18 WEST ST',
    correctFileId: '1BAe0zIGZ2u8zTJDDw95RfXTPoBVTGF_H'
  },
  'Insana4': {
    address: '113 STATE ST',
    correctFileId: '1wRm9ANv5E3DRGr6ujr_WXOrCZNnua5mq'
  },
  'Allen1': {
    address: '5 WILSON',
    correctFileId: '1QjHssc97xMiummyyu40xizDmML0VpNVQ'
  }
};

console.log('=== Updating Photos for 6 Properties ===\n');

// Read current JSON data
const jsonPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`Total properties: ${data.properties.length}\n`);

// Create backup
const backupPath = path.join(__dirname, `RENTAL_KING_COMPLETE_DATA.backup.${Date.now()}.json`);
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
console.log(`📦 Backup created: ${path.basename(backupPath)}\n`);

let updatedCount = 0;

// Update each property
Object.keys(correctPhotos).forEach(id => {
  const prop = data.properties.find(p => p.id === id);

  if (prop) {
    const oldFileId = prop.photoUrl.match(/\/d\/([^=]+)/)?.[1];
    const newFileId = correctPhotos[id].correctFileId;
    const newPhotoUrl = `https://lh3.googleusercontent.com/d/${newFileId}=w800-h600-c`;

    console.log(`${id} (${correctPhotos[id].address})`);
    console.log(`  Old: ${oldFileId}`);
    console.log(`  New: ${newFileId}`);
    console.log(`  ✓ Updated\n`);

    prop.photoUrl = newPhotoUrl;
    updatedCount++;
  } else {
    console.log(`❌ Property ${id} not found!\n`);
  }
});

// Update metadata
data.meta.updated = new Date().toISOString();

// Save updated data
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log(`\n✅ SUCCESS!`);
console.log(`   Updated ${updatedCount} properties with correct photos`);
console.log(`   File saved: ${jsonPath}`);
