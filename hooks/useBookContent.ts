import { useState, useEffect, useCallback } from 'react';

export interface MenuBookChild {
  id: string;
  created_at: string;
  updated_at: string;
  book_id: string;
  type: string;
  parent_id: string;
  title: string;
  cover: string | null;
  code_id: string;
  active: boolean;
  order: number;
  exam_id: string | null;
  exam: {
    id: string;
    file_download: string | null;
    _constructor_name_?: string;
  } | null;
  children: MenuBookChild[];
}

export interface MenuBookItem {
  id: string;
  created_at: string;
  updated_at: string;
  book_id: string;
  type: string;
  parent_id: string | null;
  title: string;
  cover: string | null;
  code_id: string;
  active: boolean;
  order: number;
  exam_id: string | null;
  is_mybook?: boolean;
  exam: {
    id: string;
    file_download: string | null;
    _constructor_name_?: string;
  } | null;
  children: MenuBookChild[];
}

interface BookContentResponse {
  messages: string;
  data: {
    pagination: {
      current_page: number;
      total_pages: number;
      take: number;
      total: number;
    };
    data: MenuBookItem[];
  };
  status_code: number;
}

interface BookContentOptions {
  page?: number;
  take?: number;
  sort_field?: 'order' | 'created_at' | 'title';
  sort_type?: 'ASC' | 'DESC';
}

/**
 * Hook để lấy danh sách nội dung sách (chương, đề)
 */
export const useBookContent = () => {
  const [bookContent, setBookContent] = useState<MenuBookItem[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    take: 10,
    total: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Lấy danh sách nội dung sách
   * @param bookId ID của sách
   * @param options Các tùy chọn như phân trang, sắp xếp
   */
  const fetchBookContent = useCallback(async (bookId: string, options: BookContentOptions = {}) => {
    if (!bookId) {
      setError('ID sách không được để trống');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Lấy token từ localStorage
      let token = null;
      
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('accessToken');
        // Thử các key khác nếu không tìm thấy token
        if (!token) {
          const possibleTokenKeys = ['token', 'jwt', 'auth_token', 'bearer_token'];
          for (const key of possibleTokenKeys) {
            const possibleToken = localStorage.getItem(key);
            if (possibleToken) {
              console.log(`Không tìm thấy 'accessToken' nhưng tìm thấy token trong '${key}'`);
              token = possibleToken;
              break;
            }
          }
        }
      }
      
      // Chuẩn bị headers
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Chuẩn bị URL với các tùy chọn
      const { page = 1, take = 10, sort_field = 'order', sort_type = 'ASC' } = options;
      const url = `/api/books/menu-book?book_id=${encodeURIComponent(bookId)}&page=${page}&take=${take}&sort_field=${sort_field}&sort_type=${sort_type}`;
      
      // Gọi API
      const response = await fetch(url, {
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Lỗi khi lấy nội dung sách: ${response.status}`;
        
        try {
          // Thử parse JSON từ lỗi trả về
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.messages || errorMessage;
        } catch (e) {
          // Nếu không parse được JSON, giữ nguyên thông báo lỗi
          console.error('Không thể parse error response:', e);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json() as BookContentResponse;
      
      if (data.status_code === 200 && data.messages === 'Success') {
        setBookContent(data.data.data);
        setPagination({
          currentPage: data.data.pagination.current_page,
          totalPages: data.data.pagination.total_pages,
          take: data.data.pagination.take,
          total: data.data.pagination.total
        });
      } else {
        setError(data.messages || 'Có lỗi xảy ra khi lấy nội dung sách');
        setBookContent([]);
      }
    } catch (err) {
      console.error('Lỗi khi lấy nội dung sách:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi lấy nội dung sách');
      setBookContent([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this function won't be recreated

  return {
    bookContent,
    pagination,
    isLoading,
    error,
    fetchBookContent
  };
};

export default useBookContent; 