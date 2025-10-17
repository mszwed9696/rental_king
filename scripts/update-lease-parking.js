const fs = require('fs');

const leaseDates = {
  '1 SILVER AVE': '6/1/26',
  '127 STATE ST': '6/1/26',
  '101 E. NEW ST': '6/1/26',
  '38 CARPENTER ST': '6/1/27',
  '42 CARPENTER ST': '6/1/27',
  '46 CARPENTER ST': '6/1/27',
  '4 SILVER AVE': '6/1/26',
  '34 CARPENTER ST': '7/1/26',
  '18 WEST ST': '7/1/26',
  'MIDWAY RD': '6/1/27',
  '202 CARPENTER ST': '6/1/26',
  '5 SILVER AVE': '7/1/26',
  '18 N. ACADEMY ST': '7/1/26',
  '601 MORRIS AVE': '6/1/26',
  '7 NORMAL BLVD': '6/1/26',
  '311 W. NEW ST': '6/1/26',
  '313 HAMILTON RD': '8/1/26',
  '309 W. NEW ST': '7/1/26',
  '109 STATE ST': '6/1/26',
  '410 W. HIGH ST': '6/1/26',
  '306 HAMILTON RD': '6/1/26',
  '110 STATE ST': '6/1/26',
  '121 STATE ST': '6/1/26',
  '614 HESTON RD': '6/1/26',
  '146 E. HIGH ST': '7/1/26',
  '4 WEST ST': '9/1/26',
  '122 STATE ST': '6/1/26',
  '11 SILVER AVE': '6/1/26',
  '50 CARPENTER ST': '6/1/26',
  '16 WEST ST': '6/1/26',
  '9 E. NEW ST': '6/1/26'
};

// Read the file
let content = fs.readFileSync('/Users/mszwed9696/rental_king/lib/properties.ts', 'utf8');

// For each lease date, find the property and add parking and leaseStart
Object.entries(leaseDates).forEach(([address, leaseDate]) => {
  // Find the property block
  const addressRegex = new RegExp(`address: '${address.replace(/\./g, '\\.')}',`, 'g');

  if (content.match(addressRegex)) {
    // Find beds value for this property to use as parking
    const propertyBlockRegex = new RegExp(`address: '${address.replace(/\./g, '\\.')}',[\\s\\S]*?beds: (\\d+),`, 'm');
    const match = content.match(propertyBlockRegex);

    if (match) {
      const beds = match[1];

      // Replace the property block to add parking and leaseStart
      const replaceRegex = new RegExp(
        `(address: '${address.replace(/\./g, '\\.')}',[\\s\\S]*?lng: -?[\\d.]+)\\n(\\s+)\\}`,
        'm'
      );

      content = content.replace(replaceRegex, `$1,\n$2parking: ${beds},\n$2leaseStart: '${leaseDate}'\n$2}`);
    }
  }
});

// Write back
fs.writeFileSync('/Users/mszwed9696/rental_king/lib/properties.ts', content);
console.log('Updated properties with parking and lease start dates');
