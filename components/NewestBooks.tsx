'use client'
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowUpRightIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// Interface cho dữ liệu sách từ API
interface Book {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  code_id: number;
  description: string;
  user_id: string;
  name: string;
  name_search: string;
  avatar: string;
  quantity: number;
  expiration_date: number;
  active: boolean;
  publishing_house: string;
  subject: string;
  is_file: boolean;
  file_download: null | string;
  xlsx_files: any[];
  is_public: boolean;
  file_code_id_url: string;
  file_code_id_upload_url: string;
  status_add_code_id: string;
  book_tags: BookTag[];
  authors: any[];
}

interface BookTag {
  id: string;
  tag: {
    id: string;
    name: string;
  }
}

interface BooksResponse {
  messages: string;
  data: {
    pagination: {
      current_page: number;
      total_pages: number;
      take: number;
      total: number;
    };
    data: Book[];
  };
  status_code: number;
}

/**
 * Hiển thị các sách mới nhất dạng carousel với hiệu ứng glassmorphism
 */
const NewestBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleBooks, setVisibleBooks] = useState<number>(8);
  
  // Fetch danh sách sách từ API
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Lấy token từ localStorage (nếu có)
        let token = '';
        if (typeof window !== 'undefined') {
          token = localStorage.getItem('accessToken') || '';
        }
        
        // Thiết lập các params để lấy sách mới nhất
        const url = new URL('/api/books', window.location.origin);
        url.searchParams.set('take', '10');  // Lấy 10 sách
        url.searchParams.set('page', '1');
        url.searchParams.set('sort_field', 'created_at');
        url.searchParams.set('sort_type', 'DESC');  // Sắp xếp mới nhất
        
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
          throw new Error(errorData.error || 'Không thể lấy danh sách sách');
        }
        
        const result: BooksResponse = await response.json();
        
        if (result.status_code === 200 && result.messages === 'Success') {
          setBooks(result.data.data);
        } else {
          throw new Error(result.messages || 'Lỗi không xác định');
        }
      } catch (err) {
        console.error('Error fetching books:', err);
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi lấy danh sách sách');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, []);
  
  // Lấy các tag môn học từ một cuốn sách
  const getSubjectTags = (book: Book) => {
    if (!book.book_tags || book.book_tags.length === 0) {
      return book.subject || '';
    }
    
    return book.book_tags.map(tag => tag.tag.name).join(', ');
  };

  return (
    <div className="mt-8 mb-12 relative">
      {/* Background với hiệu ứng gradient mờ */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-green-100/30 to-green-50/20 rounded-xl -z-10"></div>
      
      <div className="p-6 sm:p-8 backdrop-blur-sm rounded-xl border border-green-200/50 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-green-700 flex items-center">
            <span className="inline-block w-2 h-8 bg-green-500 rounded-full mr-2 sm:mr-3"></span>
            Danh sách sách
          </h2>
          <div className="flex gap-2 sm:gap-3 items-center hidden lg:flex">
            <Link href="/book-list" className="mr-2 text-green-600 hover:text-green-700 transition-colors hidden sm:flex items-center">
              <span className="font-medium text-sm">Xem tất cả</span>
              <ArrowUpRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Hiển thị lỗi */}
        {error && (
          <div className="bg-red-100/80 backdrop-blur-sm border border-red-200 text-red-700 p-4 mb-6 rounded-lg" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {/* Hiển thị trạng thái loading */}
        {loading && (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-green-200 border-t-green-600"></div>
          </div>
        )}
        
        {/* Hiển thị khi không có sách */}
        {!loading && books.length === 0 && !error && (
          <div className="text-center text-gray-500 min-h-[200px] flex items-center justify-center backdrop-blur-sm bg-white/30 rounded-xl border border-green-100">
            <p>Không có sách nào.</p>
          </div>
        )}

        {/* Danh sách sách */}
        {!loading && books.length > 0 && (
          <>
            {/* Hiển thị sách dạng lưới với chiều rộng tối ưu hơn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 mx-auto justify-items-center">
              {books.slice(0, visibleBooks).map((book) => (
                <Link href={`/books/${book.id}`} key={book.id} className="w-full max-w-[280px] sm:max-w-[240px] md:max-w-[220px]">
                  <div className="group backdrop-blur-md bg-white/30 rounded-2xl overflow-hidden border-2 border-green-200/70 hover:border-green-300 hover:shadow-xl hover:shadow-green-100/50 hover:bg-white/50 transition-all duration-300 h-full flex flex-col">
                    <div className="relative aspect-[3/3] overflow-hidden bg-white/50 flex items-start justify-center rounded-t-2xl">
                      {book.avatar ? (
                        <div className="w-full h-full pt-0">
                          <div className="relative w-full h-full">
                            <Image
                              src={book.avatar}
                              alt={book.name}
                              fill
                              className="object-contain object-top z-10 group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 640px) 280px, (max-width: 768px) 240px, 220px"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-green-800/60 bg-green-50/50">
                          <span>Không có ảnh</span>
                        </div>
                      )}
                      
                      {/* Tag lớp nằm ở góc phải trên */}
                      {book.book_tags && book.book_tags.length > 0 && book.book_tags.some(tag => tag.tag.name.includes('Lớp')) && (
                        <div className="absolute top-2 right-2 bg-green-600/90 text-white text-xs font-medium px-2 py-0.5 rounded-md backdrop-blur-sm z-20">
                          {book.book_tags.find(tag => tag.tag.name.includes('Lớp'))?.tag.name}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3 flex-1 flex flex-col bg-gradient-to-b from-white/30 to-green-50/30">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1.5 text-green-900/90">{book.name}</h3>
                      <div className="flex gap-1.5 flex-wrap mt-1">
                        <span className="inline-block bg-green-100/70 text-green-700 text-xs px-1.5 py-0.5 rounded-md border border-green-200/50">
                          {book.subject}
                        </span>
                        {book.publishing_house && (
                          <span className="inline-block bg-blue-100/70 text-blue-700 text-xs px-1.5 py-0.5 rounded-md border border-blue-200/50">
                            {book.publishing_house}
                          </span>
                        )}
                      </div>
                      <div className="line-clamp-2 text-xs text-gray-600 mt-2">
                        {book.description ? (
                          <div dangerouslySetInnerHTML={{ 
                            __html: book.description.substring(0, 80) + (book.description.length > 80 ? '...' : '') 
                          }} />
                        ) : (
                          <p>Sách {book.name}</p>
                        )}
                      </div>
                      <div className="mt-auto pt-2 text-right">
                        <span className="text-green-600 text-xs font-medium inline-flex items-center group-hover:text-green-700 transition-colors duration-300">
                          Xem chi tiết
                          <ChevronRight className="w-3.5 h-3.5 ml-0.5 hidden sm:inline group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Nút xem thêm nếu có nhiều sách hơn visibleBooks */}
            {books.length > visibleBooks ? (
              <div className="text-center mt-6">
                <button 
                  onClick={() => setVisibleBooks(prev => prev + 4)}
                  className="px-5 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors inline-flex items-center"
                >
                  Xem thêm sách
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            ) : (
              <div className="text-center mt-6">
                <Link href="/book-list" className="inline-flex items-center justify-center px-5 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors">
                  Xem tất cả sách
                  <ArrowUpRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewestBooks; 