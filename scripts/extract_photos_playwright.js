/**
 * Script to extract photo IDs from Google Drive folders using Playwright
 * This allows us to navigate folders like a browser and extract file IDs
 */

const fs = require('fs');
const path = require('path');

// Read CSV
const csvPath = path.join(__dirname, '..', 'property_data.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

function parseCSV(text) {
  const rows = [];
  let row = [], cur = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (inQ) {
      if (c === '"' && n === '"') { cur += '"'; i++; }
      else if (c === '"') { inQ = false; }
      else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ',') { row.push(cur); cur = ''; }
      else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
      else if (c !== '\r') { cur += c; }
    }
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

async function extractPhotosWithPlaywright() {
  const rows = parseCSV(csvContent);
  const photoData = {};

  console.log('📸 Google Drive Photo Extraction Helper');
  console.log('=========================================\n');
  console.log('Since automated extraction requires OAuth, here are the folder URLs:');
  console.log('You can use the MCP Playwright tool to navigate and extract photo IDs\n');

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const id = row[0];
    const address = row[2];
    const photo_folder_id = row[10];

    if (photo_folder_id && photo_folder_id.length > 10) {
      const folderUrl = `https://drive.google.com/drive/folders/${photo_folder_id}`;
      console.log(`${id} - ${address}`);
      console.log(`  Folder: ${folderUrl}\n`);

      photoData[id] = {
        address,
        folder_id: photo_folder_id,
        folder_url: folderUrl,
        photos: []
      };
    }
  }

  // Save the template
  const outputPath = path.join(__dirname, '..', 'photo_extraction_template.json');
  fs.writeFileSync(outputPath, JSON.stringify(photoData, null, 2));

  console.log(`\n✅ Template saved to photo_extraction_template.json`);
  console.log(`\nTo extract photos, you can:`);
  console.log(`1. Use MCP Playwright to visit each folder URL`);
  console.log(`2. Extract file IDs from the page`);
  console.log(`3. Update the photos array in the JSON\n`);
}

extractPhotosWithPlaywright();
