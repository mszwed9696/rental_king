const DEFAULT_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7d_oM6cMAY-g8PbF17B_U1cGgy_iRY3juVrPzHWWNvpzcuDId4fVB29B_dheI7erAYpzZEr65mxkT/pub?gid=980830651&single=true&output=csv';
const CSV_URL = process.env.CSV_URL || DEFAULT_CSV_URL;

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function now() { return Date.now(); }

async function fetchText(url) {
  const r = await fetch(url, {
    redirect: 'follow',
    headers: { 'user-agent': 'rental-king/1.0 (+vercel)' }
  });
  if (!r.ok) throw new Error('CSV fetch failed: ' + r.status);
  return await r.text();
}

function parseCSV(text){
  const rows = []; let row=[], cur='', inQ=false;
  for (let i=0;i<text.length;i++){
    const c=text[i], n=text[i+1];
    if (inQ){
      if (c==='"' && n==='"'){ cur+='"'; i++; }
      else if (c==='"'){ inQ=false; }
      else cur+=c;
    } else {
      if (c==='"') inQ=true;
      else if (c===','){ row.push(cur); cur=''; }
      else if (c==='\n'){ row.push(cur); rows.push(row); row=[]; cur=''; }
      else if (c!=='\r'){ cur+=c; }
    }
  }
  if (cur.length || row.length){ row.push(cur); rows.push(row); }
  return rows;
}

function indexHeaders(h) { const m = {}; h.forEach((x,i)=>{ m[(x||'').trim()] = i; }); return m; }
function get(r, idx, k){ const i = idx[k]; return i==null ? '' : (r[i] ?? ''); }
function toNum(v){ const n = Number(String(v||'').trim()); return Number.isFinite(n) ? n : NaN; }
function genMap(a,c){ if(!a) return ''; const q=[a,c].filter(Boolean).join(' '); return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q); }
function normDate(v){ const s=String(v||'').trim(); if(!s) return ''; const d=new Date(s); return isNaN(d)?s:d.toISOString(); }

async function buildFromCSV() {
  if (!CSV_URL || !/^https?:\/\//.test(CSV_URL)) {
    throw new Error('CSV_URL is not set. Configure env var CSV_URL.');
  }
  const text = await fetchText(CSV_URL);
  const rows = parseCSV(text);

  const headers = rows.shift()?.map(h => (h || '').trim()) || [];
  const idx = indexHeaders(headers);

  const props = rows
    .filter(r => (get(r, idx, 'id') || get(r, idx, 'address')))
    .map(r => {
      const id    = get(r, idx, 'id');
      const addr  = get(r, idx, 'address');
      const city  = get(r, idx, 'city');
      const title = get(r, idx, 'title') || addr || id;
      const status = (get(r, idx, 'status') || '').toLowerCase();
      const lat = toNum(get(r, idx, 'lat'));
      const lng = toNum(get(r, idx, 'lng'));
      return {
        id,
        title,
        address: addr,
        city,
        type: get(r, idx, 'type'),
        beds: toNum(get(r, idx, 'beds')),
        baths: toNum(get(r, idx, 'baths')),
        rent: toNum(get(r, idx, 'rent')),
        sqft: get(r, idx, 'sqft'),
        status,
        map_link: get(r, idx, 'map_link') || genMap(addr, city),
        parking: get(r, idx, 'parking'),
        lease_start: normDate(get(r, idx, 'lease_start')),
        lat: Number.isFinite(lat) ? lat : '',
        lng: Number.isFinite(lng) ? lng : '',
        primary_photo: get(r, idx, 'primary_photo') || ''
      };
    });

  return { ok: true, properties: props };
}

function getCache() {
  if (!global.__rentalKingCache) global.__rentalKingCache = { ts: 0, data: null, meta: null };
  return global.__rentalKingCache;
}

async function getData() {
  const cache = getCache();
  const fresh = cache.data && (now() - cache.ts) < CACHE_TTL_MS;
  if (fresh) return cache.data;
  const data = await buildFromCSV();
  cache.data = data;
  cache.meta = { updatedAt: new Date().toISOString(), source: 'csv', url: CSV_URL };
  cache.ts = now();
  return data;
}

function getMeta() {
  const cache = getCache();
  return cache.meta;
}

module.exports = { getData, getMeta };
