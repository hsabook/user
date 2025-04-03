import { RecentVisitsResponse } from '@/types/user';

/**
 * Lấy danh sách sách truy cập gần đây của người dùng
 */
export async function getRecentVisits(): Promise<RecentVisitsResponse> {
  try {
    // Lấy token từ localStorage (nếu có)
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('accessToken') || '';
    }
    
    if (!token) {
      throw new Error('Bạn cần đăng nhập để xem danh sách sách truy cập gần đây');
    }
    
    // Headers cho request
    const headers: HeadersInit = {
      'accept': '*/*'
    };
    
    headers['Authorization'] = `Bearer ${token}`;
    
    // Gọi API local
    const response = await fetch('/api/users/recent-visits', {
      method: 'GET',
      headers,
      cache: 'no-store'
    });
    
    // Xử lý response
    const data = await response.json();
    
    // Kiểm tra response
    if (!response.ok) {
      // Xử lý trường hợp lỗi, ưu tiên lấy message từ response
      const errorMessage = data.message || data.error || 'Không thể lấy danh sách sách truy cập gần đây';
      throw new Error(errorMessage);
    }
    
    // Trả về kết quả
    return data;
  } catch (error) {
    console.error('Error in getRecentVisits:', error);
    throw error;
  }
} 