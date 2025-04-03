import { NextRequest, NextResponse } from 'next/server';

// Cache lưu trữ kết quả API
const API_CACHE = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // Cache trong 1 phút

export const dynamic = 'force-dynamic'; // Không cache API này ở server side

/**
 * API lấy thông tin menu-book (chương, đề) của sách
 * @param request Request từ client
 * @returns Response chứa thông tin menu-book
 */
export async function GET(request: NextRequest) {
  try {
    // Lấy query parameter từ URL
    const searchParams = request.nextUrl.searchParams;
    const book_id = searchParams.get('book_id');

    if (!book_id) {
      return NextResponse.json(
        {
          messages: 'Error',
          data: null,
          status_code: 400,
          error: 'Thiếu book_id'
        },
        { status: 400 }
      );
    }

    // Lấy các thông số phân trang nếu có
    const page = searchParams.get('page') || '1';
    const take = searchParams.get('take') || '10';
    const sort_field = searchParams.get('sort_field') || 'order';
    const sort_type = searchParams.get('sort_type') || 'ASC';

    // Tạo cache key
    const cacheKey = `${book_id}-${page}-${take}-${sort_field}-${sort_type}`;
    
    // Kiểm tra nếu có dữ liệu trong cache và còn hiệu lực
    const cachedData = API_CACHE.get(cacheKey);
    const now = Date.now();
    
    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      console.log('Trả về dữ liệu từ cache cho book_id:', book_id);
      return NextResponse.json(cachedData.data);
    }

    // Lấy token từ header nếu có
    const authHeader = request.headers.get('authorization');
    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }

    // Cấu hình headers cho request
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Thêm Authorization header nếu có token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Đã thêm token vào API request menu-book');
    } else {
      console.log('Không tìm thấy token trong request headers menu-book');
    }

    // Tạo URL API của HSABook
    const apiUrl = `https://api.hsabook.vn/menu-book?book_id=${encodeURIComponent(book_id)}&page=${page}&take=${take}&sort_field=${sort_field}&sort_type=${sort_type}`;
    
    console.log('Gọi API menu-book với URL:', apiUrl);
    
    // Gọi API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    // Log thông tin chi tiết về headers đã gửi để debug
    console.log('Headers gửi đến API menu-book:', {
      contentType: headers['Content-Type'],
      authorization: headers['Authorization'] ? `Bearer ${headers['Authorization'].substring(0, 15)}...` : 'Không có token',
    });

    // Kiểm tra response
    if (!response.ok) {
      let errorMessage = `Lỗi khi lấy danh sách menu-book: ${response.status}`;
      
      try {
        const errorData = await response.json();
        console.error('Lỗi khi lấy danh sách menu-book:', errorData);
        errorMessage = errorData?.message || errorData?.messages || errorMessage;
      } catch (e) {
        console.error('Không thể parse lỗi JSON:', e);
      }
      
      return NextResponse.json(
        {
          messages: 'Error',
          data: null,
          status_code: response.status,
          error: errorMessage
        },
        { status: response.status }
      );
    }

    // Xử lý dữ liệu trả về
    const data = await response.json();
    
    // Lưu vào cache
    API_CACHE.set(cacheKey, { data, timestamp: now });
    
    // Thêm log để debug nếu cần thiết
    console.log(`Kết quả lấy menu-book cho book_id "${book_id}":`, {
      totalItems: data.data?.pagination?.total || 0,
      itemCount: data.data?.data?.length || 0
    });
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Lỗi khi xử lý API menu-book:', error);
    
    return NextResponse.json(
      {
        messages: 'Server Error',
        data: null,
        status_code: 500,
        error: error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ'
      },
      { status: 500 }
    );
  }
}