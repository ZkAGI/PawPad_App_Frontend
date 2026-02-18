export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const path = req.url.replace('/api/tee/', '').replace('/api/tee', '');
  const targetUrl = 'https://p8080.m125.opf-mainnet-rofl-35.rofl.app/' + path;

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (req.headers.authorization) headers['Authorization'] = req.headers.authorization;

    const options = { method: req.method, headers };
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, options);
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    res.status(502).json({ error: 'Proxy failed', message: error.message });
  }
}
