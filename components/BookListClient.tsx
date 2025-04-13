'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, BookOpenIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { getBooks } from '@/services/bookService';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

// Định nghĩa kiểu dữ liệu cho sách
interface Book {
  id: string;
  name: string;
  description: string;
  avatar: string;
  subject: string;
  created_at: string;
  expiration_date: number;
  code_id: number;
}

const BookListClient = () => {
  const [allBooks, setAllBooks] = useState<Book[]>([]);  // Lưu tất cả sách từ API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  
  // Số sách mỗi trang
  const BOOKS_PER_PAGE = 12;
  
  // Danh sách các môn học để lọc
  const subjects = ['Toán', 'Vật lý', 'Hóa học', 'Sinh học', 'Ngữ văn', 'Lịch sử', 'Địa lý', 'Tiếng Anh'];

  // Hàm fetch danh sách sách (chỉ gọi 1 lần)
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const result = await getBooks({
        take: 100, // Lấy nhiều sách hơn để filter trên client
        page: 1,
        sort_field: 'created_at',
        sort_type: 'DESC'
      });
      
      if (result && result.data && result.data.data) {
        setAllBooks(result.data.data);
      } else {
        setError('Không thể tải danh sách sách');
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách sách:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải danh sách sách');
      toast.error('Không thể tải danh sách sách', {
        description: 'Vui lòng thử lại sau'
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter và tính toán phân trang dựa trên dữ liệu hiện có
  const filteredBooks = useMemo(() => {
    // Áp dụng filter theo search term và subject
    let result = [...allBooks];
    
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(book => 
        book.name.toLowerCase().includes(searchLower) || 
        (book.description && book.description.toLowerCase().includes(searchLower))
      );
    }
    
    if (selectedSubject) {
      result = result.filter(book => book.subject === selectedSubject);
    }
    
    return result;
  }, [allBooks, searchTerm, selectedSubject]);
  
  // Tính toán phân trang
  useEffect(() => {
    // Tính tổng số trang
    setTotalPages(Math.ceil(filteredBooks.length / BOOKS_PER_PAGE));
    
    // Đảm bảo currentPage hợp lệ 
    if (currentPage > Math.ceil(filteredBooks.length / BOOKS_PER_PAGE)) {
      setCurrentPage(1);
    }
  }, [filteredBooks, currentPage]);
  
  // Lấy sách để hiển thị cho trang hiện tại
  const displayedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    return filteredBooks.slice(startIndex, startIndex + BOOKS_PER_PAGE);
  }, [filteredBooks, currentPage]);

  // Xử lý khi component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  // Xử lý thay đổi môn học
  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
  };

  // Xóa bộ lọc
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSubject('');
    setCurrentPage(1);
  };

  return (
    <div className="relative mt-8 mb-12">
      {/* Background với hiệu ứng gradient mờ */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-50/80 via-blue-50/30 to-green-50/70 rounded-xl -z-10"></div>
      
      <div className="p-6 backdrop-blur-sm rounded-xl border border-green-100/50 shadow-lg">
        <div className="flex items-center mb-6">
          <div className="w-2 h-8 bg-green-500 rounded-full mr-3"></div>
          <h2 className="text-2xl font-semibold text-gray-800">Danh sách sách</h2>
        </div>

        {/* Thanh tìm kiếm và bộ lọc */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Tìm kiếm */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm sách..."
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

          {/* Bộ lọc môn học */}
          <div className="flex-shrink-0 md:w-72">
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-4 py-3 pl-10 appearance-none bg-white/80 backdrop-blur-sm border border-green-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Tất cả môn học</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Hiển thị lỗi */}
        {error && (
          <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm text-red-600 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}
        
        {/* Hiển thị loading */}
        {loading && (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
          </div>
        )}
        
        {/* Hiển thị khi không có sách */}
        {!loading && displayedBooks.length === 0 && !error && (
          <div className="text-center text-gray-500 min-h-[300px] flex flex-col items-center justify-center backdrop-blur-sm bg-white/30 rounded-xl border border-green-100">
            <Image 
              src="/images/empty-books.svg" 
              alt="Không có sách" 
              width={120} 
              height={120}
              className="mb-4 opacity-70"
            />
            <p>Không tìm thấy sách nào phù hợp với tìm kiếm của bạn.</p>
            <button 
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
        
        {/* Danh sách sách */}
        {!loading && displayedBooks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayedBooks.map((book) => (
              <Link href={`/books/${book.id}`} key={book.id} className="group">
                <div className="h-full backdrop-blur-md bg-white/30 rounded-2xl overflow-hidden border border-green-100/50 hover:shadow-xl hover:border-green-200 hover:bg-white/50 transition-all duration-300 flex flex-col">
                  {/* Book Cover */}
                  <div className="relative h-48 overflow-hidden">
                    {/* Hiệu ứng glow phía sau hình ảnh */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-50/40 via-green-100/20 to-blue-50/30 z-0"></div>
                    
                    {book.avatar ? (
                      <div className="relative w-full h-full flex justify-center items-center p-3">
                        <div className="relative w-[85%] h-[90%] rounded-lg shadow-lg overflow-hidden transform group-hover:scale-105 transition-all duration-500">
                          {/* Tạo đổ bóng trang sách */}
                          <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-gray-300/50 to-transparent z-10"></div>
                          <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-gray-300/40 to-transparent z-10 rounded-b-lg"></div>
                          
                          <Image
                            src={book.avatar}
                            alt={book.name}
                            fill
                            className="object-cover z-5 border border-gray-200/60 rounded-lg"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          
                          {/* Hiệu ứng phản chiếu ánh sáng */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent z-10 opacity-60 group-hover:opacity-30 transition-opacity duration-500"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-green-800/60 bg-green-50/50">
                        <div className="w-[85%] h-[90%] rounded-lg border border-green-200/50 bg-white/70 flex items-center justify-center shadow-md">
                          <BookOpenIcon className="w-16 h-16 opacity-30 text-green-600" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Book Info */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-800 text-lg line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
                      {book.name}
                    </h3>
                    
                    {/* Môn học */}
                    {book.subject && (
                      <div className="bg-green-50/50 rounded-lg px-3 py-1.5 text-sm text-green-700 inline-flex items-center self-start mb-2">
                        <BookOpenIcon className="h-3.5 w-3.5 mr-1" />
                        <span>{book.subject}</span>
                      </div>
                    )}
                    
                    {/* Mô tả ngắn */}
                    {book.description && (
                      <p className="text-sm text-gray-600 line-clamp-3 mt-2" dangerouslySetInnerHTML={{ __html: book.description }}>
                      </p>
                    )}
                    
                    {/* Ngày tạo */}
                    <div className="mt-auto pt-3 text-sm text-gray-500">
                      Ngày tạo: {formatDate(book.created_at)}
                    </div>
                    
                    {/* Nút xem chi tiết */}
                    <div className="mt-4 pt-3 border-t border-green-100">
                      <div className="text-green-600 text-sm font-medium group-hover:text-green-700 flex items-center justify-between">
                        <span>Xem chi tiết</span>
                        <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {/* Phân trang */}
        {!loading && filteredBooks.length > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                Trang trước
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Hiển thị nhiều nhất 5 trang và giữ trang hiện tại ở giữa nếu có thể
                let pageToShow;
                if (totalPages <= 5) {
                  pageToShow = i + 1;
                } else {
                  // Tính toán để hiển thị trang hiện tại ở giữa
                  const offset = Math.min(Math.max(1, currentPage - 2), totalPages - 4);
                  pageToShow = offset + i;
                }
                
                return (
                  <button
                    key={pageToShow}
                    onClick={() => setCurrentPage(pageToShow)}
                    className={`px-3 py-2 rounded-md ${
                      currentPage === pageToShow
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {pageToShow}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                Trang sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookListClient; 