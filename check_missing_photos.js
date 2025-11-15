const data = require('./RENTAL_KING_COMPLETE_DATA.json');

const withPhotos = data.properties.filter(p => p.photoUrl && p.photoUrl !== '');
const withoutPhotos = data.properties.filter(p => !p.photoUrl || p.photoUrl === '');

console.log('Properties WITH photos:', withPhotos.length);
console.log('Properties WITHOUT photos:', withoutPhotos.length);
console.log('Total properties:', data.properties.length);

console.log('\n=== Properties WITHOUT photos (showing Drive folder IDs) ===\n');
withoutPhotos.forEach((p, index) => {
  if (p.photo_folder_id) {
    console.log(`${(index + 1).toString().padStart(3)}. ${p.id.padEnd(15)} | ${p.address.padEnd(35)} | Folder: ${p.photo_folder_id}`);
  } else {
    console.log(`${(index + 1).toString().padStart(3)}. ${p.id.padEnd(15)} | ${p.address.padEnd(35)} | NO FOLDER ID`);
  }
});

console.log('\n=== Summary by status ===');
const noPhotosAvailable = withoutPhotos.filter(p => p.status === 'available').length;
const noPhotosRented = withoutPhotos.filter(p => p.status === 'rented').length;
console.log(`Available properties without photos: ${noPhotosAvailable}`);
console.log(`Rented properties without photos: ${noPhotosRented}`);
