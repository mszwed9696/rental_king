import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the complete property data JSON file
    const filePath = path.join(process.cwd(), 'RENTAL_KING_COMPLETE_DATA.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    // Transform properties to match the expected format
    const properties = data.properties.map((prop: any) => {
      // Convert Google Drive folder ID to photo URL
      // Using multiple fallback formats for maximum compatibility
      let photoUrl = '/logo.svg';
      if (prop.photo_folder_id) {
        // Try lh3.googleusercontent.com with size parameter for better loading
        photoUrl = `https://lh3.googleusercontent.com/d/${prop.photo_folder_id}=w800-h600-c`;
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
