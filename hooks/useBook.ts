import { useState, useCallback } from 'react';

export interface BookTag {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  book_id: string;
  tag_id: string;
  user_id: null | string;
  tag: {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: null | string;
    description: null | string;
    user_id: null | string;
    updated_by: null | string;
    deleted_by: null | string;
    name: string;
    name_search: null | string;
    avatar: null | string;
    parent_id: null | string;
    _constructor_name_?: string;
  };
  _constructor_name_?: string;
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  // Thêm các trường khác nếu cần
}

export interface BookData {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  code_id: number;
  description: string;
  user_id: string;
  name: string;
  name_search: string;
  avatar: string | null;
  quantity: null | number;
  expiration_date: number;
  active: boolean;
  publishing_house: null | string;
  subject: string;
  is_file: boolean;
  file_download: null | string;
  xlsx_files: Array<{
    name: string;
    url: string;
    time: string;
    amount: number;
    timestamp: number;
  }>;
  is_public: boolean;
  file_code_id_url: string;
  file_code_id_upload_url: string;
  status_add_code_id: string;
  book_tags: BookTag[];
  authors: Author[];
  _constructor_name_?: string;
}

interface BookResponse {
  messages: string;
  data: BookData;
  status_code: number;
}

/**
 * Hook để lấy thông tin chi tiết sách
 */
export const useBook = () => {
  const [book, setBook] = useState<BookData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Lấy thông tin chi tiết sách
   * @param bookId ID của sách cần lấy thông tin
   */
  const fetchBook = useCallback(async (bookId: string) => {
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

      // Gọi API
      const response = await fetch(`/api/books/${bookId}`, {
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Lỗi khi lấy thông tin sách: ${response.status}`;
        
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

      const data = await response.json() as BookResponse;
      
      if (data.status_code === 200 && data.messages === 'Success') {
        setBook(data.data);
      } else {
        setError(data.messages || 'Có lỗi xảy ra khi lấy thông tin sách');
        setBook(null);
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin sách:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi lấy thông tin sách');
      setBook(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    book,
    isLoading,
    error,
    fetchBook
  };
};

export default useBook; 