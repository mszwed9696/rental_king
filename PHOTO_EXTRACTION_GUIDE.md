# Photo Extraction Guide for Rental King

## Current Situation
Each property in the CSV has a `photo_folder_id` that points to a Google Drive folder containing images. We need to extract the first photo from each folder to use as the property thumbnail.

## Google Drive Structure
- Main folder: https://drive.google.com/drive/folders/1fyBsLUtWX5ws44skELCEIVIJzmTB8U6C?usp=drive_link
- Each property has its own subfolder with ID in column `photo_folder_id`

## Photo URL Format Options

### Option 1: Use Folder ID as Direct Image (Current Method)
The current code uses: `https://lh3.googleusercontent.com/d/{folder_id}`

This works if the folder_id actually points to an image file, but won't work for folder IDs.

### Option 2: Google Drive Thumbnail API
Format: `https://drive.google.com/thumbnail?id={folder_id}&sz=w1000`

This can sometimes generate thumbnails from folders.

### Option 3: Direct File Access (Requires File IDs)
Format: `https://lh3.googleusercontent.com/d/{file_id}=w1600-no`

This requires knowing the individual file IDs within each folder.

## Manual Method to Get Photo IDs

Since Google Drive API requires OAuth authentication which isn't available in this environment, here's a manual process:

1. **Open each folder** from the main drive
2. **Right-click on the first photo** → "Open in new tab"
3. **Copy the File ID** from the URL (format: `/file/d/{FILE_ID}/view`)
4. **Add to a mapping file**

## Automated Alternative (If Drive is Public)

If the folders are publicly accessible, we can try to:
1. Use the folder viewing URL
2. Parse the HTML to extract file IDs
3. Build a photo mapping automatically

## Quick Fix Solution

For now, I'll update the code to use multiple fallback methods:
1. Try direct lh3.googleusercontent.com with folder ID
2. Try Google Drive thumbnail API
3. Fall back to logo if neither works

Then we can manually populate the best photo IDs over time.
