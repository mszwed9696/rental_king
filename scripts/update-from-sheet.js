const fs = require('fs');

// Data from Google Sheet columns J (status), N (parking), O (lease start)
const sheetData = {
  '1 SILVER AVE': { status: 'rented', parking: 17, leaseStart: '6/1/26' },
  '127 STATE ST': { status: 'available', parking: 10, leaseStart: '6/1/26' },
  '101 E. NEW ST': { status: 'available', parking: 8, leaseStart: '6/1/26' },
  '38 CARPENTER ST': { status: 'available', parking: 12, leaseStart: '6/1/27' },
  '42 CARPENTER ST': { status: 'available', parking: 14, leaseStart: '6/1/27' },
  '46 CARPENTER ST': { status: 'available', parking: 16, leaseStart: '6/1/27' },
  '4 SILVER AVE': { status: 'available', parking: 6, leaseStart: '6/1/26' },
  '34 CARPENTER ST': { status: 'available', parking: 7, leaseStart: '7/1/26' },
  '18 WEST ST': { status: 'available', parking: 8, leaseStart: '7/1/26' },
  'MIDWAY RD': { status: 'available', parking: 6, leaseStart: '6/1/27' },
  '202 CARPENTER ST': { status: 'rented', parking: 8, leaseStart: '6/1/26' },
  '5 SILVER AVE': { status: 'available', parking: 8, leaseStart: '7/1/26' },
  '18 N. ACADEMY ST': { status: 'available', parking: 8, leaseStart: '7/1/26' },
  '601 MORRIS AVE': { status: 'available', parking: 6, leaseStart: '6/1/26' },
  '7 NORMAL BLVD': { status: 'available', parking: 6, leaseStart: '6/1/26' },
  '311 W. NEW ST': { status: 'available', parking: 6, leaseStart: '6/1/26' },
  '313 HAMILTON RD': { status: 'available', parking: 6, leaseStart: '8/1/26' },
  '309 W. NEW ST': { status: 'rented', parking: 6, leaseStart: '7/1/26' },
  '109 STATE ST': { status: 'rented', parking: 6, leaseStart: '6/1/26' },
  '410 W. HIGH ST': { status: 'available', parking: 6, leaseStart: '6/1/26' },
  '306 HAMILTON RD': { status: 'available', parking: 6, leaseStart: '6/1/26' },
  '110 STATE ST': { status: 'available', parking: 6, leaseStart: '6/1/26' },
  '121 STATE ST': { status: 'available', parking: 6, leaseStart: '6/1/26' },
  '614 HESTON RD': { status: 'rented', parking: 6, leaseStart: '6/1/26' },
  '146 E. HIGH ST': { status: 'available', parking: 6, leaseStart: '7/1/26' },
  '4 WEST ST': { status: 'available', parking: 6, leaseStart: '9/1/26' },
  '122 STATE ST': { status: 'rented', parking: 4, leaseStart: '6/1/26' },
  '11 SILVER AVE': { status: 'available', parking: 4, leaseStart: '6/1/26' },
  '50 CARPENTER ST': { status: 'available', parking: 6, leaseStart: '6/1/26' },
  '16 WEST ST': { status: 'available', parking: 3, leaseStart: '6/1/26' },
  '9 E. NEW ST': { status: 'available', parking: 3, leaseStart: '6/1/26' }
};

// Read the file
let content = fs.readFileSync('/Users/mszwed9696/rental_king/lib/properties.ts', 'utf8');

// For each property, update status, parking, and leaseStart
Object.entries(sheetData).forEach(([address, data]) => {
  const addressEscaped = address.replace(/\./g, '\\.');

  // Find and replace status
  const statusRegex = new RegExp(`(address: '${addressEscaped}',\\s*[\\s\\S]*?)status: '(available|rented)',`, 'm');
  content = content.replace(statusRegex, `$1status: '${data.status}',`);

  // Find and replace parking
  const parkingRegex = new RegExp(`(address: '${addressEscaped}',\\s*[\\s\\S]*?)parking: \\d+,`, 'm');
  content = content.replace(parkingRegex, `$1parking: ${data.parking},`);

  // Find and replace leaseStart
  const leaseRegex = new RegExp(`(address: '${addressEscaped}',\\s*[\\s\\S]*?)leaseStart: '[^']*'`, 'm');
  content = content.replace(leaseRegex, `$1leaseStart: '${data.leaseStart}'`);
});

// Write back
fs.writeFileSync('/Users/mszwed9696/rental_king/lib/properties.ts', content);
console.log('Updated properties with latest status, parking, and lease dates from Google Sheet');
