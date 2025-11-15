const fs = require('fs');
const path = require('path');

// Properties with wrong photos that need to be fixed
const photosToFix = {
  'Insana1': {
    address: '127 STATE ST',
    folderId: '1Cg0C5qNDMWst3_KfUsGlbSwljwC5KZXo',
    correctFileId: '' // TO BE FILLED
  },
  'Insana2': {
    address: '110 N MAIN ST',
    folderId: '1nrp7feQlcvRCMVDAYAOWlEkmDBXBPOd8',
    correctFileId: '' // TO BE FILLED
  },
  'Insana3': {
    address: '113 SILVER AVE',
    folderId: '1X6BmJP9t4eMY6NRwHfe0rUahLkYOp3Yo',
    correctFileId: '' // TO BE FILLED
  },
  'Coconut1': {
    address: '18 WEST ST',
    folderId: '1JDGrHLWSE_1i1Xq6XQxXMFAixbnVlFfH',
    correctFileId: '' // TO BE FILLED
  },
  'Insana4': {
    address: '113 STATE ST',
    folderId: '18JPFKTxO3ivsnu2AP7Cw47GEMPzsRfRI',
    correctFileId: '' // TO BE FILLED
  },
  'Allen1': {
    address: '5 WILSON',
    folderId: '1YUT1EnCAeOYfh3EwBk1_cpZ6AQi1pyGc',
    correctFileId: '' // TO BE FILLED
  }
};

console.log('=== Properties Needing Photo Updates ===\n');

Object.keys(photosToFix).forEach(id => {
  const prop = photosToFix[id];
  console.log(`${id}:`);
  console.log(`  Address: ${prop.address}`);
  console.log(`  Folder URL: https://drive.google.com/drive/folders/${prop.folderId}`);
  console.log('');
});

console.log('\nPlease navigate to each folder URL and extract the header image file ID.');
console.log('Then update the correctFileId values in this script and run the update.');

module.exports = { photosToFix };
