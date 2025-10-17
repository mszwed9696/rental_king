const fs = require('fs');
const path = require('path');

// Read the current properties file
const propertiesPath = path.join(__dirname, '../lib/properties.ts');
let content = fs.readFileSync(propertiesPath, 'utf8');

// Coordinate mappings from the sheet (column P)
const coordinates = {
  '1 SILVER AVE': { lat: 39.71320980085679, lng: -75.11282100504599 },
  '127 STATE ST': { lat: 39.70617658201468, lng: -75.11073138997521 },
  '101 E. NEW ST': { lat: 39.70549142816666, lng: -75.10941132883558 },
  '38 CARPENTER ST': { lat: 39.709692897422386, lng: -75.112355003474 },
  '42 CARPENTER ST': { lat: 39.70976639723768, lng: -75.11254108998077 },
  '46 CARPENTER ST': { lat: 39.70995209677113, lng: -75.11270546114521 },
  '4 SILVER AVE': { lat: 39.712881529057015, lng: -75.11288455179611 },
  '34 CARPENTER ST': { lat: 39.70980153043538, lng: -75.11216658813169 },
  '18 WEST ST': { lat: 39.70650555142686, lng: -75.10908290347416 },
  'MIDWAY RD': { lat: 39.71300374809268, lng: -75.1140472094673 },
  '202 CARPENTER ST': { lat: 39.711414726605724, lng: -75.11436270761872 },
  '5 SILVER AVE': { lat: 39.71322042804305, lng: -75.11318370761809 },
  '18 N. ACADEMY ST': { lat: 39.70311815953188, lng: -75.10948458813195 },
  '601 MORRIS AVE': { lat: 39.71606214724719, lng: -75.12007532295955 },
  '7 NORMAL BLVD': { lat: 39.71213998461592, lng: -75.11296150347391 },
  '311 W. NEW ST': { lat: 39.70600695858469, lng: -75.11533710347422 },
  '313 HAMILTON RD': { lat: 39.7103992562669, lng: -75.12713653230955 },
  '309 W. NEW ST': { lat: 39.70590122638974, lng: -75.11521120347419 },
  '109 STATE ST': { lat: 39.70582158428603, lng: -75.11001504580308 },
  '410 W. HIGH ST': { lat: 39.70458459840135, lng: -75.11796861511836 },
  '306 HAMILTON RD': { lat: 39.70995901515973, lng: -75.12665231881635 },
  '110 STATE ST': { lat: 39.7059569424904, lng: -75.10973676114531 },
  '121 STATE ST': { lat: 39.70587233663452, lng: -75.110337145803 },
  '614 HESTON RD': { lat: 39.71682818806452, lng: -75.11897500351702 },
  '146 E. HIGH ST': { lat: 39.70142741723215, lng: -75.10697368568336 },
  '4 WEST ST': { lat: 39.70637506857178, lng: -75.10955592126527 },
  '122 STATE ST': { lat: 39.705951586052, lng: -75.10997743583958 },
  '11 SILVER AVE': { lat: 39.71274383775884, lng: -75.1137693501006 },
  '50 CARPENTER ST': { lat: 39.70990119569285, lng: -75.11291440347397 },
  '16 WEST ST': { lat: 39.706388322566326, lng: -75.10927892126526 },
  '9 E. NEW ST': { lat: 39.70530401249152, lng: -75.11024205179864 },
  '110 N MAIN ST': { lat: 39.70557089985379, lng: -75.11108151872592 },
  '113 STATE ST': { lat: 39.70555296051901, lng: -75.11023340025737 },
  '113 SILVER AVE': { lat: 39.71189615825218, lng: -75.11493348568278 },
  '503 N MAIN ST': { lat: 39.71342823734934, lng: -75.11286898568267 },
  '42 MONROE ST ': { lat: 39.7532454240058, lng: -75.35848598568076 },
  '7 SPANISH OAK CT': { lat: 39.73908302255073, lng: -75.06141120343864 },
  '107 E NEW ST APT A': { lat: 39.70540963981879, lng: -75.10892496789202 },
  '107 E NEW ST APT B': { lat: 39.70540963981879, lng: -75.10892496789202 },
  '109 E NEW ST APT A': { lat: 39.70535223290074, lng: -75.10866995983035 },
  '109 E NEW ST APT B': { lat: 39.70535223290074, lng: -75.10866995983035 }
};

// Update each property's coordinates
Object.entries(coordinates).forEach(([address, coords]) => {
  const addressEscaped = address.replace(/\./g, '\\.').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\s/g, '\\s*');

  // Find and replace lat
  const latRegex = new RegExp(`(address: '${addressEscaped}',\\s*[\\s\\S]*?)lat: null,`, 'm');
  content = content.replace(latRegex, `$1lat: ${coords.lat},`);

  // Find and replace lng
  const lngRegex = new RegExp(`(address: '${addressEscaped}',\\s*[\\s\\S]*?)lng: null,`, 'm');
  content = content.replace(lngRegex, `$1lng: ${coords.lng},`);
});

// Write back
fs.writeFileSync(propertiesPath, content);
console.log('✓ Updated all property coordinates from Google Sheet column P');
