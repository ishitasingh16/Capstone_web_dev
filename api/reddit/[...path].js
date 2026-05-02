export default async function handler(req, res) {
  try {
    const pathParts = Array.isArray(req.query.path) ? req.query.path : [req.query.path].filter(Boolean);
    const searchParams = new URLSearchParams();

    Object.entries(req.query || {}).forEach(([key, value]) => {
      if (key === 'path') return;
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item));
      } else {
        searchParams.append(key, value);
      }
    });

    const targetUrl = `https://www.reddit.com/${pathParts.join('/')}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SocialStreamAnalytics/1.0'
      }
    });

    const body = await response.text();

    res.status(response.status);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.end(body);
  } catch (error) {
    console.error('reddit proxy error', error);
    res.status(500).json({ error: 'proxy_error', message: error.message });
  }
}