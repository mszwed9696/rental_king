import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Cache for photo URLs
let photoCache: { [key: string]: string } = {};

async function getFirstPhotoFromFolder(folderId: string): Promise<string> {
  // Check cache first
  if (photoCache[folderId]) {
    return photoCache[folderId];
  }

  try {
    // Try to fetch the folder page and extract photo IDs
    const folderUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
    const response = await fetch(folderUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RentalKingBot/1.0)'
      }
    });

    if (response.ok) {
      const html = await response.text();

      // Try to extract file IDs from the HTML
      const fileIdMatches = html.match(/"fileId":"([^"]+)"/g);
      if (fileIdMatches && fileIdMatches.length > 0) {
        const firstFileId = fileIdMatches[0].match(/"fileId":"([^"]+)"/)?.[1];
        if (firstFileId) {
          const photoUrl = `https://drive.google.com/uc?export=view&id=${firstFileId}`;
          photoCache[folderId] = photoUrl;
          return photoUrl;
        }
      }
    }
  } catch (error) {
    console.error(`Error fetching folder ${folderId}:`, error);
  }

  // Fallback: try direct embed thumbnail
  const fallbackUrl = `https://drive.google.com/thumbnail?id=${folderId}&sz=w400`;
  photoCache[folderId] = fallbackUrl;
  return fallbackUrl;
}

export async function GET() {
  try {
    // Read the complete property data JSON file
    const filePath = path.join(process.cwd(), 'RENTAL_KING_COMPLETE_DATA.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    // Transform properties to match the expected format
    const propertiesPromises = data.properties.map(async (prop: any) => {
      let photoUrl = '/logo.svg';

      if (prop.photo_folder_id) {
        // Try multiple URL formats for maximum compatibility
        // Format 1: Direct uc export (works for individual files shared from folders)
        photoUrl = `https://drive.google.com/uc?export=view&id=${prop.photo_folder_id}`;
      }

      return {
        id: prop.id,
        title: prop.title,
        address: prop.address,
        city: prop.city,
        email: prop.email || 'rentalkinginfo@gmail.com',
        type: prop.type || prop.property_type || '',
        beds: prop.beds || 0,
        baths: prop.baths || 0,
        rent: prop.rent || 0,
        sqft: prop.sqft || 0,
        status: prop.status,
        photo_folder_id: prop.photo_folder_id,
        photoUrl,
        lat: prop.lat,
        lng: prop.lng,
        parking: prop.parking,
        leaseStart: prop.leaseStart,
      };
    });

    const properties = await Promise.all(propertiesPromises);

    return NextResponse.json({ properties }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
