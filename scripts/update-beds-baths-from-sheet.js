const fs = require('fs');

// Data from Google Sheet columns F (beds) and G (baths)
const sheetData = {
  '1 SILVER AVE': { beds: 17, baths: 5 },
  '127 STATE ST': { beds: 7, baths: 2 },
  '101 E. NEW ST': { beds: 8, baths: 2 },
  '38 CARPENTER ST': { beds: 12, baths: 6 },
  '42 CARPENTER ST': { beds: 12, baths: 6 },
  '46 CARPENTER ST': { beds: 12, baths: 6 },
  '4 SILVER AVE': { beds: 5, baths: 3 },
  '34 CARPENTER ST': { beds: 7, baths: 2 },
  '18 WEST ST': { beds: 6, baths: 3.5 },
  'MIDWAY RD': { beds: 7, baths: 3 },
  '202 CARPENTER ST': { beds: 6, baths: 3 },
  '5 SILVER AVE': { beds: 6, baths: 2.5 },
  '18 N. ACADEMY ST': { beds: 7, baths: 2 },
  '601 MORRIS AVE': { beds: 6, baths: 3 },
  '7 NORMAL BLVD': { beds: 6, baths: 2 },
  '311 W. NEW ST': { beds: 6, baths: 2 },
  '313 HAMILTON RD': { beds: 6, baths: 2 },
  '309 W. NEW ST': { beds: 5, baths: 2.5 },
  '109 STATE ST': { beds: 6, baths: 2 },
  '410 W. HIGH ST': { beds: 5, baths: 2.5 },
  '306 HAMILTON RD': { beds: 5, baths: 2.5 },
  '110 STATE ST': { beds: 5, baths: 2 },
  '121 STATE ST': { beds: 5, baths: 2 },
  '614 HESTON RD': { beds: 5, baths: 2 },
  '146 E. HIGH ST': { beds: 6, baths: 2 },
  '4 WEST ST': { beds: 5, baths: 2 },
  '122 STATE ST': { beds: 4, baths: 2.5 },
  '11 SILVER AVE': { beds: 4, baths: 1.5 },
  '50 CARPENTER ST': { beds: 3, baths: 2 },
  '16 WEST ST': { beds: 3, baths: 1 },
  '9 E. NEW ST': { beds: 3, baths: 1 },
  '110 N MAIN ST': { beds: 7, baths: 2 },
  '113 STATE ST': { beds: 5, baths: 2.5 },
  '313 SILVER AVE': { beds: 7, baths: 3 },
  '503 N MAIN ST': { beds: 0, baths: 0.5 },
  '42 MONROE ST': { beds: 4, baths: 2.5 },
  '7 SPANISH OAK CT': { beds: 3, baths: 2.5 },
  '107 E NEW ST APT A': { beds: 3, baths: 1 },
  '107 E NEW ST APT B': { beds: 1, baths: 1 },
  '109 E NEW ST APT A': { beds: 2, baths: 1 },
  '109 E NEW ST APT B': { beds: 1, baths: 1 }
};

// Read the file
let content = fs.readFileSync('/Users/mszwed9696/rental_king/lib/properties.ts', 'utf8');

// For each property, update beds and baths
Object.entries(sheetData).forEach(([address, data]) => {
  const addressEscaped = address.replace(/\./g, '\\.').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

  // Find and replace beds
  const bedsRegex = new RegExp(`(address: '${addressEscaped}',\\s*[\\s\\S]*?)beds: \\d+,`, 'm');
  content = content.replace(bedsRegex, `$1beds: ${data.beds},`);

  // Find and replace baths
  const bathsRegex = new RegExp(`(address: '${addressEscaped}',\\s*[\\s\\S]*?)baths: [\\d.]+,`, 'm');
  content = content.replace(bathsRegex, `$1baths: ${data.baths},`);
});

// Write back
fs.writeFileSync('/Users/mszwed9696/rental_king/lib/properties.ts', content);
console.log('Updated properties with beds and baths from Google Sheet');
