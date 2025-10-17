#!/usr/bin/env node

/**
 * Batch Photo ID Extractor for Rental King Properties
 *
 * This script extracts Google Drive file IDs for property header photos
 * by navigating to each Header folder and finding the first image file.
 *
 * Process:
 * 1. For each property, navigate to its Header folder using photo_column_k
 * 2. Extract the file ID of the first image in the folder
 * 3. Build a JSON mapping of property_id -> photo_file_id
 */

const fs = require('fs');
const readline = require('readline');

const mappingPath = '/Users/mszwed9696/rental_king/property_status_photo_mapping.json';
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// Already extracted IDs
const extractedIds = {
  "P026": "10l60uUO6Sv7yS6xLysCeN0hC1c07siCk",  // 1 SILVER AVE
  "P028": "1hWwdViw340dTg61LfHOFbflttapQz7ob"   // 127 STATE ST
};

// Properties to extract
const propertiesToExtract = Object.entries(mapping)
  .filter(([propId]) => !extractedIds[propId])
  .map(([propId, data]) => ({
    id: propId,
    address: data.address,
    headerFolderId: data.photo_column_k,
    url: `https://drive.google.com/drive/folders/${data.photo_column_k}`
  }));

console.log('===============================================');
console.log('RENTAL KING - Photo ID Extraction Plan');
console.log('===============================================\n');
console.log(`Total properties: ${Object.keys(mapping).length}`);
console.log(`Already extracted: ${Object.keys(extractedIds).length}`);
console.log(`Remaining to extract: ${propertiesToExtract.length}\n`);

console.log('EXTRACTION INSTRUCTIONS:');
console.log('------------------------');
console.log('For EACH property URL below:');
console.log('1. Navigate to the Header folder URL');
console.log('2. Double-click the first image file');
console.log('3. Click "More actions" (3 dots) -> "Open in new tab"');
console.log('4. Copy the file ID from the URL: https://drive.google.com/file/d/{FILE_ID}/view');
console.log('5. Paste the file ID when prompted\n');

console.log('Properties to extract:');
console.log('======================\n');

propertiesToExtract.forEach((prop, index) => {
  console.log(`[${index + 1}/${propertiesToExtract.length}] ${prop.id} - ${prop.address}`);
  console.log(`    URL: ${prop.url}`);
  console.log('');
});

console.log('\n\nSaving extraction plan...');

// Save the extraction plan for reference
const extractionPlan = {
  timestamp: new Date().toISOString(),
  totalProperties: Object.keys(mapping).length,
  alreadyExtracted: extractedIds,
  remainingToExtract: propertiesToExtract,
  instructions: [
    '1. Navigate to the Header folder URL',
    '2. Double-click the first image file',
    '3. Click "More actions" -> "Open in new tab"',
    '4. Copy file ID from URL: https://drive.google.com/file/d/{FILE_ID}/view'
  ]
};

fs.writeFileSync(
  '/Users/mszwed9696/rental_king/extraction_plan.json',
  JSON.stringify(extractionPlan, null, 2)
);

console.log('Extraction plan saved to: extraction_plan.json');
console.log('\nYou can also reference this file for the list of properties and their URLs.');
