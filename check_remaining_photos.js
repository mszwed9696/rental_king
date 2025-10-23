const data = require('./RENTAL_KING_COMPLETE_DATA.json');

console.log('Properties WITH folder IDs that STILL need photos:\n');
const needPhotos = [];

data.properties.forEach(prop => {
  if (prop.photo_folder_id && prop.status === 'available') {
    const hasRealPhoto = prop.photoUrl && prop.photoUrl.includes('lh3.googleusercontent.com');
    if (hasRealPhoto === false) {
      needPhotos.push({
        id: prop.id,
        address: prop.address,
        folderId: prop.photo_folder_id
      });
      console.log(prop.id.padEnd(15) + ' | ' + prop.address.padEnd(30) + ' | ' + prop.photo_folder_id);
    }
  }
});

console.log('\n\nTotal properties with folder IDs needing photos: ' + needPhotos.length);

console.log('\n\n=== Properties WITHOUT folder IDs (need to extract from Google Sheet): ===\n');
const noFolderId = [];

data.properties.forEach(prop => {
  if (prop.status === 'available' && (prop.photo_folder_id === '' || prop.photo_folder_id === null || prop.photo_folder_id === undefined)) {
    const hasRealPhoto = prop.photoUrl && prop.photoUrl.includes('lh3.googleusercontent.com');
    if (hasRealPhoto === false) {
      noFolderId.push({
        id: prop.id,
        address: prop.address
      });
      console.log(prop.id.padEnd(15) + ' | ' + prop.address);
    }
  }
});

console.log('\nTotal properties WITHOUT folder IDs: ' + noFolderId.length);
