import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Đảm bảo route luôn động

export async function POST(request: NextRequest) {
  try {
    // Lấy dữ liệu từ request body
    const requestData = await request.json();
    
    // Kiểm tra dữ liệu đầu vào
    if (!requestData.code_id || requestData.book_code === undefined) {
      return NextResponse.json(
        { error: 'Thiếu thông tin kích hoạt. Vui lòng cung cấp code_id và book_code' },
        { status: 400 }
      );
    }
    
    // Lấy token từ header (nếu có)
    const authHeader = request.headers.get('authorization');
    
    // Tạo headers cho request đến API external
    const headers: HeadersInit = {
      'accept': '*/*',
      'Content-Type': 'application/json'
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    // Gọi API external để kích hoạt mã
    const response = await fetch('https://api.hsabook.vn/codes/active', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        code_id: requestData.code_id,
        book_code: requestData.book_code
      }),
      cache: 'no-store'
    });
    
    // Lấy kết quả từ API
    const responseData = await response.json();
    
    // Trả về response với status code và dữ liệu từ API gốc
    return NextResponse.json(
      responseData,
      { status: response.status }
    );
    
  } catch (error) {
    console.error('Error activating book code:', error);
    
    // Trả về lỗi
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi kích hoạt mã sách', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 