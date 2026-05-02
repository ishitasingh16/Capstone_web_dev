export default async function handler(req, res) {
  try {
    // req.query.path is an array of path segments from [...path].js
    const pathParts = req.query.path || [];
    const targetPath = '/' + (Array.isArray(pathParts) ? pathParts.join('/') : pathParts);

    // Rebuild query string from remaining query params
    const qsParts = Object.keys(req.query || {})
      .filter(k => k !== 'path')
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(req.query[k])}`);
    const qs = qsParts.length ? `?${qsParts.join('&')}` : '';

    const fullUrl = `https://www.reddit.com${targetPath}${qs}`;
    console.log('Proxying to:', fullUrl);

    const r = await fetch(fullUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) socialstream-analytics/1.0'
      }
    });

    const body = await r.text();
    const contentType = r.headers.get('content-type') || 'application/json';

    // Set CORS headers to allow frontend requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    res.status(r.status);
    res.end(body);
  } catch (err) {
    console.error('reddit proxy error', err.message);
    res.status(500);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'proxy_error', message: err.message }));
  }
}
