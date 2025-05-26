import { NextRequest, NextResponse } from 'next/server';

// Core backend service URL
const CORE_API = 'http://evergreen-technologies-ngedease-coreservice.147.79.115.12.sslip.io';
// User management service URL
const USER_MANAGEMENT_API = 'http://evergreen-technologies-ngedease-userservice.147.79.115.12.sslip.io';

/**
 * Helper function to check if the response is JSON or binary
 */
async function handleResponse(response: Response) {
  // Check content type to handle different responses appropriately
  const contentType = response.headers.get('content-type') || '';
  
  if (contentType.includes('application/json')) {
    // Handle JSON response
    try {
      const data = await response.json();
      return { data, isJson: true };
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      return { data: null, isJson: false };
    }
  } else {
    // Handle non-JSON response (binary data, text, etc.)
    try {
      // For binary data, return a blob/arrayBuffer
      const data = await response.arrayBuffer();
      return { data, isJson: false };
    } catch (error) {
      console.error('Failed to process response:', error);
      return { data: null, isJson: false };
    }
  }
}

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
    
    // Handle the response based on content type
    const { data, isJson } = await handleResponse(response);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: isJson && data ? data : 'Backend request failed' },
        { 
          status: response.status,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }
    
    // If it's JSON data, return a JSON response
    if (isJson) {
      return NextResponse.json(data, {
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    } 
    
    // Otherwise return binary data with appropriate content type
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
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
    let body;
    const contentType = request.headers.get('Content-Type') || '';
    
    if (contentType.includes('application/json')) {
      body = await request.json();
      body = JSON.stringify(body);
    } else if (contentType.includes('multipart/form-data')) {
      // Handle form data
      body = await request.formData();
    } else {
      // For other content types, get the raw body
      body = await request.text();
    }
    
    // Forward the request with the body
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        // Forward authorization if present
        ...(request.headers.get('Authorization') && {
          'Authorization': request.headers.get('Authorization')!,
        })
      },
      body,
      cache: 'no-store', // Disable caching for this request
    });
    
    // Handle the response based on content type
    const { data, isJson } = await handleResponse(response);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: isJson && data ? data : 'Backend request failed' },
        { 
          status: response.status,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }
    
    // If it's JSON data, return a JSON response
    if (isJson) {
      return NextResponse.json(data, {
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    } 
    
    // Otherwise return binary data with appropriate content type
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
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
    let body;
    const contentType = request.headers.get('Content-Type') || '';
    
    if (contentType.includes('application/json')) {
      body = await request.json();
      body = JSON.stringify(body);
    } else if (contentType.includes('multipart/form-data')) {
      // Handle form data
      body = await request.formData();
    } else {
      // For other content types, get the raw body
      body = await request.text();
    }
    
    // Forward the request with the body
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        // Forward authorization if present
        ...(request.headers.get('Authorization') && {
          'Authorization': request.headers.get('Authorization')!,
        })
      },
      body,
      cache: 'no-store', // Disable caching for this request
    });
    
    // Handle the response based on content type
    const { data, isJson } = await handleResponse(response);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: isJson && data ? data : 'Backend request failed' },
        { 
          status: response.status,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }
    
    // If it's JSON data, return a JSON response
    if (isJson) {
      return NextResponse.json(data, {
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    } 
    
    // Otherwise return binary data with appropriate content type
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
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
    
    // Handle the response based on content type
    const { data, isJson } = await handleResponse(response);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: isJson && data ? data : 'Backend request failed' },
        { 
          status: response.status,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }
    
    // If it's JSON data, return a JSON response
    if (isJson) {
      return NextResponse.json(data, {
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    } 
    
    // For DELETE, we often just want to return a success status with no body
    return new NextResponse(null, {
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