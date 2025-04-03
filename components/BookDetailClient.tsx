"use client";

import { useState, useEffect } from "react";
import BookDetail from "@/components/BookDetail";
import { Loader2 } from "lucide-react";
import useBook from "@/hooks/useBook";

interface BookDetailClientProps {
  bookId: string;
  initialData: any;
}

export default function BookDetailClient({ bookId, initialData }: BookDetailClientProps) {
  const { book, isLoading, error, fetchBook } = useBook();
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    // Nếu không có initialData hoặc muốn lấy thông tin mới nhất từ API
    if (bookId) {
      fetchBook(bookId);
    }
  }, [bookId, fetchBook]);

  // Nếu đang lấy dữ liệu từ API và không có dữ liệu ban đầu
  if (isLoading && !initialData) {
    return (
      <div className="container mx-auto py-8 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin mx-auto mb-4" />
          <p>Đang tải thông tin sách...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Lỗi</div>
          <p>{error}</p>
          <button
            onClick={() => bookId && fetchBook(bookId)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Ưu tiên sử dụng dữ liệu từ API nếu có, nếu không thì dùng initialData
  const bookData = book || initialData;

  if (!bookData) {
    return (
      <div className="container mx-auto py-8 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-500 text-xl mb-4">Không tìm thấy sách</div>
          <p>Sách với ID {bookId} không tồn tại hoặc đã bị xóa.</p>
        </div>
      </div>
    );
  }

  // Chuyển đổi dữ liệu từ API sang định dạng cần thiết cho BookDetail
  const adaptedBookData = {
    id: bookData.id,
    title: bookData.name || initialData.title,
    authors: bookData.authors?.map((author: any) => author.name) || initialData.authors,
    publishDate: new Date(bookData.created_at).toLocaleDateString('vi-VN') || initialData.publishDate,
    category: bookData.book_tags?.[0]?.tag?.name || initialData.category,
    subcategory: bookData.subject || initialData.subcategory,
    rating: 4.0, // Giả định, có thể thay đổi nếu API có thông tin này
    authorDetails: bookData.authors?.map((author: any) => ({
      id: author.id,
      name: author.name,
      email: "không có thông tin", // Giả định, có thể thay đổi nếu API có thông tin này
      avatar: author.avatar || initialData.authorDetails[0].avatar,
      achievements: {
        books: 10, // Giả định, có thể thay đổi nếu API có thông tin này
        graduates: "Không có thông tin",
        followers: 1000, // Giả định, có thể thay đổi nếu API có thông tin này
      }
    })) || initialData.authorDetails,
    // Nếu có avatar từ API thì dùng, nếu không dùng ảnh mặc định
    bookCover: bookData.avatar || "/images/book-cover.jpg"
  };

  return <BookDetail {...adaptedBookData} />;
} 