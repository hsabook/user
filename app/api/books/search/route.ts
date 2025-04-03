import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Không cache API này

/**
 * API tìm kiếm đa mục tiêu: sách, chương, đề, câu hỏi
 * @param request Request từ client
 * @returns Response chứa thông tin các mục tiêu đã tìm được
 */
export async function GET(request: NextRequest) {
  try {
    // Lấy query parameter từ URL
    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get('search');

    if (!searchTerm) {
      return NextResponse.json(
        {
          messages: 'Error',
          data: null,
          status_code: 400,
          error: 'Thiếu từ khóa tìm kiếm'
        },
        { status: 400 }
      );
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
      console.log('Đã thêm token vào API request');
    } else {
      console.log('Không tìm thấy token trong request headers');
    }

    // Tạo các URL API của HSABook
    const apiUrl = `https://api.hsabook.vn/books/search?search=${encodeURIComponent(searchTerm)}`;
    
    // Gọi API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    // Log thông tin chi tiết về headers đã gửi để debug
    console.log('Headers gửi đến API:', {
      contentType: headers['Content-Type'],
      authorization: headers['Authorization'] ? `Bearer ${headers['Authorization'].substring(7, 15)}...` : 'Không có token',
    });

    // Kiểm tra response
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Lỗi khi tìm kiếm:', errorData);
      
      return NextResponse.json(
        {
          messages: 'Error',
          data: null,
          status_code: response.status,
          error: errorData?.message || 'Lỗi khi tìm kiếm'
        },
        { status: response.status }
      );
    }

    // Xử lý dữ liệu trả về
    const data = await response.json();
    
    // Tổng hợp kết quả từ nhiều nguồn khác nhau
    const combinedResults = {
      messages: "Success",
      data: {
        books: [],
        menuBooks: [],
        questions: []
      },
      status_code: 200
    };

    // Phân loại kết quả dựa trên type
    if (data.status_code === 200 && data.messages === "Success") {
      if (data.data.type === "book") {
        const bookData = Array.isArray(data.data.data) ? data.data.data : [data.data.data];
        combinedResults.data.books = bookData;
      } else if (data.data.type === "menu-book") {
        const menuBookData = Array.isArray(data.data.data) ? data.data.data : [data.data.data];
        combinedResults.data.menuBooks = menuBookData;
      } else if (data.data.type === "question") {
        const questionData = Array.isArray(data.data.data) ? data.data.data : [data.data.data];
        combinedResults.data.questions = questionData;
      }
    }

    // Thêm log để debug nếu cần thiết
    console.log(`Kết quả tìm kiếm với từ khóa "${searchTerm}":`, {
      books: combinedResults.data.books.length,
      menuBooks: combinedResults.data.menuBooks.length,
      questions: combinedResults.data.questions.length
    });
    
    return NextResponse.json(combinedResults);
    
  } catch (error) {
    console.error('Lỗi khi xử lý tìm kiếm:', error);
    
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