"use client";

import { useState, useEffect, useRef } from 'react';
import { Book } from '@/types/book';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { mockTSA } from '@/lib/mockResponseDataCategories';

// Book item component
const BookItem = ({ book }: { book: Book }) => {
  // Tìm môn học từ book_tags
  const subjectTag = book.book_tags?.find(tag => tag.tag.name === book.subject);
  // Tìm khối lớp từ book_tags (thường sẽ có "Lớp X" trong name)
  const gradeTag = book.book_tags?.find(tag => tag.tag.name?.includes('Lớp'));

  return (
    <Link href={`/books/${book.id}`} className="block w-[220px] flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border-[1px] border-green-400">
      <div className="flex flex-col h-full">
        <div className="w-full h-[220px] relative overflow-hidden bg-[#6440fb]">
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

export default function TSABookSection() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Ref cho scroll container
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // State để lưu vị trí scroll
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // Giả lập việc lấy dữ liệu từ API
    setTimeout(() => {
      setBooks(mockTSA.data as any);
      setIsLoading(false);
    }, 500);
  }, []);

  // Hàm scroll sang trái
  const scrollLeft = () => {
    if (scrollRef.current) {
      const newPosition = Math.max(scrollPosition - 250, 0);
      scrollRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  // Hàm scroll sang phải
  const scrollRight = () => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const newPosition = Math.min(scrollPosition + 250, maxScroll);
      
      scrollRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      
      setScrollPosition(newPosition);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Sách đánh giá tư duy TSA</h2>
        <Link href="/books/tsa" className="text-[#1ab69d] hover:underline text-sm flex items-center">
          Xem tất cả
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="relative">
        <div className="flex items-center absolute top-1/2 -left-4 -translate-y-1/2 z-10">
          <button 
            onClick={scrollLeft}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 shadow-sm hover:bg-gray-50"
            aria-label="Scroll trái"
            disabled={scrollPosition <= 0}
            style={{ opacity: scrollPosition <= 0 ? 0.5 : 1 }}
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
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-5 hide-scrollbar" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {books.map((book) => (
              <BookItem key={book.id} book={book} />
            ))}
          </div>
        )}

        <div className="flex items-center absolute top-1/2 -right-4 -translate-y-1/2 z-10">
          <button 
            onClick={scrollRight}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 shadow-sm hover:bg-gray-50"
            aria-label="Scroll phải"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
} 