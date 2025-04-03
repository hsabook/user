"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronRight, Plus } from 'lucide-react';
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
    <Link href={`/books/${book.id}`} className="glassmorphism-card block">
      <div className="flex items-center p-4">
        <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-lg overflow-hidden mr-4 shadow-sm">
          <Image 
            src={book.avatar} 
            alt={book.name} 
            fill 
            className="object-cover hover:scale-105 transition-transform duration-500" 
            onError={(e) => {
              // Fallback image nếu hình chính không load được
              const target = e.target as HTMLImageElement;
              target.src = '/book-placeholder.jpg';
            }}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium">{book.name}</h3>
          <div className="flex items-center mt-2 flex-wrap">
            <div className="course-item-tag subject mb-1">
              {book.subject}
            </div>
            {gradeTag && (
              <div className="course-item-tag grade">
                {gradeTag.tag.name}
              </div>
            )}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {book.description ? (
              <div dangerouslySetInnerHTML={{ __html: book.description.substring(0, 60) + '...' }} />
            ) : (
              <p>Sách {book.name} - {book.subject}</p>
            )}
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

  useEffect(() => {
    const fetchRecentBooks = async () => {
      try {
        setIsLoading(true);
        const response = await getRecentVisits();
        setRecentBooks(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching recent books:', err);
        setError('Không thể tải danh sách sách truy cập gần đây');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentBooks();
  }, []);

  return (
    <div className="mb-8">
      <div className="sidebar-section p-0 mb-6">
        <BannerSlider />
      </div>
      
      <div className="sidebar-section p-5">
        <div className="dot-pattern"></div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium">Truy cập gần đây</h2>
          <div className="flex items-center">
            <Link href="/activated-books" className="flex items-center text-amber-500 hover:text-amber-600 transition-colors">
              <span className="text-xs">Xem tất cả</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((_, index) => (
              <div key={index} className="glassmorphism-card animate-pulse">
                <div className="flex items-center p-4">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-200/50 rounded-lg mr-4"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200/50 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200/50 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200/50 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="sidebar-section-content p-4 text-red-600">
            {error}
          </div>
        ) : recentBooks.length === 0 ? (
          <div className="sidebar-section-content p-4 text-blue-600">
            Bạn chưa có sách nào được truy cập gần đây.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentBooks.map((book) => (
              <RecentItem key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentAccess; 