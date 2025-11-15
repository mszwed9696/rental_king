const data = require('./RENTAL_KING_COMPLETE_DATA.json');
const properties = data.properties;

console.log('Properties with placeholder/no photos (AVAILABLE only):');
console.log('=========================================\n');

const needsPhotos = [];

properties.forEach(prop => {
  const hasRealPhoto = prop.photoUrl &&
    prop.photoUrl.includes('lh3.googleusercontent.com') &&
    !prop.photoUrl.includes('/logo') &&
    prop.photoUrl !== '/logo.svg';

  if (!hasRealPhoto && prop.status === 'available') {
    console.log('Property ID: ' + prop.id);
    console.log('Address: ' + prop.address);
    console.log('Status: ' + prop.status);
    console.log('Current photoUrl: ' + (prop.photoUrl || 'NONE'));
    console.log('Folder ID: ' + (prop.photo_folder_id || 'NONE'));
    console.log('---');
    needsPhotos.push(prop);
  }
});

console.log('\n\nTotal properties needing photos: ' + needsPhotos.length);
console.log('\n\nFull Summary of all properties:');
console.log('=====================================\n');
properties.forEach(prop => {
  const urlType = !prop.photoUrl ? 'NO URL' :
                  prop.photoUrl.includes('lh3.googleusercontent.com') ? 'REAL PHOTO' :
                  prop.photoUrl.includes('drive.google.com/thumbnail') ? 'FOLDER THUMBNAIL' :
                  'OTHER';
  console.log(prop.id.padEnd(12) + ' | ' + prop.status.padEnd(10) + ' | ' + urlType.padEnd(18) + ' | ' + prop.address);
});
