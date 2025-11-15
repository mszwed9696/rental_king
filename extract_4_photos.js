const { chromium } = require('playwright');

const folders = [
  { id: '1JDGrHLWSE_1i1Xq6XQxXMFAixbnVlFfH', property: 'Coconut1', address: '18 WEST ST' },
  { id: '1Ca_Oq3-tqhJVdhROmcBPvsvDSwY8fdtK', property: 'Coconut1', address: '202 CARPENTER ST' },
  { id: '1FDbZKeHo2T7X4rR2-SZjFiRtwNmtegVG', property: 'Pink3', address: '311 W. NEW ST' },
  { id: '1QavagCMjRk2anoVoHGTto-cBshSXGOsY', property: 'Pink3', address: '309 W. NEW ST' }
];

(async () => {
  console.log('=== Extracting Photos from 4 Google Drive Folders ===\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const results = [];

  for (const folder of folders) {
    console.log(`\nProcessing: ${folder.property} - ${folder.address}`);
    console.log(`Folder ID: ${folder.id}`);

    try {
      await page.goto(`https://drive.google.com/drive/folders/${folder.id}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      // Try to find the first image file
      const fileLinks = await page.$$('div[data-id]');

      if (fileLinks.length > 0) {
        const firstFile = fileLinks[0];
        const fileId = await firstFile.getAttribute('data-id');

        if (fileId) {
          const photoUrl = `https://lh3.googleusercontent.com/d/${fileId}=w800-h600-c`;
          results.push({
            property: folder.property,
            address: folder.address,
            folderId: folder.id,
            fileId: fileId,
            photoUrl: photoUrl
          });

          console.log(`✓ Found file ID: ${fileId}`);
        } else {
          console.log(`⚠️  No file ID found`);
        }
      } else {
        console.log(`⚠️  No files found in folder`);
      }
    } catch (error) {
      console.log(`✗ Error: ${error.message}`);
    }
  }

  await browser.close();

  console.log('\n\n=== Extraction Results ===\n');
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.property} - ${result.address}`);
    console.log(`   Folder: ${result.folderId}`);
    console.log(`   File ID: ${result.fileId}`);
    console.log(`   Photo URL: ${result.photoUrl}\n`);
  });

  console.log('\n=== Summary ===');
  console.log(`Total photos extracted: ${results.length}/4`);
})();
