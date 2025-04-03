'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CalendarIcon, BookOpenIcon, ClockIcon, ArrowRightIcon, PlusCircleIcon } from 'lucide-react';
import { getActivatedBooks } from '@/services/bookService';
import { formatDate } from '@/lib/utils';
import ActivateIdModal from './ActivateIdModal';
import { toast } from 'sonner';

interface ActivatedBook {
  id: string;
  created_at: string;
  updated_at: string;
  code: string;
  active_by: string;
  book: {
    id: string;
    code_id: number;
    description: string;
    name: string;
    avatar: string;
    expiration_date: number;
    subject: string;
  };
}

interface ActivatedBooksResponse {
  messages: string;
  data: {
    pagination: {
      current_page: number;
      total_pages: number;
      take: number;
      total: number;
    };
    data: ActivatedBook[];
  };
  status_code: number;
}

/**
 * Hiển thị danh sách sách đã kích hoạt với thiết kế glassmorphism
 */
const ActivatedBooks = () => {
  const [books, setBooks] = useState<ActivatedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchActivatedBooks = async () => {
    try {
      setLoading(true);
      const result = await getActivatedBooks({
        sort_field: 'created_at',
        sort_type: 'DESC',
        take: 10,
        page: 1
      });
      
      console.log("API Response trong component:", result);
      
      if (result && result.data && result.data.data && Array.isArray(result.data.data)) {
        console.log("Setting books:", result.data.data);
        setBooks(result.data.data);
      } else {
        console.error("Cấu trúc dữ liệu không hợp lệ:", result);
        setError("Không thể đọc dữ liệu sách từ API. Cấu trúc dữ liệu không đúng.");
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách sách đã kích hoạt:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải danh sách sách.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivatedBooks();
  }, []);

  // Xử lý khi kích hoạt sách thành công
  const handleActivationSuccess = () => {
    toast.success("Sách đã được kích hoạt thành công", {
      description: "Danh sách sách đã được cập nhật"
    });
    // Tải lại danh sách sách sau khi kích hoạt thành công
    fetchActivatedBooks();
  };

  // Hàm tính ngày còn lại đến hạn (dựa trên ngày tạo và thời hạn sử dụng)
  const calculateDaysLeft = (createdAt: string, expirationMonths: number) => {
    const createDate = new Date(createdAt);
    const today = new Date();
    
    // Tính ngày hết hạn: ngày tạo + số tháng sử dụng
    const expireDate = new Date(createDate);
    expireDate.setMonth(expireDate.getMonth() + expirationMonths);
    
    const diffTime = expireDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Hàm tính phần trăm thời gian đã sử dụng
  const calculateTimeProgress = (createdAt: string, expirationMonths: number) => {
    const createDate = new Date(createdAt);
    const today = new Date();
    
    // Tính ngày hết hạn: ngày tạo + số tháng sử dụng
    const expireDate = new Date(createDate);
    expireDate.setMonth(expireDate.getMonth() + expirationMonths);
    
    const totalTime = expireDate.getTime() - createDate.getTime();
    const usedTime = today.getTime() - createDate.getTime();
    
    const percentage = (usedTime / totalTime) * 100;
    return Math.min(Math.max(percentage, 0), 100); // Giới hạn từ 0-100
  };

  // Tính ngày hết hạn từ ngày tạo và số tháng
  const calculateExpiryDate = (createdAt: string, expirationMonths: number) => {
    const createDate = new Date(createdAt);
    const expireDate = new Date(createDate);
    expireDate.setMonth(expireDate.getMonth() + expirationMonths);
    return expireDate.toISOString();
  };

  return (
    <div className="relative mt-8 mb-12">
      {/* Background với hiệu ứng gradient mờ */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-50/80 via-blue-50/30 to-green-50/70 rounded-xl -z-10"></div>
      
      <div className="p-6 backdrop-blur-sm rounded-xl border border-green-100/50 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-2 h-8 bg-green-500 rounded-full mr-3"></div>
            <h2 className="text-2xl font-semibold text-gray-800">Sách đã kích hoạt</h2>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center"
          >
            <PlusCircleIcon className="w-4 h-4 mr-2" />
            Kích hoạt sách mới
          </button>
      </div>

        {/* Hiển thị lỗi */}
        {error && (
          <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm text-red-600 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}
        
        {/* Hiển thị loading */}
        {loading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
          </div>
        )}
        
        {/* Hiển thị khi không có sách */}
        {!loading && books.length === 0 && !error && (
          <div className="text-center text-gray-500 min-h-[200px] flex flex-col items-center justify-center backdrop-blur-sm bg-white/30 rounded-xl border border-green-100">
            <Image 
              src="/images/empty-books.svg" 
              alt="Không có sách" 
              width={120} 
              height={120}
              className="mb-4 opacity-70"
            />
            <p>Bạn chưa kích hoạt sách nào.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Kích hoạt sách ngay
            </button>
          </div>
        )}
        
        {/* Danh sách sách */}
        {!loading && books.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {books.map((activatedBook) => {
              // Tính ngày hết hạn dựa trên ngày kích hoạt và số tháng
              const expiryDate = calculateExpiryDate(activatedBook.created_at, activatedBook.book.expiration_date);
              
              return (
                <Link href={`/books/${activatedBook.book.id}`} key={activatedBook.id} className="group">
                  <div className="h-full backdrop-blur-md bg-white/30 rounded-2xl overflow-hidden border border-green-100/50 hover:shadow-xl hover:border-green-200 hover:bg-white/50 transition-all duration-300 flex flex-col">
                    {/* Book Cover */}
                    <div className="relative h-48 overflow-hidden group">
                      {/* Hiệu ứng glow phía sau hình ảnh */}
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-50/40 via-green-100/20 to-blue-50/30 z-0"></div>
                      
                      {activatedBook.book.avatar ? (
                        <div className="relative w-full h-full flex justify-center items-center p-3">
                          <div className="relative w-[85%] h-[90%] rounded-lg shadow-lg overflow-hidden transform group-hover:scale-105 transition-all duration-500">
                            {/* Tạo đổ bóng trang sách */}
                            <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-gray-300/50 to-transparent z-10"></div>
                            <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-gray-300/40 to-transparent z-10 rounded-b-lg"></div>
                            
                            <Image
                              src={activatedBook.book.avatar}
                              alt={activatedBook.book.name}
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
                      
                      {/* Số ngày còn lại hiển thị ở góc */}
                      <div className="absolute top-3 right-3 bg-green-600/90 text-white text-xs font-medium px-2.5 py-1.5 rounded-full backdrop-blur-sm z-20 flex items-center shadow-md">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        <span>{calculateDaysLeft(activatedBook.created_at, activatedBook.book.expiration_date)} ngày còn lại</span>
                      </div>
                    </div>
                    
                    {/* Book Info */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-semibold text-gray-800 text-lg line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
                        {activatedBook.book.name}
                      </h3>
                      
                      {/* Mã kích hoạt */}
                      <div className="bg-green-50/50 rounded-lg px-3 py-1.5 text-sm text-green-700 inline-flex items-center self-start mb-2">
                        <span className="font-medium mr-1">Mã:</span> {activatedBook.code}
                      </div>
                      
                      {/* Thanh tiến độ sử dụng */}
                      <div className="w-full bg-gray-200/50 rounded-full h-2 my-3">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${calculateTimeProgress(activatedBook.created_at, activatedBook.book.expiration_date)}%` }}
                        ></div>
                      </div>
                      
                      <div className="mt-auto space-y-2">
                        {/* Thông tin môn học */}
                        {activatedBook.book.subject && (
                          <div className="flex items-center text-sm text-gray-600">
                            <BookOpenIcon className="h-4 w-4 mr-2 text-green-600" />
                            <span className="text-gray-700">{activatedBook.book.subject}</span>
                          </div>
                        )}
                        
                        {/* Ngày kích hoạt */}
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-2 text-green-600" />
                          <span className="text-gray-700">Kích hoạt: {formatDate(activatedBook.created_at)}</span>
                        </div>
                        
                        {/* Ngày hết hạn */}
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-2 text-green-600" />
                          <span className="text-gray-700">Hết hạn: {formatDate(expiryDate)}</span>
                        </div>
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
              );
            })}
                  </div>
        )}
      </div>
      
      {/* Modal kích hoạt sách */}
      <ActivateIdModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleActivationSuccess}
      />
    </div>
  );
};

export default ActivatedBooks; 