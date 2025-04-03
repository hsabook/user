import { NextRequest, NextResponse } from 'next/server';

// Cache tạm thời cho API
const API_CACHE = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 1 phút

export const dynamic = 'force-dynamic'; // Không cache ở server side

/**
 * API lấy thông tin chi tiết sách
 * @param request Request từ client
 * @param params Tham số từ URL (bookId)
 * @returns Response chứa thông tin chi tiết sách
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id;
    
    if (!bookId) {
      return NextResponse.json(
        {
          messages: 'Error',
          data: null,
          status_code: 400,
          error: 'Thiếu ID sách'
        },
        { status: 400 }
      );
    }

    // Kiểm tra cache
    const cachedData = API_CACHE.get(bookId);
    const now = Date.now();
    
    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      console.log('Trả về dữ liệu từ cache cho book_id:', bookId);
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
      console.log('Đã thêm token vào API request book');
    } else {
      console.log('Không tìm thấy token trong request headers book');
    }

    // Tạo URL API của HSABook
    const apiUrl = `https://api.hsabook.vn/books/${bookId}`;
    
    console.log('Gọi API book với URL:', apiUrl);
    
    // Gọi API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    // Kiểm tra response
    if (!response.ok) {
      let errorMessage = `Lỗi khi lấy thông tin sách: ${response.status}`;
      
      try {
        const errorData = await response.json();
        console.error('Lỗi khi lấy thông tin sách:', errorData);
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
    API_CACHE.set(bookId, { data, timestamp: now });
    
    // Log kết quả để debug
    console.log(`Đã lấy thông tin sách có ID "${bookId}" thành công`);
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Lỗi khi xử lý API book:', error);
    
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