const fs = require('fs');
const data = JSON.parse(fs.readFileSync('RENTAL_KING_COMPLETE_DATA.json', 'utf8'));

console.log('=== Properties Missing Parking Information ===\n');
const missingParking = data.properties.filter(p => !p.parking || p.parking === '' || p.parking === 0);
console.log('Count:', missingParking.length);
missingParking.forEach(p => {
  console.log(`${p.id.padEnd(15)} | ${p.address.padEnd(35)} | Status: ${p.status}`);
});

console.log('\n\n=== Properties Missing Photos ===\n');
const missingPhotos = data.properties.filter(p => !p.photoUrl || p.photoUrl.includes('rental-king-logo'));
console.log('Count:', missingPhotos.length);
missingPhotos.forEach(p => {
  console.log(`${p.id.padEnd(15)} | ${p.address.padEnd(35)} | Status: ${p.status}`);
});

console.log('\n\n=== Available Properties Missing Photos ===\n');
const availableMissingPhotos = data.properties.filter(p => p.status === 'available' && (!p.photoUrl || p.photoUrl.includes('rental-king-logo')));
console.log('Count:', availableMissingPhotos.length);
availableMissingPhotos.forEach(p => {
  console.log(`${p.id.padEnd(15)} | ${p.address.padEnd(35)} | Folder: ${p.photo_folder_id || 'NONE'}`);
});
