'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, BookOpenIcon, SearchIcon, FilterIcon, ChevronRight } from 'lucide-react';
import { getBooks } from '@/services/bookService';
import { formatDate, sanitizeAndExtractText } from '@/lib/utils';
import { toast } from 'sonner';
import { mockResponseDataListBook } from '@/lib/mockResponseDataListBook';

// Định nghĩa kiểu dữ liệu cho sách
interface Book {
  id: string;
  name: string;
  description: string;
  avatar: string;
  subject: string;
  category: string;
  created_at: string;
  expiration_date: number;
  code_id: number;
}

interface BookCategoryClientProps {
  category: string;
}

const BookCategoryClient = ({ category }: BookCategoryClientProps) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Số sách mỗi trang
  const BOOKS_PER_PAGE = 12;

  // Hàm fetch danh sách sách theo danh mục
  const fetchBooks = async () => {
    try {
      setLoading(true);
      
      // Sử dụng mockData cho giai đoạn phát triển
      // Trong tương lai có thể thay thế bằng API thực tế:
      // const result = await getBooks({
      //   take: 20,
      //   page: 1,
      //   sort_field: 'created_at',
      //   sort_type: 'DESC',
      //   category: category
      // });
      
      // Lọc dữ liệu theo category từ mockData
      const filteredBooks = mockResponseDataListBook.data.filter(
        book => book.category === category
      );
      
      setBooks(filteredBooks);
      setTotalPages(Math.ceil(filteredBooks.length / BOOKS_PER_PAGE));
      
    } catch (err) {
      console.error(`Lỗi khi lấy danh sách sách ${category}:`, err);
      setError(err instanceof Error ? err.message : `Có lỗi xảy ra khi tải danh sách sách ${category}`);
      toast.error(`Không thể tải danh sách sách ${category}`, {
        description: 'Vui lòng thử lại sau'
      });
    } finally {
      setLoading(false);
    }
  };

  // Lọc sách theo từ khóa tìm kiếm
  const filteredBooks = useMemo(() => {
    if (!searchTerm.trim()) return books;
    
    const searchLower = searchTerm.toLowerCase();
    return books.filter(book => 
      book.name.toLowerCase().includes(searchLower) || 
      (book.description && book.description.toLowerCase().includes(searchLower))
    );
  }, [books, searchTerm]);
  
  // Tính toán phân trang
  const displayedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    return filteredBooks.slice(startIndex, startIndex + BOOKS_PER_PAGE);
  }, [filteredBooks, currentPage]);

  // Xử lý khi component mount
  useEffect(() => {
    fetchBooks();
  }, [category]);

  // Xử lý khi filteredBooks thay đổi
  useEffect(() => {
    setTotalPages(Math.ceil(filteredBooks.length / BOOKS_PER_PAGE));
    if (currentPage > Math.ceil(filteredBooks.length / BOOKS_PER_PAGE)) {
      setCurrentPage(1);
    }
  }, [filteredBooks]);

  // Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format tên category cho tiêu đề
  const formatCategoryName = () => {
    if (category === 'OTHER') return 'Sách khác';
    return `Sách ${category}`;
  };

  return (
    <div className="relative mt-8 mb-12">
      {/* Background với hiệu ứng gradient mờ */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-green-100/30 to-green-50/20 rounded-xl -z-10"></div>
      
      <div className="p-6 sm:p-8 backdrop-blur-sm rounded-xl border border-green-200/50 shadow-lg">
        <div className="flex items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-green-700 flex items-center">
            <span className="inline-block w-2 h-8 bg-green-500 rounded-full mr-2 sm:mr-3"></span>
            {formatCategoryName()}
          </h2>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Tìm kiếm ${formatCategoryName().toLowerCase()}...`}
                className="w-full px-4 py-3 pl-10 bg-white/80 backdrop-blur-sm border border-green-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white rounded-md px-3 py-1 text-sm hover:bg-green-600 transition-colors"
              >
                Tìm
              </button>
            </div>
          </form>
        </div>

        {/* Hiển thị lỗi */}
        {error && (
          <div className="bg-red-100/80 backdrop-blur-sm border border-red-200 text-red-700 p-4 mb-6 rounded-lg" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {/* Hiển thị loading */}
        {loading && (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-green-200 border-t-green-600"></div>
          </div>
        )}
        
        {/* Hiển thị khi không có sách */}
        {!loading && displayedBooks.length === 0 && !error && (
          <div className="text-center text-gray-500 min-h-[200px] flex flex-col items-center justify-center backdrop-blur-sm bg-white/30 rounded-xl border border-green-100">
            <Image 
              src="/images/empty-books.svg" 
              alt="Không có sách" 
              width={120} 
              height={120}
              className="mb-4 opacity-70"
            />
            <p>Không tìm thấy sách nào phù hợp với tìm kiếm của bạn.</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Xóa tìm kiếm
            </button>
          </div>
        )}
        
        {/* Danh sách sách */}
        {!loading && displayedBooks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 mx-auto justify-items-center">
            {displayedBooks.map((book) => (
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
                  </div>
                  
                  <div className="p-3 flex-1 flex flex-col bg-gradient-to-b from-white/30 to-green-50/30">
                    <h3 className="font-medium text-sm line-clamp-2 mb-1.5 text-green-900/90">{book.name}</h3>
                    <div className="flex gap-1.5 flex-wrap mt-1">
                      <span className="inline-block bg-green-100/70 text-green-700 text-xs px-1.5 py-0.5 rounded-md border border-green-200/50">
                        {book.subject || 'Khác'}
                      </span>
                    </div>
                    <div className="mt-auto pt-2 text-xs text-gray-500">
                      ID: {book.code_id}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {/* Phân trang */}
        {!loading && filteredBooks.length > BOOKS_PER_PAGE && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-1">
              {/* Nút trang trước */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md border ${
                  currentPage === 1
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-green-200 text-green-600 hover:bg-green-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Nút các trang */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? 'bg-green-500 text-white'
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              {/* Nút trang sau */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md border ${
                  currentPage === totalPages
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-green-200 text-green-600 hover:bg-green-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCategoryClient; 