const oldData = require('./RENTAL_KING_COMPLETE_DATA.backup.1761270003234.json');
const newData = require('./RENTAL_KING_COMPLETE_DATA.json');

console.log('Old:', oldData.properties.length);
console.log('New:', newData.properties.length);

const oldIds = new Set(oldData.properties.map(p => p.id));
const newIds = new Set(newData.properties.map(p => p.id));

console.log('\n=== Properties REMOVED from JSON ===\n');
const removed = [];
oldData.properties.forEach(p => {
  if (!newIds.has(p.id)) {
    removed.push(p);
    console.log(`  ${p.id.padEnd(15)} | ${p.address.padEnd(35)} | Status: ${p.status}`);
  }
});

console.log(`\nTotal removed: ${removed.length}`);

console.log('\n=== Properties ADDED to JSON ===\n');
const added = [];
newData.properties.forEach(p => {
  if (!oldIds.has(p.id)) {
    added.push(p);
    console.log(`  ${p.id.padEnd(15)} | ${p.address.padEnd(35)} | Status: ${p.status}`);
  }
});

console.log(`\nTotal added: ${added.length}`);
