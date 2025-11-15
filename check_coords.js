const data = require('./RENTAL_KING_COMPLETE_DATA.json');

const withCoords = data.properties.filter(p => p.lat && p.lng && p.lat !== 0 && p.lng !== 0);
const withoutCoords = data.properties.filter(p => !p.lat || !p.lng || p.lat === 0 || p.lng === 0);

console.log('Properties with coordinates:', withCoords.length);
console.log('Properties WITHOUT coordinates:', withoutCoords.length);
console.log('Total properties:', data.properties.length);

console.log('\n=== First 5 with coords ===');
withCoords.slice(0, 5).forEach(p => {
  console.log(`  ${p.id.padEnd(15)} (${p.address.padEnd(30)}): ${p.lat}, ${p.lng}`);
});

console.log('\n=== First 10 WITHOUT coords ===');
withoutCoords.slice(0, 10).forEach(p => {
  console.log(`  ${p.id.padEnd(15)} | ${p.address}`);
});
