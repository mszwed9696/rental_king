const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = '/Users/mszwed9696/.playwright-mcp/Rental-King-Properties---listings-from-master-complete.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Read current JSON data
const jsonPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Properties that need folder IDs
const needingPhotos = [
  { id: 'Humbert1', address: '408 Swarthmore Rd' },
  { id: 'Mcfadden2', address: '115 Silver Ave' },
  { id: 'Agnes1', address: '12 Holly Ave' },
  { id: 'Agnes 2', address: '321 W. High St' },
  { id: 'Mcfadden3', address: '339 Oakwood Ave' },
  { id: 'McFadden1', address: '613 Whitman' },
  { id: 'Hildebrant2', address: '8 Sherwood Lane' },
  { id: 'Hildebrant1', address: '207 University Blvd' },
  { id: 'Agnes 3', address: '52 State St' },
  { id: 'Humbert2', address: '18 Wilson Ave' },
  { id: 'Hildebrant3', address: '8 Fairmount Dr' },
  { id: 'Insana1', address: '306 Swarthmore Rd' },
  { id: 'Insana5', address: '107 Church St Apt B' },
  { id: 'Insana4', address: '107 Church St Apt A' },
  { id: 'Liscio1', address: '' },
  { id: 'Liscio2', address: '' },
  { id: 'Liscio3', address: '' },
  { id: 'Omalley1', address: '' },
  { id: 'Omalley2', address: '' }
];

console.log('=== Extracting Folder IDs from CSV ===\n');

const folderMap = {};
const csvLines = csvContent.split('\n');

// Parse CSV and extract folder IDs
csvLines.forEach((line, index) => {
  if (index === 0) return; // Skip header

  const columns = line.split(',');
  const csvId = columns[0];
  const address = columns[2];
  const folderId = columns[10];

  if (folderId && folderId.trim()) {
    folderMap[address.toLowerCase().trim()] = {
      csvId,
      address,
      folderId: folderId.trim()
    };
  }
});

console.log('Properties found in CSV with folder IDs:\n');
const foundFolderIds = [];

needingPhotos.forEach(prop => {
  const addressKey = prop.address.toLowerCase().trim();
  const match = folderMap[addressKey];

  if (match) {
    console.log(`✓ ${prop.id.padEnd(15)} | ${prop.address.padEnd(30)} | ${match.folderId}`);
    foundFolderIds.push({
      jsonId: prop.id,
      address: prop.address,
      folderId: match.folderId
    });
  } else {
    console.log(`✗ ${prop.id.padEnd(15)} | ${prop.address.padEnd(30)} | NOT FOUND`);
  }
});

console.log(`\n\nTotal folder IDs found: ${foundFolderIds.length} out of ${needingPhotos.length}`);

// Output the folder IDs in a format ready for navigation
console.log('\n\n=== Folder IDs to Navigate ===\n');
foundFolderIds.forEach((prop, index) => {
  console.log(`${index + 1}. ${prop.jsonId} - ${prop.address}`);
  console.log(`   Folder ID: ${prop.folderId}`);
  console.log(`   URL: https://drive.google.com/drive/folders/${prop.folderId}\n`);
});

// Save for reference
fs.writeFileSync(
  path.join(__dirname, 'folder_ids_to_process.json'),
  JSON.stringify(foundFolderIds, null, 2)
);

console.log('Saved folder IDs to folder_ids_to_process.json');
