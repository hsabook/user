import { NextRequest, NextResponse } from 'next/server';

// Đảm bảo route luôn mới và không được cache
export const dynamic = 'force-dynamic';

// Các giá trị hợp lệ cho sort_field và sort_type
const VALID_SORT_FIELDS = ['created_at', 'updated_at', 'name'];
const VALID_SORT_TYPES = ['ASC', 'DESC'];

export async function GET(request: NextRequest) {
  try {
    // Lấy các tham số query từ URL
    const searchParams = request.nextUrl.searchParams;
    
    // Lấy và xác thực các tham số
    const take = searchParams.get('take') || '10';
    const page = searchParams.get('page') || '1';
    const sort_field = searchParams.get('sort_field') || 'created_at';
    const sort_type = searchParams.get('sort_type') || 'DESC';
    const search = searchParams.get('search') || '';
    
    // Xác thực sort_field
    if (sort_field && !VALID_SORT_FIELDS.includes(sort_field)) {
      return NextResponse.json(
        { error: `sort_field không hợp lệ. Các giá trị hợp lệ: ${VALID_SORT_FIELDS.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Xác thực sort_type
    if (sort_type && !VALID_SORT_TYPES.includes(sort_type)) {
      return NextResponse.json(
        { error: `sort_type không hợp lệ. Các giá trị hợp lệ: ${VALID_SORT_TYPES.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Tạo URL với các tham số
    let apiUrl = new URL('https://api.hsabook.vn/books');
    
    // Thêm các tham số query
    if (take) apiUrl.searchParams.append('take', take);
    if (page) apiUrl.searchParams.append('page', page);
    if (sort_field) apiUrl.searchParams.append('sort_field', sort_field);
    if (sort_type) apiUrl.searchParams.append('sort_type', sort_type);
    if (search) apiUrl.searchParams.append('search', search);
    
    // Lấy token từ header Authorization (nếu có)
    const authHeader = request.headers.get('authorization');
    
    // Headers cho request
    const headers: HeadersInit = {
      'accept': '*/*'
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    // Gọi API hsabook.vn
    console.log(`Fetching books from: ${apiUrl.toString()}`);
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers,
      cache: 'no-store'
    });
    
    // Xử lý response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('Error fetching books:', errorData);
      
      return NextResponse.json(
        { error: 'Không thể lấy danh sách sách', details: errorData },
        { status: response.status }
      );
    }
    
    // Parse và trả về dữ liệu
    const data = await response.json();
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error in /api/books:', error);
    
    return NextResponse.json(
      { error: 'Lỗi server', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 