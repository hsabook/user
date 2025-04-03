import { BooksResponse, BookQueryParams } from '@/types/book';

// Hàm xử lý gọi API lấy danh sách sách
export async function getBooks(params?: BookQueryParams): Promise<BooksResponse> {
  try {
    // Tạo URL với query params
    const url = new URL('/api/books', window.location.origin);
    
    if (params) {
      if (params.take) url.searchParams.set('take', params.take.toString());
      if (params.page) url.searchParams.set('page', params.page.toString());
      if (params.sort_field) url.searchParams.set('sort_field', params.sort_field);
      if (params.sort_type) url.searchParams.set('sort_type', params.sort_type);
      if (params.search) url.searchParams.set('search', params.search);
    }

    // Lấy access token từ localStorage (nếu có)
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('accessToken') || '';
    }

    // Headers cho request
    const headers: HeadersInit = {
      'accept': '*/*'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Gọi API
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || 'Không thể lấy danh sách sách');
    }

    const result: BooksResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Error in bookService.getBooks:', error);
    throw error;
  }
}

// Hàm lấy thông tin chi tiết sách theo ID
export async function getBookById(id: string) {
  try {
    // Tạo URL với id
    const url = new URL(`/api/books/${id}`, window.location.origin);

    // Lấy access token từ localStorage (nếu có)
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('accessToken') || '';
    }

    // Headers cho request
    const headers: HeadersInit = {
      'accept': '*/*'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Gọi API
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || 'Không thể lấy thông tin sách');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in bookService.getBookById:', error);
    throw error;
  }
}

/**
 * Kích hoạt sách bằng mã code
 */
export async function activateBookCode(codeId: string, bookCode: number) {
  try {
    // Lấy token từ localStorage (nếu có)
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('accessToken') || '';
    }
    
    // Tạo headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'accept': '*/*'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Gọi API 
    const response = await fetch('/api/codes/active', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        code_id: codeId,
        book_code: bookCode
      })
    });
    
    // Lấy dữ liệu từ response
    const data = await response.json();
    
    // Kiểm tra response
    if (!response.ok) {
      // Xử lý trường hợp lỗi, ưu tiên lấy message từ response
      const errorMessage = data.message || data.error || 'Kích hoạt mã không thành công';
      throw new Error(errorMessage);
    }
    
    // Trả về kết quả
    return data;
  } catch (error) {
    console.error('Error in activateBookCode:', error);
    throw error;
  }
}

/**
 * Lấy danh sách sách đã kích hoạt của người dùng
 */
export async function getActivatedBooks(params?: {
  take?: number;
  page?: number;
  sort_field?: 'created_at' | 'updated_at';
  sort_type?: 'ASC' | 'DESC';
  search?: string;
}) {
  try {
    // Lấy token từ localStorage (nếu có)
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('accessToken') || '';
    }
    
    if (!token) {
      throw new Error('Bạn cần đăng nhập để xem danh sách sách đã kích hoạt');
    }
    
    // Tạo URL với query params
    const url = new URL('/api/codes/my-book', window.location.origin);
    
    if (params) {
      if (params.take) url.searchParams.set('take', params.take.toString());
      if (params.page) url.searchParams.set('page', params.page.toString());
      if (params.sort_field) url.searchParams.set('sort_field', params.sort_field);
      if (params.sort_type) url.searchParams.set('sort_type', params.sort_type);
      if (params.search) url.searchParams.set('search', params.search);
    }
    
    // Headers cho request
    const headers: HeadersInit = {
      'accept': '*/*'
    };
    
    headers['Authorization'] = `Bearer ${token}`;
    
    // Gọi API
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
      cache: 'no-store'
    });
    
    // Xử lý response
    const data = await response.json();
    
    // Kiểm tra response
    if (!response.ok) {
      // Xử lý trường hợp lỗi, ưu tiên lấy message từ response
      const errorMessage = data.message || data.error || 'Không thể lấy danh sách sách đã kích hoạt';
      throw new Error(errorMessage);
    }
    
    // Log dữ liệu để debug
    console.log('Response từ API /api/codes/my-book:', data);
    
    // Kiểm tra cấu trúc dữ liệu
    // Cấu trúc chuẩn là: { data: { data: [...], pagination: {...} }, messages: ..., status_code: ... }
    if (!data.data || !data.data.data) {
      console.error('Cấu trúc dữ liệu từ API không đúng:', data);
      throw new Error('Dữ liệu trả về từ API không đúng định dạng');
    }
    
    // Trả về kết quả - trả về trực tiếp từ API đã xử lý
    return data;
  } catch (error) {
    console.error('Error in getActivatedBooks:', error);
    throw error;
  }
} 