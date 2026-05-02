export default async function handler(req, res) {
  try {
    // req.query.path is an array of path segments from [...path].js
    const pathParts = req.query.path || [];
    const targetPath = '/' + (Array.isArray(pathParts) ? pathParts.join('/') : pathParts);

    // Rebuild query string from remaining query params
    const qsParts = Object.keys(req.query || {}).filter(k => k !== 'path').map(k => `${encodeURIComponent(k)}=${encodeURIComponent(req.query[k])}`);
    const qs = qsParts.length ? `?${qsParts.join('&')}` : '';

    const fullUrl = `https://www.reddit.com${targetPath}${qs}`;

    const r = await fetch(fullUrl, {
      headers: {
        'User-Agent': 'socialstream-analytics/1.0'
      }
    });

    const body = await r.text();

    // Forward status and content-type
    res.status(r.status);
    const contentType = r.headers.get('content-type') || 'application/json';
    res.setHeader('Content-Type', contentType);

    // Cache briefly on the edge to reduce requests
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    res.send(body);
  } catch (err) {
    console.error('reddit proxy error', err);
    res.status(500).json({ error: 'proxy_error' });
  }
}
