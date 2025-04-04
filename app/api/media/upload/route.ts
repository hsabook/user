import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Lấy token từ cookie
    const token = request.cookies.get('accessToken')?.value;
    
    if (!token) {
      return NextResponse.json(
        { messages: 'Unauthorized', status_code: 401 },
        { status: 401 }
      );
    }

    // Lấy form data từ request
    const formData = await request.formData();
    
    // Gửi request đến API của server
    const response = await fetch('https://api.hsabook.vn/media/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    // Kiểm tra response
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          messages: errorData.messages || 'Upload failed', 
          status_code: response.status 
        },
        { status: response.status }
      );
    }

    // Trả về dữ liệu từ server
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { messages: 'Internal server error', status_code: 500 },
      { status: 500 }
    );
  }
} 