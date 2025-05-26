import { NextRequest, NextResponse } from 'next/server';

// Core backend service URL
const CORE_API = 'http://evergreen-technologies-ngedease-coreservice.147.79.115.12.sslip.io';
// User management service URL
const USER_MANAGEMENT_API = 'http://evergreen-technologies-ngedease-userservice.147.79.115.12.sslip.io';

/**
 * Route handler to proxy requests to the backend services
 */
export async function GET(request: NextRequest) {
  try {
    // Get the URL parameters that should be forwarded
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target') || 'core'; // Default to core API
    const path = searchParams.get('path') || '/';
    
    const baseUrl = target === 'users' ? USER_MANAGEMENT_API : CORE_API;
    const url = `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
    
    // Forward the request
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        // Forward authorization if present
        ...(request.headers.get('Authorization') && {
          'Authorization': request.headers.get('Authorization')!,
        })
      },
      cache: 'no-store', // Disable caching for this request
    });
    
    const data = await response.json();
    
    // Return the response with appropriate CORS headers
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to backend service' },
      { status: 500 }
    );
  }
}

/**
 * Route handler for POST requests
 */
export async function POST(request: NextRequest) {
  try {
    // Get the URL parameters that should be forwarded
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target') || 'core'; // Default to core API
    const path = searchParams.get('path') || '/';
    
    const baseUrl = target === 'users' ? USER_MANAGEMENT_API : CORE_API;
    const url = `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
    
    // Get request body
    const body = await request.json();
    
    // Forward the request with the body
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward authorization if present
        ...(request.headers.get('Authorization') && {
          'Authorization': request.headers.get('Authorization')!,
        })
      },
      body: JSON.stringify(body),
      cache: 'no-store', // Disable caching for this request
    });
    
    const data = await response.json();
    
    // Return the response with appropriate CORS headers
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to backend service' },
      { status: 500 }
    );
  }
}

/**
 * Route handler for PUT requests
 */
export async function PUT(request: NextRequest) {
  try {
    // Get the URL parameters that should be forwarded
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target') || 'core'; // Default to core API
    const path = searchParams.get('path') || '/';
    
    const baseUrl = target === 'users' ? USER_MANAGEMENT_API : CORE_API;
    const url = `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
    
    // Get request body
    const body = await request.json();
    
    // Forward the request with the body
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Forward authorization if present
        ...(request.headers.get('Authorization') && {
          'Authorization': request.headers.get('Authorization')!,
        })
      },
      body: JSON.stringify(body),
      cache: 'no-store', // Disable caching for this request
    });
    
    const data = await response.json();
    
    // Return the response with appropriate CORS headers
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to backend service' },
      { status: 500 }
    );
  }
}

/**
 * Route handler for DELETE requests
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get the URL parameters that should be forwarded
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target') || 'core'; // Default to core API
    const path = searchParams.get('path') || '/';
    
    const baseUrl = target === 'users' ? USER_MANAGEMENT_API : CORE_API;
    const url = `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
    
    // Forward the request
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Forward authorization if present
        ...(request.headers.get('Authorization') && {
          'Authorization': request.headers.get('Authorization')!,
        })
      },
      cache: 'no-store', // Disable caching for this request
    });
    
    const data = await response.json();
    
    // Return the response with appropriate CORS headers
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to backend service' },
      { status: 500 }
    );
  }
}

/**
 * Route handler for OPTIONS requests (CORS preflight)
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
} 