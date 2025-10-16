const { getData } = require('../lib/data');

function sanitizeCallback(cb) {
  return String(cb || 'onData').replace(/[^\w$.]/g, '');
}

module.exports = async (req, res) => {
  if (req.method && req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const cb = sanitizeCallback((req.query && req.query.cb) || (req.headers && req.headers['x-callback']) || 'onData');
    const data = await getData();
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
    return res.status(200).send(`${cb}(${JSON.stringify(data)});`);
  } catch (err) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    return res.status(500).send(`onError(${JSON.stringify({ ok:false, error: String(err && err.message || err) })});`);
  }
};

