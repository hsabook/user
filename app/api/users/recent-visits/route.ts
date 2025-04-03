import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Lấy token từ request headers
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || '';
    
    if (!token) {
      return NextResponse.json(
        { message: 'No token provided', status_code: 401 },
        { status: 401 }
      );
    }
    
    // Gọi API từ service bên ngoài
    const response = await fetch('https://api.hsabook.vn/users/recent-visits', {
      method: 'GET',
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
          message: data.message || 'Failed to fetch recent visits', 
          status_code: response.status 
        },
        { status: response.status }
      );
    }
    
    // Trả về dữ liệu thành công
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in recent-visits API route:', error);
    
    // Trả về lỗi
    return NextResponse.json(
      { 
        message: error.message || 'Internal server error', 
        status_code: 500 
      },
      { status: 500 }
    );
  }
} 