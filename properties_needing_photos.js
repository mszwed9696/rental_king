const data = require('./RENTAL_KING_COMPLETE_DATA.json');

const needingPhotos = data.properties.filter(p => (!p.photoUrl || p.photoUrl === '') && p.photo_folder_id);

console.log('=== Properties with Folder IDs but no Photos ===\n');

// Group by folder ID
const byFolder = {};
needingPhotos.forEach(p => {
  if (!byFolder[p.photo_folder_id]) {
    byFolder[p.photo_folder_id] = [];
  }
  byFolder[p.photo_folder_id].push(p);
});

console.log(`Total unique folders: ${Object.keys(byFolder).length}`);
console.log(`Total properties to update: ${needingPhotos.length}\n`);

Object.keys(byFolder).forEach((folderId, index) => {
  const props = byFolder[folderId];
  console.log(`\n${index + 1}. Folder: ${folderId}`);
  console.log(`   URL: https://drive.google.com/drive/folders/${folderId}`);
  console.log(`   Properties (${props.length}):`);
  props.forEach(p => {
    console.log(`     - ${p.id.padEnd(15)} | ${p.address}`);
  });
});

module.exports = { byFolder };
