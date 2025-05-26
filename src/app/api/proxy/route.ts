import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // No caching for API routes

// Helper function to forward the request to the actual backend
async function forwardRequest(
  req: NextRequest,
  targetUrl: string,
  originalPath: string
) {
  // Extract the path after /api/proxy
  const pathSegments = originalPath.split('/');
  const apiPathIndex = pathSegments.findIndex(segment => segment === 'api') + 2;
  const remainingPath = pathSegments.slice(apiPathIndex).join('/');

  // Create the full URL for the backend
  const url = `${targetUrl}/${remainingPath}${req.nextUrl.search || ''}`;

  try {
    // Get request method and create headers
    const method = req.method;
    const headers = new Headers();
    
    // Forward only safe headers
    req.headers.forEach((value, key) => {
      // Skip host header and others that might cause issues
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers.append(key, value);
      }
    });

    // Handle request body for methods that support it
    let requestOptions: RequestInit = {
      method,
      headers,
      redirect: 'follow',
    };

    // Add body for methods that support it
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const contentType = req.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        const body = await req.json();
        requestOptions.body = JSON.stringify(body);
      } else if (contentType.includes('multipart/form-data')) {
        // Handle form data
        requestOptions.body = await req.formData();
      } else {
        // For other content types, use raw body
        requestOptions.body = await req.text();
      }
    }

    // Forward the request to the backend
    const response = await fetch(url, requestOptions);
    
    // Create the response to send back to the client
    const responseData = await response.text();
    const contentType = response.headers.get('content-type') || 'application/json';
    
    // Create the response with appropriate status and headers
    return new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to backend' },
      { status: 500 }
    );
  }
}

// Define which services to route to
const USER_SERVICE = 'http://evergreen-technologies-ngedease-userservice.147.79.115.12.sslip.io';
const CORE_SERVICE = 'http://evergreen-technologies-ngedease-coreservice.147.79.115.12.sslip.io';

// Handle GET requests
export async function GET(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Determine which backend to route to based on path
  if (pathname.includes('/auth/')) {
    return forwardRequest(req, USER_SERVICE, pathname);
  }
  
  // Default to core service
  return forwardRequest(req, CORE_SERVICE, pathname);
}

// Handle POST requests
export async function POST(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  if (pathname.includes('/auth/')) {
    return forwardRequest(req, USER_SERVICE, pathname);
  }
  
  return forwardRequest(req, CORE_SERVICE, pathname);
}

// Handle PUT requests
export async function PUT(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  if (pathname.includes('/auth/')) {
    return forwardRequest(req, USER_SERVICE, pathname);
  }
  
  return forwardRequest(req, CORE_SERVICE, pathname);
}

// Handle DELETE requests
export async function DELETE(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  if (pathname.includes('/auth/')) {
    return forwardRequest(req, USER_SERVICE, pathname);
  }
  
  return forwardRequest(req, CORE_SERVICE, pathname);
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
} 