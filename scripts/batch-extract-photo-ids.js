const https = require('https');
const fs = require('fs');
const path = require('path');

// Read the property status/photo mapping
const mappingPath = path.join(__dirname, '..', 'property_status_photo_mapping.json');
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// Function to fetch folder contents from Google Drive
function fetchFolderContents(folderId) {
  return new Promise((resolve, reject) => {
    const url = `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        // Try to extract file IDs from the HTML response
        // Look for patterns like: /file/d/{FILE_ID}/
        const fileIdPattern = /\/file\/d\/([a-zA-Z0-9_-]{20,})\//g;
        const matches = [...data.matchAll(fileIdPattern)];

        if (matches.length > 0) {
          // Return the first file ID found
          resolve(matches[0][1]);
        } else {
          resolve(null);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Sleep function to avoid rate limiting
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function extractAllPhotoIds() {
  const photoFileIds = {
    "P026": "10l60uUO6Sv7yS6xLysCeN0hC1c07siCk",
    "P028": "1hWwdViw340dTg61LfHOFbflttapQz7ob"
  };

  const properties = Object.entries(mapping);

  console.log(`\nExtracting file IDs for ${properties.length} properties...\n`);

  for (let i = 0; i < properties.length; i++) {
    const [propertyId, data] = properties[i];

    // Skip if already extracted
    if (photoFileIds[propertyId]) {
      console.log(`[${i + 1}/${properties.length}] ${propertyId} - Already extracted ✓`);
      continue;
    }

    const folderId = data.photo_column_k;

    try {
      console.log(`[${i + 1}/${properties.length}] Processing ${propertyId} (${data.address})...`);

      const fileId = await fetchFolderContents(folderId);

      if (fileId) {
        photoFileIds[propertyId] = fileId;
        console.log(`  ✓ Found file ID: ${fileId}`);
      } else {
        console.log(`  ✗ Could not extract file ID`);
      }

      // Wait 500ms between requests to avoid rate limiting
      await sleep(500);

    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
    }
  }

  // Save the results
  const outputPath = path.join(__dirname, '..', 'property_photo_file_ids.json');
  fs.writeFileSync(outputPath, JSON.stringify(photoFileIds, null, 2));

  console.log(`\n✓ Extracted ${Object.keys(photoFileIds).length} file IDs`);
  console.log(`✓ Saved to ${outputPath}`);
}

extractAllPhotoIds().catch(console.error);
