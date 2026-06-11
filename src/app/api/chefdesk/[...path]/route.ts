if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const CHEFDESK_API_BASE_URL =
  process.env.CHEFDESK_API_BASE_URL ?? 'https://chefdesk-api-963913766778.us-central1.run.app';

type ForwardedMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

function buildTargetUrl(request: Request, path: string[]) {
  const sourceUrl = new URL(request.url);
  const targetUrl = new URL(path.join('/'), `${CHEFDESK_API_BASE_URL.replace(/\/$/, '')}/`);
  targetUrl.search = sourceUrl.search;

  return targetUrl;
}

async function proxyRequest(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
  method: ForwardedMethod
) {
  const { path } = await context.params;
  const targetUrl = buildTargetUrl(request, path);
  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  const token = process.env.CHEFDESK_API_TOKEN;

  if (contentType) {
    headers.set('content-type', contentType);
  }

  if (token) {
    headers.set('authorization', `Bearer ${token}`);
  }

  const response = await fetch(targetUrl, {
    method,
    headers,
    body: method === 'GET' || method === 'DELETE' ? undefined : await request.text(),
    cache: 'no-store',
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      'content-type': response.headers.get('content-type') ?? 'application/json',
    },
  });
}

export function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context, 'GET');
}

export function POST(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context, 'POST');
}

export function PATCH(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context, 'PATCH');
}

export function PUT(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context, 'PUT');
}

export function DELETE(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context, 'DELETE');
}
