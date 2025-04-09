import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Lấy token từ request headers
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || '';
    
    if (!token) {
      return NextResponse.json(
        { 
          messages: 'No token provided', 
          data: null,
          status_code: 401 
        },
        { status: 401 }
      );
    }
    
    // Gọi API từ service bên ngoài để kiểm tra token
    const response = await fetch('https://api.hsabook.vn/users/check-login', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Lấy dữ liệu từ response
    const data = await response.json();
    
    // Nếu API trả về lỗi
    if (!response.ok) {
      return NextResponse.json(
        { 
          messages: data.messages || 'Failed to check login status', 
          data: null,
          status_code: response.status 
        },
        { status: response.status }
      );
    }
    
    // Trả về dữ liệu thành công
    return NextResponse.json({
      messages: "Success",
      data: {
        user: data.data?.user || {
          sub: data.data?.sub,
          iat: data.data?.iat,
          exp: data.data?.exp
        }
      },
      status_code: 200
    });
  } catch (error: any) {
    console.error('Error in check-login API route:', error);
    
    // Trả về lỗi
    return NextResponse.json(
      { 
        messages: error.message || 'Internal server error',
        data: null,
        status_code: 500 
      },
      { status: 500 }
    );
  }
} 