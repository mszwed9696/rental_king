const data = require('./RENTAL_KING_COMPLETE_DATA.json');

const withCoords = data.properties.filter(p => p.lat && p.lng && p.lat !== 0 && p.lng !== 0);

console.log('Properties with valid coordinates:', withCoords.length);
console.log('Total properties:', data.properties.length);
console.log('\nSample properties with coords:');
console.log(withCoords.slice(0, 3).map(p => ({
  id: p.id,
  address: p.address,
  lat: p.lat,
  lng: p.lng
})));
