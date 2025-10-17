const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Read the property status/photo mapping
const mappingPath = path.join(__dirname, '..', 'property_status_photo_mapping.json');
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// This script will automatically extract photo file IDs from Google Drive folders
async function extractPhotoFileIds() {
  const browser = await puppeteer.launch({
    headless: false,  // Show browser so you can see progress
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();

  const photoFileIds = {};
  const properties = Object.entries(mapping);

  console.log(`\nExtracting file IDs for ${properties.length} properties...\n`);

  for (let i = 0; i < properties.length; i++) {
    const [propertyId, data] = properties[i];
    const folderId = data.photo_column_k;

    try {
      console.log(`[${i + 1}/${properties.length}] Processing ${propertyId} (${data.address})...`);

      // Navigate to the Header folder
      await page.goto(`https://drive.google.com/drive/folders/${folderId}`, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for the file list to load
      await page.waitForSelector('[data-id]', { timeout: 10000 });

      // Find the first image file in the folder
      const fileId = await page.evaluate(() => {
        // Look for PNG or JPG files
        const fileElements = document.querySelectorAll('[data-id]');
        for (const element of fileElements) {
          const dataId = element.getAttribute('data-id');
          if (dataId && dataId.length > 20) {  // Valid file ID length
            return dataId;
          }
        }
        return null;
      });

      if (fileId) {
        photoFileIds[propertyId] = fileId;
        console.log(`  ✓ Found file ID: ${fileId}`);
      } else {
        console.log(`  ✗ Could not find file ID`);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
    }
  }

  // Save the results
  const outputPath = path.join(__dirname, '..', 'property_photo_file_ids.json');
  fs.writeFileSync(outputPath, JSON.stringify(photoFileIds, null, 2));

  console.log(`\n✓ Extracted ${Object.keys(photoFileIds).length} file IDs`);
  console.log(`✓ Saved to ${outputPath}`);

  await browser.close();
}

// Check if puppeteer is installed
try {
  require.resolve('puppeteer');
  extractPhotoFileIds().catch(console.error);
} catch (e) {
  console.log('Puppeteer not installed. Install it with:');
  console.log('npm install puppeteer');
  console.log('\nOr use the manual extraction guide in EXTRACTION_GUIDE.md');
}
