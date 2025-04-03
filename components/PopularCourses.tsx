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
        <div className="course-item-image">
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
        <div className="flex-1">
          <h3 className="font-medium text-sm">{name}</h3>
          <div className="flex items-center mt-1">
            <div className="course-item-tag subject">
              {instructor}
            </div>
            {grade && (
              <div className="course-item-tag grade">
                {grade}
              </div>
            )}
          </div>
        </div>
        {/* {trendType === 'up' && (
          <div className="text-green-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        )}
        {trendType === 'down' && (
          <div className="text-red-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
        )}
        {trendType === 'stable' && (
          <div className="text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            </svg>
          </div>
        )} */}
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
    <div className="sidebar-section p-5">
      <div className="dot-pattern"></div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Khóa học phổ biến</h2>
        {/* <Link href="/books" className="text-amber-500 hover:text-amber-600 transition-colors">
          <span className="text-xs">Xem tất cả</span>
        </Link> */}
      </div>
      
      {isLoading ? (
        <div className="sidebar-section-content overflow-hidden">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="p-3 border-b border-white/10 animate-pulse">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200/50 rounded-lg mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200/50 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200/50 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="sidebar-section-content p-4 text-red-600">
          {error}
        </div>
      ) : courses.length === 0 ? (
        <div className="sidebar-section-content p-4 text-blue-600">
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