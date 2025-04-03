"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Award,
  BookOpen,
  Check,
  Loader2,
  FileText,
} from "lucide-react";
import useBookContent, { MenuBookItem, MenuBookChild } from "@/hooks/useBookContent";

interface Author {
  id: string;
  name: string;
  email: string;
  avatar: string;
  achievements: {
    books: number;
    graduates: string;
    followers: number;
  };
}

interface BookDetailProps {
  id: string;
  title: string;
  authors: string[];
  authorDetails: Author[];
  publishDate: string;
  category: string;
  subcategory: string;
  rating: number;
  chapters?: any[]; // Không dùng nữa, giữ để tránh lỗi
  bookCover?: string; // Thêm tham số ảnh bìa sách
}

const BookDetail = ({
  id,
  title,
  authors,
  authorDetails,
  publishDate,
  category,
  subcategory,
  rating,
  bookCover = "/images/book-cover.jpg", // Mặc định ảnh bìa nếu không có
}: BookDetailProps) => {
  const [expandedChapters, setExpandedChapters] = useState<
    Record<string, boolean>
  >({});
  const { bookContent, isLoading, error, fetchBookContent } = useBookContent();

  useEffect(() => {
    if (id) {
      fetchBookContent(id);
      console.log('Fetch book content for ID:', id);
    }
  }, [id]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  // Hàm kiểm tra loại nội dung
  const getContentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return (
          <div className="w-8 h-8 flex-shrink-0 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      case 'exam':
      case 'test':
        return (
          <div className="w-8 h-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 flex-shrink-0 bg-green-100 rounded-full flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-green-600" />
          </div>
        );
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link href="/books" className="hover:text-blue-600">
            Sách
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">{title}</span>
        </div>
      </div>

      {/* Header - Thông tin sách */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Ảnh bìa sách */}
          <div className="w-full md:w-32 lg:w-40">
            <div className="relative w-full aspect-[3/4] shadow-md rounded-md overflow-hidden">
              <Image
                src={bookCover}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Thông tin sách */}
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              {title}
            </h1>
            <p className="text-gray-600 mb-2">{authors.join(", ")}</p>

            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {category}
              </div>
              <div className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                {subcategory}
              </div>
            </div>

            <div className="flex items-center gap-1 mb-4">
              <svg
                className="w-4 h-4 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-sm font-medium">{rating}</span>
            </div>

            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <div className="flex gap-2">
                <span className="font-medium min-w-24">Ngày:</span>
                <span>{publishDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nội dung Tab */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tab 1: Nội dung sách */}
        <div className="md:col-span-2">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 py-3 px-4 border-b">
              <h2 className="font-medium">Tất cả nội dung của sách</h2>
            </div>
            
            {isLoading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <span className="ml-2">Đang tải nội dung sách...</span>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                <p>Lỗi khi tải nội dung sách: {error}</p>
                <button 
                  onClick={() => fetchBookContent(id)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            ) : bookContent.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>Không có nội dung sách.</p>
              </div>
            ) : (
              <div>
                {bookContent.map((item) => (
                  <div key={item.id} className="border-b last:border-b-0">
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleChapter(item.id)}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-1">
                          {expandedChapters[item.id] ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <Link href={`/books/${id}/chapters/${item.id}`} className="font-medium hover:text-blue-600">
                            {item.title}
                          </Link>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span>Loại: {item.type}</span>
                            <span className="mx-1">•</span>
                            <span>Mã: {item.code_id}</span>
                          </div>
                        </div>
                      </div>
                      {!item.active ? (
                        <div className="w-5 h-5 flex items-center justify-center bg-gray-200 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 flex items-center justify-center bg-green-100 rounded-full">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                      )}
                    </div>
                    {expandedChapters[item.id] && item.children && item.children.length > 0 && (
                      <div className="pl-10 pr-4 pb-3">
                        {item.children.map((child) => (
                          <Link
                            href={`/books/${id}/chapter/${item.id}/content/${child.id}`}
                            key={child.id}
                            className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-md"
                          >
                            <div className="flex items-center gap-2">
                              {getContentIcon(child.type)}
                              <span className="text-sm">{child.title}</span>
                            </div>
                            {!child.active ? (
                              <div className="w-5 h-5 flex items-center justify-center bg-gray-200 rounded-full">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 text-gray-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-5 h-5 flex items-center justify-center bg-green-100 rounded-full">
                                <Check className="h-3 w-3 text-green-600" />
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tab 2: Thông tin tác giả */}
        <div className="md:col-span-1">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 py-3 px-4 border-b">
              <h2 className="font-medium">Thông tin tác giả</h2>
            </div>
            <div className="p-4">
              {authorDetails.map((author, index) => (
                <div
                  key={author.id}
                  className={index > 0 ? "mt-6 pt-6 border-t" : ""}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 relative rounded-full overflow-hidden">
                      <Image
                        src={author.avatar}
                        alt={author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {author.name}
                      </h3>
                      <p className="text-gray-500 text-sm">{author.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">
                        Hơn {author.achievements.books} đầu sách
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="text-sm">
                        Tốt nghiệp loại Xuất sắc {author.achievements.graduates}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="text-sm">
                        Hơn {author.achievements.followers.toLocaleString()}{" "}
                        người theo dõi
                      </span>
                    </div>
                  </div>

                  <div className="flex mt-4">
                    <div className="flex flex-col items-center mr-4">
                      <div className="flex items-center text-yellow-400">
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1">123</span>
                      </div>
                      <span className="text-xs text-gray-500">Xuất bản</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center text-green-400">
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-1">
                          {author.achievements.followers.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Follow</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookDetail;
