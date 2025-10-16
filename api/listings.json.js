const { getData } = require('../lib/data');

module.exports = async (req, res) => {
  if (req.method && req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const fresh = !!(req.query && (req.query.fresh === '1' || req.query.fresh === 'true'));
    const data = await getData({ fresh });
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).send(JSON.stringify(data));
  } catch (err) {
    return res.status(500).send(JSON.stringify({ ok: false, error: String(err && err.message || err) }));
  }
};
