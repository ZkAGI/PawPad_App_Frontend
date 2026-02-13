export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get the path after /api/tee/
  const { slug } = req.query;
  const path = Array.isArray(slug) ? slug.join('/') : slug || '';
  const targetUrl = `https://p8080.m125.opf-mainnet-rofl-35.rofl.app/${path}`;

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Forward authorization header if present
    if (req.headers.authorization) {
      fetchOptions.headers['Authorization'] = req.headers.authorization;
    }

    // Forward body for POST/PUT
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();

    // Forward status and response
    res.status(response.status);
    
    // Try to parse as JSON
    try {
      res.json(JSON.parse(data));
    } catch {
      res.send(data);
    }
  } catch (error) {
    console.error('TEE proxy error:', error);
    res.status(502).json({ error: 'Proxy error', message: error.message });
  }
}
