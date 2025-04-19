import { CommentResponse, CommentQueryParams } from '@/types/comment';

// URL gốc API
const API_BASE_URL = 'https://api.hsabook.vn';

/**
 * Lấy danh sách comment với các tham số lọc
 * @param params Các tham số lọc và phân trang
 * @returns Promise chứa dữ liệu comment theo phân trang
 */
export async function getComments(params?: CommentQueryParams): Promise<CommentResponse> {
  try {
    // Tạo URL với query params
    const url = new URL('/comment', API_BASE_URL);
    
    if (params) {
      if (params.page) url.searchParams.set('page', params.page.toString());
      if (params.limit) url.searchParams.set('limit', params.limit.toString());
      if (params.book_id) url.searchParams.set('book_id', params.book_id);
      if (params.menu_book_id) url.searchParams.set('menu_book_id', params.menu_book_id);
      if (params.question_id) url.searchParams.set('question_id', params.question_id);
    }

    // Lấy access token từ localStorage (nếu có)
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('accessToken') || '';
    }

    // Headers cho request
    const headers: HeadersInit = {
      'accept': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Gọi API với URL chính thức
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || 'Không thể lấy danh sách bình luận');
    }

    const result: CommentResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Error in commentService.getComments:', error);
    throw error;
  }
}

/**
 * Tạo một comment mới
 * @param data Dữ liệu comment cần tạo
 * @returns Promise chứa dữ liệu comment đã tạo
 */
export async function createComment(data: {
  content: string;
  book_id?: string;
  menu_book_id?: string;
  question_id?: string;
  parent_id?: string;
}) {
  try {
    // Lấy access token từ localStorage (nếu có)
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('accessToken') || '';
    }

    if (!token) {
      throw new Error('Bạn cần đăng nhập để tạo bình luận');
    }

    // Headers cho request
    const headers: HeadersInit = {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    };

    headers['Authorization'] = `Bearer ${token}`;

    // Gọi API với URL chính thức
    const response = await fetch(`${API_BASE_URL}/comment`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || 'Không thể tạo bình luận');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in commentService.createComment:', error);
    throw error;
  }
} 