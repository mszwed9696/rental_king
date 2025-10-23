const fs = require('fs');
const path = require('path');
const https = require('https');

// Read the CSV file
const csvPath = path.join(__dirname, '..', 'property_data.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Parse CSV
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

async function fetchFolderContents(folderId) {
  return new Promise((resolve, reject) => {
    if (!folderId) {
      resolve([]);
      return;
    }

    const url = `https://drive.google.com/drive/folders/${folderId}`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        // Try to extract file IDs from the HTML
        // Pattern: "id":"FILE_ID"
        const fileIdPattern = /"id":"([a-zA-Z0-9_-]+)"/g;
        const matches = [...data.matchAll(fileIdPattern)];

        // Filter out the folder ID itself and get unique file IDs
        const fileIds = [...new Set(matches.map(m => m[1]))]
          .filter(id => id !== folderId && id.length > 20);

        resolve(fileIds);
      });
    }).on('error', (err) => {
      console.error(`Error fetching folder ${folderId}:`, err.message);
      resolve([]);
    });
  });
}

async function main() {
  const rows = parseCSV(csvContent);
  const headers = rows[0];

  console.log('Starting photo extraction from Google Drive folders...\n');

  const photoMapping = {};

  for (let i = 1; i < Math.min(rows.length, 11); i++) { // Process first 10 for testing
    const row = rows[i];
    const id = row[0];
    const address = row[2];
    const photo_folder_id = row[10];

    if (!photo_folder_id) {
      console.log(`⊗ ${id} (${address}): No folder ID`);
      continue;
    }

    console.log(`Fetching: ${id} (${address})...`);

    try {
      const fileIds = await fetchFolderContents(photo_folder_id);

      if (fileIds.length > 0) {
        photoMapping[id] = {
          address,
          folder_id: photo_folder_id,
          photo_ids: fileIds,
          primary_photo: fileIds[0]
        };
        console.log(`  ✓ Found ${fileIds.length} photos`);
      } else {
        console.log(`  ⊗ No photos found`);
      }
    } catch (error) {
      console.log(`  ⊗ Error: ${error.message}`);
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Save the mapping
  const outputPath = path.join(__dirname, '..', 'property_photos_mapping.json');
  fs.writeFileSync(outputPath, JSON.stringify(photoMapping, null, 2));

  console.log(`\n✅ Photo mapping saved to property_photos_mapping.json`);
  console.log(`📊 Total properties processed: ${Object.keys(photoMapping).length}`);
}

main().catch(console.error);
