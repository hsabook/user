"use client";

import { useState, useEffect } from "react";
import ChapterDetail from "@/components/ChapterDetail";
import { getComments, createComment } from "@/services/commentService";
import { Comment as CommentType } from "@/types/comment";
import { toast } from "sonner";

interface ChapterClientProps {
  bookId: string;
  chapterId: string;
}

// Chuyển đổi định dạng comment từ API sang định dạng hiển thị
const mapApiCommentsToUI = (comments: CommentType[]) => {
  return comments.map(comment => ({
    id: comment.id,
    user: {
      name: comment.user.full_name,
      avatar: comment.user.avatar,
      role: comment.user.role === "teacher" ? "Giáo viên" : undefined
    },
    content: comment.content,
    timestamp: new Date(comment.created_at).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }),
    isTeacher: comment.user.role === "teacher",
    replies: comment.children.map(child => ({
      id: child.id,
      user: {
        name: child.user.full_name,
        avatar: child.user.avatar,
        role: child.user.role === "teacher" ? "Giáo viên" : undefined
      },
      content: child.content,
      timestamp: new Date(child.created_at).toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }),
      isTeacher: child.user.role === "teacher"
    }))
  }));
};

export default function ChapterClient({ bookId, chapterId }: ChapterClientProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Lấy danh sách bình luận khi component mount hoặc khi bookId/chapterId thay đổi
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        // Lấy bình luận với menu_book_id là chapterId
        const response = await getComments({
          menu_book_id: chapterId,
          page: 1,
          limit: 20
        });
        
        // Chuyển đổi định dạng
        const formattedComments = mapApiCommentsToUI(response.data);
        setComments(formattedComments);
      } catch (err) {
        console.error("Lỗi khi lấy bình luận:", err);
        toast.error("Không thể tải bình luận");
      } finally {
        setLoading(false);
      }
    };
    
    fetchComments();
  }, [bookId, chapterId]);

  // Thêm bình luận mới
  const handleAddComment = async (content: string, parentId?: string) => {
    try {
      // Gọi API để tạo bình luận mới
      await createComment({
        content,
        menu_book_id: chapterId,
        parent_id: parentId
      });
      
      // Sau khi tạo thành công, lấy lại danh sách bình luận để cập nhật
      const response = await getComments({
        menu_book_id: chapterId,
        page: 1,
        limit: 50
      });
      
      const formattedComments = mapApiCommentsToUI(response.data);
      setComments(formattedComments);
      
      toast.success(parentId ? "Đã phản hồi bình luận thành công" : "Đã thêm bình luận thành công");
    } catch (err) {
      console.error("Lỗi khi thêm bình luận:", err);
      toast.error("Không thể thêm bình luận. Vui lòng thử lại sau.");
    }
  };

  return (
    <ChapterDetail
      chapterId={chapterId}
      comments={loading ? [] : comments}
      bookId={bookId}
      onAddComment={handleAddComment}
    />
  );
} 