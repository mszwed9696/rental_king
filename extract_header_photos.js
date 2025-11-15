/**
 * Script to extract header photo file IDs from Google Drive folders
 *
 * For folders with known folder IDs, this will construct the header folder path
 * and attempt to extract image file IDs.
 */

const fs = require('fs');
const path = require('path');

// Properties with folder IDs that need header photos
const propertiesToFix = [
  {
    id: 'xxx',
    address: '4 SILVER AVE',
    folderId: '17j6Q4M1_7MW1Qn6JTgniOcHN_hqEWBRo',
    headerFolderUrl: 'https://drive.google.com/drive/folders/17j6Q4M1_7MW1Qn6JTgniOcHN_hqEWBRo'
  },
  {
    id: 'p002',
    address: '16 WEST ST',
    folderId: '1oVXLPD0mAkX7lwi8eZrPO0uacuxmKc8y',
    headerFolderUrl: 'https://drive.google.com/drive/folders/1oVXLPD0mAkX7lwi8eZrPO0uacuxmKc8y'
  },
  {
    id: 'p001',
    address: '9 E. NEW ST',
    folderId: '1YprVgtq0VtjJINoVyfUpJUVDkJMH99lp',
    headerFolderUrl: 'https://drive.google.com/drive/folders/1YprVgtq0VtjJINoVyfUpJUVDkJMH99lp'
  }
];

console.log('=== Properties with Folder IDs Needing Header Photos ===\n');
console.log('Please navigate to each folder and locate the header image:\n');

propertiesToFix.forEach((prop, index) => {
  console.log(`${index + 1}. ${prop.address} (${prop.id})`);
  console.log(`   Folder URL: ${prop.headerFolderUrl}`);
  console.log(`   Steps:`);
  console.log(`   - Open the folder URL above`);
  console.log(`   - Look for a 'header' subfolder and open it`);
  console.log(`   - Right-click the image file > Get link`);
  console.log(`   - Extract the FILE_ID from the link`);
  console.log(`   - The FILE_ID will be used to create: https://lh3.googleusercontent.com/d/FILE_ID=w800-h600-c`);
  console.log('');
});

// Example mapping format for user to fill in
console.log('\n=== Once you have the file IDs, update this mapping: ===\n');
console.log('const headerImageMap = {');
propertiesToFix.forEach(prop => {
  console.log(`  '${prop.folderId}': 'PASTE_FILE_ID_HERE', // ${prop.address}`);
});
console.log('};');

module.exports = { propertiesToFix };
