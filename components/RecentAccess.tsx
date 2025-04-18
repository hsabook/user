"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronRight, Plus, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import BannerSlider from './BannerSlider';
import { getRecentVisits } from '@/services/userService';
import { Book } from '@/types/book';
import { useModal } from '@/contexts/ModalContext';

type RecentItemProps = {
  book: Book;
};

const RecentItem = ({ book }: RecentItemProps) => {
  // Tìm môn học từ book_tags
  const subjectTag = book.book_tags.find(tag => tag.tag.name === book.subject);
  // Tìm khối lớp từ book_tags (thường sẽ có "Lớp X" trong name)
  const gradeTag = book.book_tags.find(tag => tag.tag.name.includes('Lớp'));

  return (
    <Link href={`/books/${book.id}`} className="glassmorphism-card block h-full w-[200px] sm:w-[220px] md:w-[240px] flex-shrink-0">
      <div className="flex flex-col p-4 h-full">
        <div className="w-full h-[180px] sm:h-[200px] relative rounded-lg overflow-hidden mb-3 bg-white/80">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-50/20 to-white/20 z-0"></div>
          
          <div className="relative w-full h-full flex justify-center items-center p-3">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image 
                src={book.avatar} 
                alt={book.name}
                width={160}
                height={200}
                className="max-h-full max-w-full object-contain drop-shadow-md transition-all duration-300 hover:scale-105 rounded-lg"
                style={{ objectFit: 'contain' }}
                onError={(e) => {
                  // Fallback image nếu hình chính không load được
                  const target = e.target as HTMLImageElement;
                  target.src = '/book-placeholder.jpg';
                }}
              />
            </div>
          </div>
        </div>
        <div className="w-full flex-1 flex flex-col">
          <h3 className="text-base font-medium line-clamp-2 mb-2">{book.name}</h3>
          <div className="flex items-center mt-1 flex-wrap gap-1.5">
            <div className="course-item-tag subject text-xs px-2 py-0.5">
              {book.subject}
            </div>
            {gradeTag && (
              <div className="course-item-tag grade text-xs px-2 py-0.5">
                {gradeTag.tag.name}
              </div>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-600 line-clamp-2 flex-1">
            {book.description ? (
              <div dangerouslySetInnerHTML={{ __html: book.description.substring(0, 70) + '...' }} />
            ) : (
              <p>Sách {book.name} - {book.subject}</p>
            )}
          </div>
          <div className="mt-2 pt-2 border-t border-green-100 text-green-600 text-xs font-medium flex items-center">
            <span>Xem chi tiết</span>
            <ChevronRight className="w-3 h-3 ml-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};

const RecentAccess = () => {
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { openActivateModal } = useModal();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Hàm scroll sang trái
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const newPosition = Math.max(scrollPosition - 250, 0);
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  // Hàm scroll sang phải
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const newPosition = Math.min(scrollPosition + 250, maxScroll);
      
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      
      setScrollPosition(newPosition);
    }
  };

  useEffect(() => {
    const fetchRecentBooks = async () => {
      try {
        setIsLoading(true);
        const response = await getRecentVisits();
        setRecentBooks(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching recent books:', err);
        setError('Bạn cần đăng nhập để xem danh sách sách truy cập gần đây');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentBooks();
  }, []);

  return (
    <div className="mb-6 sm:mb-8">
      <div className="sidebar-section p-0 mb-4 sm:mb-6">
        <BannerSlider />
      </div>
      
      <div className="sidebar-section p-3 sm:p-6">
        <div className="dot-pattern"></div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-medium">Truy cập gần đây</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={scrollLeft}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-green-50 border border-green-200 text-green-600 shadow-sm hover:bg-green-100 hover:shadow transition-all duration-300"
              aria-label="Scroll trái"
              disabled={scrollPosition <= 0}
              style={{ opacity: scrollPosition <= 0 ? 0.5 : 1 }}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={scrollRight}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-green-50 border border-green-200 text-green-600 shadow-sm hover:bg-green-100 hover:shadow transition-all duration-300"
              aria-label="Scroll phải"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="animate-pulse flex gap-4 overflow-hidden pb-2">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="glassmorphism-card h-full w-[200px] flex-shrink-0">
                <div className="flex flex-col p-4 h-full">
                  <div className="w-full h-[180px] bg-gray-200/50 rounded-lg mb-3"></div>
                  <div className="h-5 bg-gray-200/50 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200/50 rounded w-1/2 mb-3"></div>
                  <div className="h-3 bg-gray-200/50 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="sidebar-section-content p-3 sm:p-4 text-red-600 text-sm sm:text-base">
            {error}
          </div>
        ) : recentBooks.length === 0 ? (
          <div className="sidebar-section-content p-3 sm:p-4 text-blue-600 text-sm sm:text-base">
            Bạn chưa có sách nào được truy cập gần đây.
          </div>
        ) : (
          <div className="relative">
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-3 hide-scrollbar" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {recentBooks.map((book) => (
                <RecentItem key={book.id} book={book} />
              ))}
            </div>
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

export default RecentAccess; 