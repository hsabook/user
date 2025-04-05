'use client'
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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

  const scrollNext = () => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const nextPosition = Math.min(scrollPosition + 300, maxScroll);
      
      scrollContainerRef.current.scrollTo({
        left: nextPosition,
        behavior: 'smooth'
      });
      
      setScrollPosition(nextPosition);
    }
  };

  const scrollPrev = () => {
    if (scrollContainerRef.current) {
      const prevPosition = Math.max(scrollPosition - 300, 0);
      
      scrollContainerRef.current.scrollTo({
        left: prevPosition,
        behavior: 'smooth'
      });
      
      setScrollPosition(prevPosition);
    }
  };
  
  // Lấy các tag môn học từ một cuốn sách
  const getSubjectTags = (book: Book) => {
    if (!book.book_tags || book.book_tags.length === 0) {
      return book.subject || '';
    }
    
    return book.book_tags.map(tag => tag.tag.name).join(', ');
  };

  return (
    <div className="mt-12 mb-10 relative">
      {/* Background với hiệu ứng gradient mờ */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-green-100/30 to-green-50/20 rounded-xl -z-10"></div>
      
      <div className="p-4 sm:p-6 backdrop-blur-sm rounded-xl border border-green-200/50 shadow-lg">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-green-700 flex items-center">
            <span className="inline-block w-2 h-8 bg-green-500 rounded-full mr-2 sm:mr-3"></span>
            Danh sách sách
          </h2>
          <div className="flex gap-2 sm:gap-3">
            <button 
              onClick={scrollPrev}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/80 border border-green-300 text-green-700 shadow-sm hover:bg-green-50 hover:shadow transition-all duration-300"
              aria-label="Previous"
              disabled={loading}
            >
              <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button 
              onClick={scrollNext}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/80 border border-green-300 text-green-700 shadow-sm hover:bg-green-50 hover:shadow transition-all duration-300"
              aria-label="Next"
              disabled={loading}
            >
              <ChevronRight size={18} className="sm:w-5 sm:h-5" />
            </button>
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
          <div 
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-5 overflow-x-auto pb-4 hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {books.map((book) => (
              <Link href={`/books/${book.id}`} key={book.id} className="flex-shrink-0 w-48 sm:w-64">
                <div className="group backdrop-blur-md bg-white/30 rounded-2xl overflow-hidden border border-green-100/50 hover:shadow-xl hover:border-green-200 hover:bg-white/50 transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-48 sm:h-64 overflow-hidden">
                    {book.avatar ? (
                      <>
                        {/* Hiệu ứng glow phía sau hình ảnh */}
                        <div className="absolute inset-0 bg-gradient-to-b from-green-300/20 to-transparent z-0"></div>
                        <Image
                          src={book.avatar}
                          alt={book.name}
                          fill
                          className="object-contain z-10 group-hover:scale-105 transition-transform duration-300"
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-green-800/60 bg-green-50/50">
                        <span>Không có ảnh</span>
                      </div>
                    )}
                    
                    {/* Tag lớp nằm ở góc phải trên */}
                    {book.book_tags && book.book_tags.length > 0 && book.book_tags.some(tag => tag.tag.name.includes('Lớp')) && (
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-green-600/90 text-white text-xs font-medium px-2 py-0.5 sm:py-1 rounded-md backdrop-blur-sm z-20">
                        {book.book_tags.find(tag => tag.tag.name.includes('Lớp'))?.tag.name}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 sm:p-4 flex-1 flex flex-col">
                    <h3 className="font-medium text-sm sm:text-base line-clamp-2 mb-1 sm:mb-2">{book.name}</h3>
                    <div className="flex gap-1 sm:gap-2 flex-wrap mt-1">
                      <span className="inline-block bg-green-100 text-green-700 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-md">
                        {book.subject}
                      </span>
                      {book.publishing_house && (
                        <span className="inline-block bg-blue-100 text-blue-700 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-md">
                          {book.publishing_house}
                        </span>
                      )}
                    </div>
                    <div className="line-clamp-2 text-xs sm:text-sm text-gray-600 mt-2">
                      {book.description ? (
                        <div dangerouslySetInnerHTML={{ 
                          __html: book.description.substring(0, 60) + (book.description.length > 60 ? '...' : '') 
                        }} />
                      ) : (
                        <p>Sách {book.name}</p>
                      )}
                    </div>
                    <div className="mt-auto pt-2 sm:pt-3 text-right">
                      <span className="text-green-600 text-xs sm:text-sm font-medium inline-flex items-center">
                        Xem chi tiết
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default NewestBooks; 