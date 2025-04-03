import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Đảm bảo route luôn động

// Các giá trị hợp lệ cho sort_field và sort_type
const VALID_SORT_FIELDS = ['created_at', 'updated_at'];
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
    let apiUrl = new URL('https://api.hsabook.vn/codes/my-book');
    
    // Thêm các tham số query
    if (take) apiUrl.searchParams.append('take', take);
    if (page) apiUrl.searchParams.append('page', page);
    if (sort_field) apiUrl.searchParams.append('sort_field', sort_field);
    if (sort_type) apiUrl.searchParams.append('sort_type', sort_type);
    if (search) apiUrl.searchParams.append('search', search);
    
    // Lấy token từ header Authorization (nếu có)
    const authHeader = request.headers.get('authorization');
    
    // Kiểm tra xem có token không
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Cần phải đăng nhập để xem danh sách sách đã kích hoạt' },
        { status: 401 }
      );
    }
    
    // Headers cho request
    const headers: HeadersInit = {
      'accept': '*/*'
    };
    
    headers['Authorization'] = authHeader;
    
    // Gọi API hsabook.vn
    console.log(`Fetching activated books from: ${apiUrl.toString()}`);
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers,
      cache: 'no-store'
    });
    
    // Xử lý response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('Error fetching activated books:', errorData);
      
      return NextResponse.json(
        { error: 'Không thể lấy danh sách sách đã kích hoạt', details: errorData },
        { status: response.status }
      );
    }
    
    // Parse và trả về dữ liệu
    const data = await response.json();
    
    // Log dữ liệu để debug
    console.log('API response data từ external API:', data);
    
    // Đảm bảo trả về đúng cấu trúc dữ liệu
    // API có thể trả về nhiều định dạng khác nhau, cần chuẩn hóa
    
    // Kiểm tra và chuẩn hóa cấu trúc dữ liệu
    let formattedData;
    
    // Trường hợp 1: Dữ liệu đã đúng định dạng mong muốn
    if (data.pagination && Array.isArray(data.data)) {
      formattedData = {
        data: {
          pagination: data.pagination,
          data: data.data
        },
        messages: "Success",
        status_code: 200
      };
    } 
    // Trường hợp 2: Dữ liệu lồng nhau - data.data.data là mảng (cấu trúc hiện tại)
    else if (data.data && data.data.data && Array.isArray(data.data.data)) {
      formattedData = {
        data: {
          pagination: data.data.pagination || {
            current_page: 1,
            total_pages: 1,
            take: parseInt(take),
            total: data.data.data.length
          },
          data: data.data.data
        },
        messages: data.messages || "Success",
        status_code: data.status_code || 200
      };
    }
    // Trường hợp 3: data.data là mảng
    else if (data.data && Array.isArray(data.data)) {
      formattedData = {
        data: {
          pagination: data.pagination || {
            current_page: 1,
            total_pages: 1,
            take: parseInt(take),
            total: data.data.length
          },
          data: data.data
        },
        messages: "Success",
        status_code: 200
      };
    } 
    // Trường hợp khác: trả về dữ liệu gốc
    else {
      console.error('Không thể xác định cấu trúc dữ liệu:', data);
      formattedData = data;
    }
    
    console.log('Formatted data for client:', formattedData);
    
    return NextResponse.json(formattedData);
    
  } catch (error) {
    console.error('Error in /api/codes/my-book:', error);
    
    return NextResponse.json(
      { error: 'Lỗi server', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 