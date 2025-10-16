const DEFAULT_SRC = process.env.APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbwvB5O7ZzhL3V5La63FbkCFL7aQ3sMKnBu7NmpmbMzQzHfGn18skTOMy0gbIQQ-5yRA/exec';

module.exports = async (req, res) => {
  if (req.method && req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Method Not Allowed');
  }
  const src = (req.query && req.query.src) ? String(req.query.src) : DEFAULT_SRC;
  try {
    const r = await fetch(src, { redirect: 'follow' });
    if (!r.ok) throw new Error('Upstream error: ' + r.status);
    const data = await r.json();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).send(JSON.stringify(data));
  } catch (err) {
    return res.status(200).send(JSON.stringify({ ok: false, error: String(err && err.message || err) }));
  }
};

