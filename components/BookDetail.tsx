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
  Plus,
} from "lucide-react";
import useBookContent, { MenuBookItem, MenuBookChild } from "@/hooks/useBookContent";
import { useModal } from "@/contexts/ModalContext";

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
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const { openActivateModal } = useModal();

  useEffect(() => {
    if (id) {
      fetchBookContent(id);
      
      // Giả lập thời gian tải để hiển thị loading skeleton
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [id, fetchBookContent]);

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
          <div className="w-8 h-8 flex-shrink-0 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-green-600"
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
          <div className="w-8 h-8 flex-shrink-0 bg-green-100 rounded-full flex items-center justify-center">
            <FileText className="h-4 w-4 text-green-600" />
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

  // Kiểm tra xem sách có phải của người dùng không
  const isMyBook = bookContent.length > 0 && bookContent[0]?.is_mybook !== false;

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-green-600 transition-colors">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link href="/activated-books" className="hover:text-green-600 transition-colors">
            Sách đã kích hoạt
          </Link>
          <span className="mx-2">/</span>
          <span className="text-green-700 font-medium">{title || "Đang tải..."}</span>
        </div>
      </div>

      {/* Header - Thông tin sách */}
      <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-md p-6 rounded-xl mb-8 shadow-sm border border-green-100">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Ảnh bìa sách */}
          <div className="w-full md:w-32 lg:w-40">
            {isInitialLoading ? (
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-green-100 animate-pulse flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-green-300 animate-spin" />
              </div>
            ) : (
              <div className="relative w-full aspect-[3/4] shadow-md rounded-xl overflow-hidden border border-green-100">
                <Image
                  src={bookCover}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Thông tin sách */}
          <div className="flex-1">
            {isInitialLoading ? (
              <>
                <div className="h-8 w-3/4 bg-green-50 animate-pulse rounded-lg mb-3"></div>
                <div className="h-5 w-1/2 bg-green-50 animate-pulse rounded-lg mb-4"></div>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-20 bg-green-50 animate-pulse rounded-full"></div>
                  <div className="h-6 w-24 bg-green-50 animate-pulse rounded-full"></div>
                </div>
                
                <div className="flex items-center gap-1 mb-4">
                  <div className="h-5 w-5 bg-green-50 animate-pulse rounded-full"></div>
                  <div className="h-5 w-10 bg-green-50 animate-pulse rounded-lg"></div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="h-5 w-20 bg-green-50 animate-pulse rounded-lg"></div>
                    <div className="h-5 w-32 bg-green-50 animate-pulse rounded-lg"></div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                  {title}
                </h1>
                <p className="text-gray-600 mb-2">{authors.join(", ")}</p>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Nội dung Tab */}
      <div className="grid grid-cols-1 gap-6">
        {/* Tab 1: Nội dung sách hoặc nút kích hoạt */}
        <div className="w-full">
          <div className="border border-green-100 rounded-xl overflow-hidden shadow-sm bg-white bg-opacity-90 backdrop-filter backdrop-blur-md">
            <div className="bg-gradient-to-r from-green-50 to-green-100 py-3 px-4 border-b border-green-100">
              <h2 className="font-medium text-green-800">
                {!isInitialLoading && !isLoading && !isMyBook ? "Kích hoạt sách để xem nội dung" : "Tất cả nội dung của sách"}
              </h2>
            </div>
            
            {isLoading || isInitialLoading ? (
              <div className="p-8 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                  <Loader2 className="h-8 w-8 text-green-300 animate-spin" />
                </div>
                <p className="text-green-700">Đang tải nội dung sách...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-red-500 font-medium">Lỗi khi tải nội dung sách</p>
                <p className="text-gray-600 mt-1 mb-4">{error}</p>
                <button 
                  onClick={() => fetchBookContent(id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            ) : !isMyBook ? (
              <div className="p-8 flex flex-col items-center justify-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-4 border border-green-100">
                  <BookOpen className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Sách chưa được kích hoạt</h3>
                <p className="text-gray-600 text-center mb-6 max-w-md">
                  Để xem nội dung đầy đủ của sách, bạn cần nhập mã kích hoạt từ thẻ cào hoặc mã được cung cấp khi mua sách.
                </p>
                <button 
                  onClick={openActivateModal}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium shadow hover:shadow-md transition-all"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Kích hoạt sách ngay
                </button>
              </div>
            ) : bookContent.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-gray-500">Không có nội dung sách.</p>
              </div>
            ) : (
              <div className="divide-y divide-green-50">
                {bookContent.map((item) => (
                  <div key={item.id} className="border-b border-green-50 last:border-b-0">
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-green-50 transition-colors"
                      onClick={() => toggleChapter(item.id)}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-1">
                          {expandedChapters[item.id] ? (
                            <ChevronDown className="w-4 h-4 text-green-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div>
                          <Link href={`/books/${id}/chapters/${item.id}`} className="font-medium hover:text-green-600 transition-colors">
                            {item.title}
                          </Link>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span>Loại: {item.type === 'CHUONG' ? 'Chương' : 'Đề thi'}</span>
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
                            href={`/books/${id}/chapters/${child.id}`}
                            key={child.id}
                            className="flex items-center justify-between py-2 px-3 hover:bg-green-50 rounded-xl transition-colors mb-1"
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
      </div>
    </>
  );
};

export default BookDetail;
