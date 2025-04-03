"use client";

import { useState, useEffect } from "react";
import ChapterDetail from "@/components/ChapterDetail";
import { mockData } from "@/lib/mockData";

interface ChapterClientProps {
  bookId: string;
  chapterId: string;
}

// Dữ liệu mẫu cho bình luận
const mockComments = [
  {
    id: "1",
    user: {
      name: "Hà Quỳnh Anh",
      avatar: mockData.avatar_link
    },
    content: "Xét tính đồng biến và nghịch biến của hàm số y=x3 - 6x2 + 9x - 3 theo cách thầy giảng nhưng vẫn sai gì?",
    timestamp: "20 phút trước"
  },
  {
    id: "2",
    user: {
      name: "Thu Trang",
      avatar: mockData.avatar_link,
      role: "Giáo viên"
    },
    content: "Có gửi lời giải nhé, em check lại xem",
    timestamp: "20 phút trước",
    isTeacher: true,
    image: mockData.avatar_link
  }
];

export default function ChapterClient({ bookId, chapterId }: ChapterClientProps) {
  // Trong tương lai, có thể mở rộng để quản lý trạng thái bình luận, thích, v.v.
  const [comments, setComments] = useState(mockComments);

  // Nếu cần thêm logic, như gửi bình luận, thích, v.v.
  const addComment = (content: string) => {
    // Logic xử lý thêm bình luận
    console.log("Thêm bình luận:", content);
  };

  return (
    <ChapterDetail
      chapterId={chapterId}
      comments={comments}
    />
  );
} 