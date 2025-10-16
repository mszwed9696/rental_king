const DEFAULT_SRC = process.env.APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbwvB5O7ZzhL3V5La63FbkCFL7aQ3sMKnBu7NmpmbMzQzHfGn18skTOMy0gbIQQ-5yRA/exec';

function sanitizeCallback(cb) {
  return String(cb || 'onData').replace(/[^\w$.]/g, '');
}

module.exports = async (req, res) => {
  if (req.method && req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Method Not Allowed');
  }
  const src = (req.query && req.query.src) ? String(req.query.src) : DEFAULT_SRC;
  const cb = sanitizeCallback((req.query && req.query.cb) || (req.headers && req.headers['x-callback']) || 'onData');
  try {
    const r = await fetch(src, { redirect: 'follow' });
    if (!r.ok) throw new Error('Upstream error: ' + r.status);
    const data = await r.json();
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
    return res.status(200).send(`${cb}(${JSON.stringify(data)});`);
  } catch (err) {
    const payload = { ok: false, error: String((err && err.message) || err) };
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    return res.status(200).send(`${cb}(${JSON.stringify(payload)});`);
  }
};

