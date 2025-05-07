"use client";

import { useState, useEffect, useRef } from 'react';
import { Book } from '@/types/book';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { mockHSAChuyenDe, mockHSALuyenDe } from '@/lib/mockResponseDataCategories';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Book item component thực hiện cùng dạng với RecentItem
const BookItem = ({ book }: { book: Book }) => {
  // Tìm môn học từ book_tags
  const subjectTag = book.book_tags?.find(tag => tag.tag.name === book.subject);
  // Tìm khối lớp từ book_tags (thường sẽ có "Lớp X" trong name)
  const gradeTag = book.book_tags?.find(tag => tag.tag.name?.includes('Lớp'));

  return (
    <Link href={`/books/${book.id}`} className="block w-[220px] flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border-[1px] border-green-400">
      <div className="flex flex-col h-full">
        <div className="w-full h-[220px] relative overflow-hidden bg-[#00b88c]">
          <Image 
            src={book.avatar || '/book-placeholder.jpg'} 
            alt={book.name}
            fill
            className="object-cover transition-all duration-300 hover:scale-105"
            onError={(e) => {
              // Fallback image nếu hình chính không load được
              const target = e.target as HTMLImageElement;
              target.src = '/book-placeholder.jpg';
            }}
          />
        </div>
        <div className="p-3 bg-white flex flex-col h-[220px]">
          <h3 className="text-base font-medium text-center mb-2 line-clamp-2 min-h-[48px]">{book.name}</h3>
          
          {/* Thêm description của sách */}
          <div className="text-sm text-gray-600 mb-3 line-clamp-2 text-center min-h-[40px]">
            {book.description ? (
              <div dangerouslySetInnerHTML={{ 
                __html: book.description.substring(0, 80) + (book.description.length > 80 ? '...' : '') 
              }} />
            ) : (
              <p>Sách {book.name}</p>
            )}
          </div>
          
          <div className="text-center mb-3">
            <span className="inline-block bg-[#e7f8ee] text-[#1ab69d] text-sm px-3 py-1 rounded-full">
              {book.subject || "Không xác định"}
            </span>
          </div>
          <div className="mt-auto pb-1 flex justify-center">
            <div className="text-[#1ab69d] border border-[#1ab69d] hover:bg-[#1ab69d] hover:text-white transition-colors rounded-full px-4 py-1 text-sm font-medium flex items-center gap-1">
              Xem chi tiết
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function HSABookSection() {
  const [chuyenDeBooks, setChuyenDeBooks] = useState<Book[]>([]);
  const [luyenDeBooks, setLuyenDeBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs cho scroll container
  const chuyenDeScrollRef = useRef<HTMLDivElement>(null);
  const luyenDeScrollRef = useRef<HTMLDivElement>(null);
  
  // State để lưu vị trí scroll
  const [chuyenDeScrollPosition, setChuyenDeScrollPosition] = useState(0);
  const [luyenDeScrollPosition, setLuyenDeScrollPosition] = useState(0);

  useEffect(() => {
    // Giả lập việc lấy dữ liệu từ API
    setTimeout(() => {
      setChuyenDeBooks(mockHSAChuyenDe.data as any);
      setLuyenDeBooks(mockHSALuyenDe.data as any);
      setIsLoading(false);
    }, 500);
  }, []);

  // Hàm scroll sang trái cho chuyên đề
  const scrollLeftChuyenDe = () => {
    if (chuyenDeScrollRef.current) {
      const newPosition = Math.max(chuyenDeScrollPosition - 250, 0);
      chuyenDeScrollRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setChuyenDeScrollPosition(newPosition);
    }
  };

  // Hàm scroll sang phải cho chuyên đề
  const scrollRightChuyenDe = () => {
    if (chuyenDeScrollRef.current) {
      const { scrollWidth, clientWidth } = chuyenDeScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const newPosition = Math.min(chuyenDeScrollPosition + 250, maxScroll);
      
      chuyenDeScrollRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      
      setChuyenDeScrollPosition(newPosition);
    }
  };

  // Hàm scroll sang trái cho luyện đề
  const scrollLeftLuyenDe = () => {
    if (luyenDeScrollRef.current) {
      const newPosition = Math.max(luyenDeScrollPosition - 250, 0);
      luyenDeScrollRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setLuyenDeScrollPosition(newPosition);
    }
  };

  // Hàm scroll sang phải cho luyện đề
  const scrollRightLuyenDe = () => {
    if (luyenDeScrollRef.current) {
      const { scrollWidth, clientWidth } = luyenDeScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const newPosition = Math.min(luyenDeScrollPosition + 250, maxScroll);
      
      luyenDeScrollRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      
      setLuyenDeScrollPosition(newPosition);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Sách đánh giá năng lực HSA</h2>
        <Link href="/books/hsa" className="text-[#1ab69d] hover:underline text-sm flex items-center">
          Xem tất cả
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <Tabs defaultValue="chuyen-de" className="w-full">
        <TabsList className="mb-4 bg-transparent border-b border-gray-200 w-full justify-start gap-4">
          <TabsTrigger value="chuyen-de" className="data-[state=active]:border-b-2 data-[state=active]:border-[#1ab69d] data-[state=active]:text-[#1ab69d] rounded-none bg-transparent px-6 py-2">Bộ sách chuyên đề</TabsTrigger>
          <TabsTrigger value="luyen-de" className="data-[state=active]:border-b-2 data-[state=active]:border-[#1ab69d] data-[state=active]:text-[#1ab69d] rounded-none bg-transparent px-6 py-2">Bộ sách luyện đề</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chuyen-de">
          <div className="relative">
            <div className="flex items-center absolute top-1/2 -left-4 -translate-y-1/2 z-10">
              <button 
                onClick={scrollLeftChuyenDe}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 shadow-sm hover:bg-gray-50"
                aria-label="Scroll trái"
                disabled={chuyenDeScrollPosition <= 0}
                style={{ opacity: chuyenDeScrollPosition <= 0 ? 0.5 : 1 }}
              >
                <ChevronLeft size={16} />
              </button>
            </div>

            {isLoading ? (
              <div className="animate-pulse flex gap-6 overflow-hidden pb-2">
                {[1, 2, 3, 4].map((_, index) => (
                  <div key={index} className="w-[220px] flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-sm">
                    <div className="w-full h-[220px] bg-gray-200"></div>
                    <div className="p-3 h-[140px]">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-1/2 mx-auto mb-3"></div>
                      <div className="h-8 bg-gray-200 rounded-full w-3/4 mx-auto mt-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div 
                ref={chuyenDeScrollRef}
                className="flex gap-6 overflow-x-auto pb-5 hide-scrollbar" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {chuyenDeBooks.map((book) => (
                  <BookItem key={book.id} book={book} />
                ))}
              </div>
            )}

            <div className="flex items-center absolute top-1/2 -right-4 -translate-y-1/2 z-10">
              <button 
                onClick={scrollRightChuyenDe}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 shadow-sm hover:bg-gray-50"
                aria-label="Scroll phải"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="luyen-de">
          <div className="relative">
            <div className="flex items-center absolute top-1/2 -left-4 -translate-y-1/2 z-10">
              <button 
                onClick={scrollLeftLuyenDe}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 shadow-sm hover:bg-gray-50"
                aria-label="Scroll trái"
                disabled={luyenDeScrollPosition <= 0}
                style={{ opacity: luyenDeScrollPosition <= 0 ? 0.5 : 1 }}
              >
                <ChevronLeft size={16} />
              </button>
            </div>

            {isLoading ? (
              <div className="animate-pulse flex gap-6 overflow-hidden pb-2">
                {[1, 2, 3, 4].map((_, index) => (
                  <div key={index} className="w-[220px] flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-sm">
                    <div className="w-full h-[220px] bg-gray-200"></div>
                    <div className="p-3 h-[140px]">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-1/2 mx-auto mb-3"></div>
                      <div className="h-8 bg-gray-200 rounded-full w-3/4 mx-auto mt-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div 
                ref={luyenDeScrollRef}
                className="flex gap-6 overflow-x-auto pb-5 hide-scrollbar" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {luyenDeBooks.map((book) => (
                  <BookItem key={book.id} book={book} />
                ))}
              </div>
            )}

            <div className="flex items-center absolute top-1/2 -right-4 -translate-y-1/2 z-10">
              <button 
                onClick={scrollRightLuyenDe}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 shadow-sm hover:bg-gray-50"
                aria-label="Scroll phải"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}