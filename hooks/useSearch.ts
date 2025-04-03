import { useState } from 'react';

// Interface cho sách
export interface BookItem {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  code_id: number;
  description: string;
  user_id: string;
  name: string;
  name_search: string;
  avatar: string;
  quantity: number | null;
  expiration_date: number;
  active: boolean;
  publishing_house: string | null;
  subject: string;
  is_file: boolean;
  file_download: string | null;
  xlsx_files: XlsxFile[];
  is_public: boolean;
  file_code_id_url: string;
  file_code_id_upload_url: string;
  status_add_code_id: string;
  _constructor_name_?: string;
}

// Interface cho menu sách (chương/đề)
export interface MenuBookItem {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  book_id: string;
  type: string;
  parent_id: string | null;
  title: string;
  title_search: string;
  cover: string | null;
  video: string | null;
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
  _constructor_name_?: string;
}

// Interface cho câu hỏi
export interface QuestionItem {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  code_id: string;
  video: string | null;
  user_id: string;
  question: string;
  type: string;
  solution: string;
  options: QuestionOption[];
  answers: string[];
  update_by: string | null;
  delete_by: string | null;
  subject: string;
  level: string;
  active: boolean;
  status: string;
  exams_question: any[];
  menu_book_id: string;
  book_id: string;
  _constructor_name_?: string;
}

interface QuestionOption {
  type: string;
  value: string;
  answer: string;
  checked: boolean;
}

interface XlsxFile {
  name: string;
  url: string;
  time: string;
  amount: number;
  timestamp: number;
}

// Union type cho tất cả các loại kết quả tìm kiếm
export type SearchResultItem = BookItem | MenuBookItem | QuestionItem;

// Thêm tags để phân biệt rõ ràng các loại kết quả
export interface TaggedBookItem extends BookItem {
  itemType: 'book';
}

export interface TaggedMenuBookItem extends MenuBookItem {
  itemType: 'menu-book';
}

export interface TaggedQuestionItem extends QuestionItem {
  itemType: 'question';
}

export type TaggedSearchResultItem = TaggedBookItem | TaggedMenuBookItem | TaggedQuestionItem;

// Interface cho response API với cấu trúc mới
interface SearchResponse {
  messages: string;
  data: {
    books: BookItem[];
    menuBooks: MenuBookItem[];
    questions: QuestionItem[];
  };
  status_code: number;
}

/**
 * Custom hook để tìm kiếm sách, ID đề, ID chương, câu hỏi
 */
export const useSearch = () => {
  const [searchResults, setSearchResults] = useState<TaggedSearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Số lượng kết quả theo từng loại
  const [resultCounts, setResultCounts] = useState({
    books: 0,
    menuBooks: 0,
    questions: 0,
    total: 0
  });

  /**
   * Tìm kiếm dựa trên từ khóa
   * @param searchTerm Từ khóa tìm kiếm
   */
  const search = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setError('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      // Lấy token từ localStorage với key đúng là "accessToken"
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
        console.log(`Đã gắn token vào request. Token bắt đầu bằng: ${token.substring(0, 10)}...`);
      } else {
        console.log('Không tìm thấy accessToken trong localStorage. Tìm kiếm sẽ thực hiện mà không có xác thực.');
      }

      // Gọi API tìm kiếm
      const response = await fetch(`/api/books/search?search=${encodeURIComponent(searchTerm)}`, {
        headers,
      });

      // Lưu response status để debug
      console.log(`Tìm kiếm API status: ${response.status}`);

      // Kiểm tra response.ok trước (response.status trong khoảng 200-299)
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Lỗi tìm kiếm: ${response.status}`;
        
        try {
          // Thử parse JSON từ lỗi trả về
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.messages || errorMessage;
          
          // Kiểm tra nếu lỗi liên quan đến xác thực
          if (response.status === 401 || errorMessage.toLowerCase().includes('unauthorized') || errorMessage.toLowerCase().includes('token')) {
            console.error('Lỗi xác thực khi tìm kiếm:', errorMessage);
            errorMessage = 'Vui lòng đăng nhập lại để tiếp tục tìm kiếm';
            // Có thể thêm code để xử lý logout hoặc refresh token ở đây
          }
        } catch (e) {
          // Nếu không parse được JSON, giữ nguyên thông báo lỗi
          console.error('Không thể parse error response:', e);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json() as SearchResponse;
      
      if (data.status_code === 200 && data.messages === 'Success') {
        // Tạo mảng kết hợp từ tất cả các loại kết quả với tag phân biệt
        const taggedBooks = data.data.books.map(book => ({ ...book, itemType: 'book' as const }));
        const taggedMenuBooks = data.data.menuBooks.map(menuBook => ({ ...menuBook, itemType: 'menu-book' as const }));
        const taggedQuestions = data.data.questions.map(question => ({ ...question, itemType: 'question' as const }));
        
        // Kết hợp các kết quả
        const allResults = [
          ...taggedBooks,
          ...taggedMenuBooks,
          ...taggedQuestions
        ];
        
        // Lưu số lượng kết quả theo từng loại
        const counts = {
          books: taggedBooks.length,
          menuBooks: taggedMenuBooks.length,
          questions: taggedQuestions.length,
          total: allResults.length
        };
        
        setResultCounts(counts);
        setSearchResults(allResults);
      } else {
        setError(data.messages || 'Có lỗi xảy ra khi tìm kiếm');
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Lỗi khi tìm kiếm:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tìm kiếm');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    search,
    searchResults,
    resultCounts,
    isLoading,
    error
  };
};

export default useSearch; 