import { NextResponse } from 'next/server';

const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1LJYK6OSqnsUz8DiL8YgpqsYkgAcJCwCfh0wp-C_iiwA/gviz/tq?tqx=out:json&sheet=listings_from_master_complete';

export async function GET() {
  try {
    const response = await fetch(GOOGLE_SHEETS_URL, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    const text = await response.text();
    // Remove the callback wrapper from Google's JSONP response
    const jsonText = text.substring(47, text.length - 2);
    const data = JSON.parse(jsonText);

    // Parse the Google Sheets data
    const rows = data.table.rows;
    const properties = rows.map((row: any) => {
      const cells = row.c;

      // Extract data from cells
      const id = cells[0]?.v || '';
      const title = cells[1]?.v || '';
      const address = cells[2]?.v || '';
      const city = cells[3]?.v || '';
      const type = cells[4]?.v || '';
      const beds = cells[5]?.v || 0;
      const baths = cells[6]?.v || 0;
      const rent = cells[7]?.v || 0;
      const sqft = cells[8]?.v || 0;
      const status = cells[9]?.v || 'available';
      const photo_folder_id = cells[10]?.v || '';
      const lat = cells[11]?.v || null;
      const lng = cells[12]?.v || null;

      // Convert Google Drive folder ID to photo URL
      let photoUrl = '/logo.svg';
      if (photo_folder_id) {
        // Try to use the first image from the folder
        photoUrl = `https://drive.google.com/uc?export=view&id=${photo_folder_id}`;
      }

      return {
        id,
        title,
        address,
        city,
        type,
        beds: Number(beds),
        baths: Number(baths),
        rent: Number(rent),
        sqft: Number(sqft),
        status: status.toLowerCase(),
        photo_folder_id,
        photoUrl,
        lat: lat ? Number(lat) : null,
        lng: lng ? Number(lng) : null,
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
