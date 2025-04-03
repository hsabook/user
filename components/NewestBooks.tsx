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
      
      <div className="p-6 backdrop-blur-sm rounded-xl border border-green-200/50 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-green-700 flex items-center">
            <span className="inline-block w-2 h-8 bg-green-500 rounded-full mr-3"></span>
            Danh sách sách
          </h2>
          <div className="flex gap-3">
            <button 
              onClick={scrollPrev}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 border border-green-300 text-green-700 shadow-sm hover:bg-green-50 hover:shadow transition-all duration-300"
              aria-label="Previous"
              disabled={loading}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={scrollNext}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 border border-green-300 text-green-700 shadow-sm hover:bg-green-50 hover:shadow transition-all duration-300"
              aria-label="Next"
              disabled={loading}
            >
              <ChevronRight size={20} />
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
            className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {books.map((book) => (
              <Link href={`/books/${book.id}`} key={book.id} className="flex-shrink-0 w-64">
                <div className="group backdrop-blur-md bg-white/30 rounded-2xl overflow-hidden border border-green-100/50 hover:shadow-xl hover:border-green-200 hover:bg-white/50 transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden">
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
                      <div className="absolute top-3 right-3 bg-green-600/90 text-white text-xs font-medium px-2 py-1 rounded-md backdrop-blur-sm z-20">
                        {book.book_tags.find(tag => tag.tag.name.includes('Lớp'))?.tag.name}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-800 text-lg line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
                      {book.name}
                    </h3>
                    
                    <div className="mt-auto space-y-2">
                      {book.subject && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span className="text-gray-700">{getSubjectTags(book)}</span>
                        </div>
                      )}
                      
                      {book.publishing_house && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="text-gray-700">{book.publishing_house}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Button xem chi tiết */}
                    <div className="mt-4 pt-3 border-t border-green-100">
                      <div className="text-green-600 text-sm font-medium group-hover:text-green-700 flex items-center justify-between">
                        <span>Xem chi tiết</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
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