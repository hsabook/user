import { Book } from '@/types/book';
import { useState, useCallback } from 'react';

export interface ChapterData {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  book_id: string;
  type: string;
  parent_id: null | string;
  title: string;
  title_search: string;
  cover: string | null;
  video: string | null;
  iframe_video?: string | null;
  description: string | null;
  user_id: string;
  updated_by: string | null;
  deleted_by: string | null;
  code_id: string;
  active: boolean;
  order: number;
  active_code_id: boolean;
  attached: any[];
  exam_id: string | null;
  menu_book_questions: any[];
  exam: null | any;
  book: Book;
}

interface ChapterResponse {
  messages: string;
  data: ChapterData;
  status_code: number;
}

/**
 * Hook để lấy thông tin chi tiết chương
 */
export const useChapter = () => {
  const [chapter, setChapter] = useState<ChapterData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Lấy thông tin chi tiết chương
   * @param chapterId ID của chương cần lấy thông tin
   */
  const fetchChapter = useCallback(async (chapterId: string) => {
    if (!chapterId) {
      setError('ID chương không được để trống');
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
      const response = await fetch(`/api/chapters/${chapterId}`, {
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Lỗi khi lấy thông tin chương: ${response.status}`;
        
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

      const data = await response.json() as ChapterResponse;
      
      if (data.status_code === 200 && data.messages === 'Success') {
        setChapter(data.data);
      } else {
        setError(data.messages || 'Có lỗi xảy ra khi lấy thông tin chương');
        setChapter(null);
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin chương:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi lấy thông tin chương');
      setChapter(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    chapter,
    isLoading,
    error,
    fetchChapter
  };
};

export default useChapter; 