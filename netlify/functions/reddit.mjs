export default async (req, context) => {
  try {
    const requestUrl = new URL(req.url);
    const subPath = requestUrl.pathname.replace(/^\/api\/reddit\/?/, '');
    const targetUrl = `https://www.reddit.com/${subPath}${requestUrl.search}`;

    const upstream = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SocialStreamAnalytics/1.0)',
        'Accept': 'application/json',
      },
    });

    const body = await upstream.text();

    return new Response(body, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'application/json',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return Response.json(
      { error: 'proxy_error', message: error.message },
      { status: 500 },
    );
  }
};

export const config = {
  path: '/api/reddit/*',
};
