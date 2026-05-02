export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract path segments
    const pathArray = req.query.path;
    if (!pathArray || !Array.isArray(pathArray)) {
      return res.status(400).json({ error: 'Invalid path' });
    }

    const path = '/' + pathArray.join('/');
    
    // Build full Reddit URL
    const url = new URL(`https://www.reddit.com${path}`);
    
    // Add query parameters from the request
    Object.entries(req.query).forEach(([key, value]) => {
      if (key !== 'path') {
        url.searchParams.append(key, value);
      }
    });

    const fullUrl = url.toString();
    console.log('🔄 Proxying request to:', fullUrl);

    // Fetch from Reddit with a browser-like User-Agent
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Handle non-OK responses
    if (!response.ok) {
      console.error(`❌ Reddit returned ${response.status}: ${response.statusText}`);
      return res.status(response.status).json({ 
        error: `Reddit API error: ${response.status}`,
        reddit_status: response.statusText 
      });
    }

    const contentType = response.headers.get('content-type');
    const data = await response.text();

    // Set response headers
    res.setHeader('Content-Type', contentType || 'application/json');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    
    return res.status(200).send(data);
  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    return res.status(500).json({ 
      error: 'Proxy error',
      message: error.message 
    });
  }
}
