"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Book } from '@/types/book';
import { getBooks } from '@/services/bookService';

type BookWithTrend = Book & {
  trendType: 'up' | 'down' | 'stable';
};

/**
 * Individual course item component
 */
const CourseItem = ({ id, name, avatar, book_tags, trendType }: BookWithTrend) => {
  // Lấy môn học và lớp từ book_tags
  const subject = book_tags.find(tag => tag.tag.name === 'Toán' 
                              || tag.tag.name === 'Văn' 
                              || tag.tag.name === 'Anh'
                              || tag.tag.name === 'Lý'
                              || tag.tag.name === 'Hóa'
                              || tag.tag.name === 'Sinh')?.tag.name || '';
  const grade = book_tags.find(tag => tag.tag.name.includes('Lớp'))?.tag.name || '';

  // Instructor sẽ hiện là môn học
  const instructor = subject || 'Chung';

  return (
    <Link href={`/books/${id}`}>
      <div className="course-item">
        <div className="course-item-image w-8 h-8 sm:w-10 sm:h-10">
          <Image 
            src={avatar || '/book-placeholder.jpg'} 
            alt={name} 
            fill 
            className="object-cover"
            onError={(e) => {
              // Fallback image nếu avatar không load được
              const target = e.target as HTMLImageElement;
              target.src = '/book-placeholder.jpg';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-xs sm:text-sm line-clamp-1">{name}</h3>
          <div className="flex items-center mt-1 flex-wrap gap-1">
            <div className="course-item-tag subject text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-0.5">
              {instructor}
            </div>
            {grade && (
              <div className="course-item-tag grade text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-0.5">
                {grade}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

/**
 * Popular courses section component
 */
const PopularCourses = () => {
  const [courses, setCourses] = useState<BookWithTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularBooks = async () => {
      try {
        setIsLoading(true);
        // Gọi API lấy sách, yêu cầu 4 item và sắp xếp theo thời gian cập nhật giảm dần (mới nhất)
        const response = await getBooks({
          take: 4,
          page: 1,
          sort_field: 'updated_at',
          sort_type: 'DESC'
        });

        // Thêm thuộc tính trendType ngẫu nhiên cho mỗi sách
        const trendTypes: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
        const booksWithTrend: BookWithTrend[] = response.data.data.map((book) => ({
          ...book,
          trendType: trendTypes[Math.floor(Math.random() * trendTypes.length)]
        }));

        setCourses(booksWithTrend);
        setError(null);
      } catch (err) {
        console.error('Error fetching popular books:', err);
        setError('Không thể tải danh sách sách phổ biến');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularBooks();
  }, []);

  return (
    <div className="sidebar-section p-3 sm:p-5">
      <div className="dot-pattern"></div>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-medium">Khóa học phổ biến</h2>
      </div>
      
      {isLoading ? (
        <div className="sidebar-section-content overflow-hidden">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="p-2 sm:p-3 border-b border-white/10 animate-pulse">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200/50 rounded-lg mr-2 sm:mr-3"></div>
                <div className="flex-1">
                  <div className="h-3 sm:h-4 bg-gray-200/50 rounded w-3/4 mb-1 sm:mb-2"></div>
                  <div className="h-2 sm:h-3 bg-gray-200/50 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="sidebar-section-content p-3 sm:p-4 text-red-600 text-xs sm:text-sm">
          {error}
        </div>
      ) : courses.length === 0 ? (
        <div className="sidebar-section-content p-3 sm:p-4 text-blue-600 text-xs sm:text-sm">
          Không có khóa học nào.
        </div>
      ) : (
        <div className="sidebar-section-content overflow-hidden">
          {courses.map((course) => (
            <CourseItem key={course.id} {...course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularCourses; 