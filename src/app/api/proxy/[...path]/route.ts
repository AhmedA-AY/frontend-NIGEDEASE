import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // No caching for API routes

// Helper function to forward the request to the actual backend
async function forwardRequest(
  req: NextRequest,
  targetUrl: string,
  path: string[] = []
) {
  try {
    // Create the path from the path array
    let remainingPath = path.join('/');
    
    // Fix for auth/login vs auth/login/ discrepancy
    // If we're dealing with auth/login, ensure the trailing slash
    if (remainingPath === 'auth/login') {
      remainingPath = 'auth/login/';
    }

    // Create the full URL for the backend
    const url = `${targetUrl}/${remainingPath}${req.nextUrl.search || ''}`;
    
    console.log(`Proxying request to: ${url}`);

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

    // Ensure content type is set correctly
    if (!headers.has('Content-Type') && ['POST', 'PUT', 'PATCH'].includes(method)) {
      headers.append('Content-Type', 'application/json');
    }

    // Handle request body for methods that support it
    let requestOptions: RequestInit = {
      method,
      headers,
      redirect: 'follow',
    };

    // Special handling for auth/login endpoint
    if ((remainingPath === 'auth/login' || remainingPath === 'auth/login/') && method === 'POST') {
      try {
        let body;
        const contentType = req.headers.get('content-type') || '';
        
        if (contentType.includes('application/json')) {
          body = await req.clone().json(); // clone the request to avoid consuming it
          console.log('Forwarding JSON login request:', JSON.stringify(body));
        } else {
          body = await req.clone().text();
          try {
            // Try to parse as JSON in case Content-Type is wrong
            body = JSON.parse(body);
            console.log('Parsed body as JSON despite content type');
          } catch (e) {
            console.log('Body is not JSON format');
          }
        }
        
        requestOptions.body = JSON.stringify(body);
      } catch (error) {
        console.error('Error processing login request body:', error);
        return NextResponse.json(
          { error: 'Failed to process login request' },
          { status: 400 }
        );
      }
    } 
    // General handling for other POST/PUT/PATCH requests
    else if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        const contentType = req.headers.get('content-type') || '';
        
        if (contentType.includes('application/json')) {
          const body = await req.clone().json();
          requestOptions.body = JSON.stringify(body);
        } else if (contentType.includes('multipart/form-data')) {
          requestOptions.body = await req.formData();
        } else {
          requestOptions.body = await req.text();
        }
      } catch (error) {
        console.error('Error processing request body:', error);
        return NextResponse.json(
          { error: 'Failed to process request body' },
          { status: 400 }
        );
      }
    }

    // Forward the request to the backend
    console.log(`Sending ${method} request to ${url}`);
    
    const response = await fetch(url, requestOptions);
    
    // Debug information
    console.log(`Backend responded with status: ${response.status}`);
    
    // Create the response to send back to the client
    const responseData = await response.text();
    const contentType = response.headers.get('content-type') || 'application/json';
    
    // Log response data for debugging
    if (remainingPath.includes('auth/login')) {
      console.log('Login response:', responseData.substring(0, 100) + '...');
    }
    
    // Create the response with appropriate status and headers
    return new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      }
    });
  } catch (error: any) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to backend', details: error.message },
      { status: 500 }
    );
  }
}

// Define which services to route to
const USER_SERVICE = 'http://evergreen-technologies-ngedease-userservice.147.79.115.12.sslip.io';
const CORE_SERVICE = 'http://evergreen-technologies-ngedease-coreservice.147.79.115.12.sslip.io';

// Handle all HTTP methods with a single handler
export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  console.log(`GET request to path: ${params.path.join('/')}`);
  
  if (params.path[0] === 'auth' || params.path.join('/').includes('/auth/')) {
    return forwardRequest(req, USER_SERVICE, params.path);
  }
  
  return forwardRequest(req, CORE_SERVICE, params.path);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  console.log(`POST request to path: ${params.path.join('/')}`);
  
  if (params.path[0] === 'auth' || params.path.join('/').includes('/auth/')) {
    return forwardRequest(req, USER_SERVICE, params.path);
  }
  
  return forwardRequest(req, CORE_SERVICE, params.path);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  if (params.path[0] === 'auth' || params.path.join('/').includes('/auth/')) {
    return forwardRequest(req, USER_SERVICE, params.path);
  }
  
  return forwardRequest(req, CORE_SERVICE, params.path);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  if (params.path[0] === 'auth' || params.path.join('/').includes('/auth/')) {
    return forwardRequest(req, USER_SERVICE, params.path);
  }
  
  return forwardRequest(req, CORE_SERVICE, params.path);
}

export async function OPTIONS(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  console.log(`OPTIONS request to: ${params.path.join('/')}`);
  
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
    },
  });
} 