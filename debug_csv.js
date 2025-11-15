const fs = require('fs');

const csvPath = '/Users/mszwed9696/.playwright-mcp/Rental-King-Properties-UPDATED.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');

const lines = csvContent.split('\n');

console.log('=== CSV Header ===');
console.log(lines[0]);

console.log('\n=== First 3 rows (raw) ===');
for (let i = 1; i <= 3; i++) {
  console.log(`\nRow ${i}:`);
  console.log(lines[i]);

  // Try simple split
  const cols = lines[i].split(',');
  console.log(`  Columns (simple split): ${cols.length}`);
  console.log(`  Column 0 (id): ${cols[0]}`);
  console.log(`  Column 15 (latLng): ${cols[15]}`);
}
