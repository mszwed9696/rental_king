Rental King (Vercel)
====================

Vercel Serverless Functions that fetch a published Google Sheet CSV and serve it as fast JSON and JSONP (for GHL). Uses in-memory caching per function instance (5 minutes) and HTTP cache headers for edge caching.

Endpoints (via vercel.json rewrites)
- `/listings.json` – JSON
- `/listings.jsonp?cb=fn` – JSONP
- `/sanity` – last refresh metadata

Configuration
- Set environment variable `CSV_URL` in Vercel Project Settings to your published CSV URL.
  - Default (fallback) is prefilled to your current URL.

Google Sheet prep (one-time)
- In tab `listings_from_master_complete`, add columns: `lat`, `lng`, `primary_photo`.
- Fill `lat`/`lng`. `primary_photo` should be a public URL (e.g., `https://lh3.googleusercontent.com/d/FILE_ID=w1600-no`).
- Publish tab as CSV and copy the URL for `CSV_URL`.

Local dev (optional)
- You can run a local server with `vercel dev` if you have Vercel CLI installed.

Deploy to Vercel
1) Create a new Vercel project from this repo.
2) Add env var `CSV_URL` in Project Settings.
3) Deploy.

GHL wiring
- Set `API_BASE` to your deployed URL, e.g., `https://rental-king.vercel.app`.
- Use JSONP loader in both snippets:
  ```js
  const url = API_BASE + '/listings.jsonp?cb=' + cb;
  ```

Notes
- JSON endpoint sets `Access-Control-Allow-Origin: *`.
- JSONP is script-safe for GHL. Callback sanitized to `[\w$.]`.
- Cache: 5-minute in-memory per function instance + `s-maxage=300, stale-while-revalidate=86400` headers.

