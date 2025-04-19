"use client";

import { useState, useEffect, useRef, memo } from "react";
import Image from "next/image";
import {
  FileText,
  Clock,
  BookOpen,
  MessageCircle,
  ThumbsUp,
  Send,
  Image as ImageIcon,
  Loader2,
  Book,
  ChevronRight,
  X,
} from "lucide-react";
import Link from "next/link";
import { mockData } from "@/lib/mockData";
import useChapter, { ChapterData } from "@/hooks/useChapter";
import useBookContent, { MenuBookItem } from "@/hooks/useBookContent";
import ExamQuestionList from "./ExamQuestionList";

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
    role?: string;
  };
  content: string;
  timestamp: string;
  isTeacher?: boolean;
  image?: string;
  replies?: Comment[];
}

interface ChapterDetailComponentProps {
  chapterId: string;
  comments?: Comment[];
  bookId: string;
  onAddComment?: (content: string, parentId?: string) => void;
}

// Thêm hàm formatTimeAgo để hiển thị thời gian từ lúc comment đến hiện tại
const formatTimeAgo = (timestamp: string): string => {
  try {
    // In ra giá trị timestamp để debug
    console.log("Original timestamp:", timestamp);
    
    const now = new Date();
    let commentTime: Date;
    
    // Kiểm tra nếu timestamp có định dạng "hh:mm dd/MM/yyyy"
    if (timestamp.match(/^\d{1,2}:\d{1,2}\s\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      // Phân tích timestamp theo định dạng "hh:mm dd/MM/yyyy"
      const [timePart, datePart] = timestamp.split(' ');
      const [hour, minute] = timePart.split(':').map(Number);
      const [day, month, year] = datePart.split('/').map(Number);
      
      // Tạo đối tượng Date với các giá trị đã phân tích (lưu ý tháng trong JavaScript bắt đầu từ 0)
      commentTime = new Date(year, month - 1, day, hour, minute);
      console.log("Parsed custom date format:", commentTime);
    } else {
      commentTime = new Date(timestamp);
    }
    
    // Kiểm tra timestamp hợp lệ
    if (isNaN(commentTime.getTime())) {
      console.log("Invalid timestamp format");
      
      // Thử phân tích timestamp theo các định dạng khác
      // Nếu timestamp là dạng timestamp số
      if (!isNaN(Number(timestamp))) {
        const numericTimestamp = Number(timestamp);
        // Kiểm tra nếu là timestamp milliseconds
        if (numericTimestamp > 1000000000000) {
          const newCommentTime = new Date(numericTimestamp);
          if (!isNaN(newCommentTime.getTime())) {
            console.log("Parsed as milliseconds timestamp");
            return calculateTimeDifference(newCommentTime, now);
          }
        } 
        // Kiểm tra nếu là timestamp seconds
        else if (numericTimestamp > 1000000000) {
          const newCommentTime = new Date(numericTimestamp * 1000);
          if (!isNaN(newCommentTime.getTime())) {
            console.log("Parsed as seconds timestamp");
            return calculateTimeDifference(newCommentTime, now);
          }
        }
      }
      
      // Nếu không phân tích được, trả về giá trị mặc định
      return "vừa xong";
    }
    
    return calculateTimeDifference(commentTime, now);
  } catch (error) {
    console.error("Error in formatTimeAgo:", error);
    // Trong trường hợp có lỗi, trả về giá trị mặc định
    return "vừa xong";
  }
};

// Hàm tính toán sự khác biệt thời gian và trả về định dạng phù hợp
const calculateTimeDifference = (commentTime: Date, now: Date): string => {
  const diffInSeconds = Math.floor((now.getTime() - commentTime.getTime()) / 1000);
  
  // Nếu khác biệt thời gian là âm (do sai lệch đồng hồ hoặc timezone)
  if (diffInSeconds < 0) {
    return "vừa xong";
  }
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} giây trước`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} tuần trước`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} tháng trước`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} năm trước`;
};

// Tạo component riêng cho phần video iframe
const VideoIframe = memo(({ videoHtml, title }: { videoHtml: string, title: string }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium text-gray-800 mb-2">
        [Video] {title}
      </h2>
      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4 relative">
        <div
          className="absolute inset-0 w-full h-full"
          dangerouslySetInnerHTML={{
            __html: videoHtml.replace(
              "<iframe",
              '<iframe style="width:100%; height:100%; border:0;"'
            ),
          }}
        />
      </div>
    </div>
  );
});

VideoIframe.displayName = 'VideoIframe';

// Tạo component riêng cho phần video thumbnail
const VideoThumbnail = memo(({ coverImage, title, video }: { coverImage: string, title: string, video: string }) => {
  return (
    <div className="mb-6">
      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4 relative">
        <Image
          src={coverImage || "/images/default-cover.jpg"}
          alt={title || "Video thumbnail"}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Nút play cải tiến - lớn hơn, đậm hơn và có hiệu ứng */}
          <div className="w-20 h-20 bg-blue-600 bg-opacity-90 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-100 hover:scale-105 transition-all duration-200 cursor-pointer">
            <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2"></div>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-medium text-gray-800 mb-2">
        [Video] {title}
      </h2>
    </div>
  );
});

VideoThumbnail.displayName = 'VideoThumbnail';

const ChapterDetail = ({
  chapterId,
  comments = [],
  bookId,
  onAddComment,
}: ChapterDetailComponentProps) => {
  const [activeTab, setActiveTab] = useState<
    "content" | "answers" | "subchapters"
  >("content");
  const [comment, setComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<{id: string, userName: string} | null>(null);
  const { chapter, isLoading, error, fetchChapter } = useChapter();
  const {
    bookContent,
    isLoading: isContentLoading,
    error: contentError,
    fetchBookContent,
  } = useBookContent();
  const [filterType, setFilterType] = useState<"all" | "DE" | "CHUONG">("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Thêm state và ref cho phần hiển thị bình luận
  const [visibleComments, setVisibleComments] = useState(5); // Số lượng bình luận hiển thị ban đầu
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Trạng thái đang tải thêm bình luận
  const commentsContainerRef = useRef<HTMLDivElement>(null); // Ref để scroll đến bình luận mới

  useEffect(() => {
    if (chapterId) {
      fetchChapter(chapterId);
    }
  }, [chapterId, fetchChapter]);

  // Fetch nội dung sách khi có bookId
  useEffect(() => {
    if (bookId) {
      fetchBookContent(bookId);
    }
  }, [bookId, fetchBookContent]);

  // Kiểm tra xem video có phải dạng iframe không
  const isIframeVideo = (videoString: string | null): boolean => {
    if (!videoString) return false;
    return (
      videoString.trim().startsWith("<iframe") &&
      videoString.trim().endsWith("</iframe>")
    );
  };

  // Lọc danh sách nội dung theo điều kiện
  const filteredChapter = bookContent.filter((item) => item.id === chapterId);
  const listChapterItem =
    filteredChapter.length > 0 ? filteredChapter[0].children : [];

  // Tính tổng số comment và replies
  const totalComments = comments.reduce((total, comment) => {
    // Đếm comment chính
    let count = 1;
    // Đếm các replies nếu có
    if (comment.replies && comment.replies.length > 0) {
      count += comment.replies.length;
    }
    return total + count;
  }, 0);
  
  // Dữ liệu cho thống kê - views là mẫu, comments là thực tế
  const mockStats = {
    views: 124, // Giá trị mẫu, trong thực tế sẽ lấy từ API
    questions: totalComments,
  };

  const handleSubmitComment = () => {
    if (comment.trim() === "") return;
    
    if (onAddComment) {
      onAddComment(comment, replyingTo?.id);
      setComment("");
      setReplyingTo(null);
    } else {
      console.log("Gửi bình luận:", comment);
      setComment("");
      setReplyingTo(null);
    }
  };

  // Hàm bắt đầu phản hồi một bình luận
  const handleReplyStart = (commentId: string, userName: string) => {
    setReplyingTo({id: commentId, userName});
    // Focus vào textarea
    const textarea = document.getElementById('comment-textarea');
    if (textarea) {
      textarea.focus();
    }
  };

  // Hàm hủy phản hồi
  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  // Thêm function để load thêm bình luận
  const loadMoreComments = () => {
    setIsLoadingMore(true);
    // Giả lập việc tải dữ liệu (trong thực tế có thể gọi API)
    setTimeout(() => {
      setVisibleComments(prevCount => {
        // Tăng số lượng bình luận hiển thị thêm 5
        const newCount = prevCount + 5;
        // Nếu đã hiển thị tất cả bình luận thì trả về tổng số bình luận
        return newCount > comments.length ? comments.length : newCount;
      });
      setIsLoadingMore(false);
    }, 500);
  };
  
  // Scroll đến vị trí bình luận mới khi tải thêm
  useEffect(() => {
    if (isLoadingMore && commentsContainerRef.current) {
      const { current } = commentsContainerRef;
      current.scrollTop = current.scrollHeight;
    }
  }, [visibleComments, isLoadingMore]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin mx-auto mb-4" />
          <p>Đang tải thông tin chương...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Lỗi</div>
          <p>{error}</p>
          <button
            onClick={() => chapterId && fetchChapter(chapterId)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-500 text-xl mb-4">
            Không tìm thấy chương
          </div>
          <p>Chương với ID {chapterId} không tồn tại hoặc đã bị xóa.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Phần bên trái - Nội dung chính */}
          <div className="lg:col-span-2">
            {/* Phần header - Thông tin chương */}
            <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 flex-shrink-0 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <FileText className="h-8 w-8 text-yellow-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">
                    {chapter.title}
                  </h1>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <span>
                      Loại: {chapter.type === "DE" ? "Đề thi" : "Chương"}
                    </span>
                    <span className="mx-2">•</span>
                    <span>Mã: {chapter.code_id}</span>
                    {chapter.active && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                          Đang hoạt động
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b mb-6">
              <div className="flex">
                <button
                  className={`py-3 px-6 text-sm font-medium ${
                    activeTab === "content"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("content")}
                >
                  Nội dung
                </button>
                {chapter?.type === "DE" && (
                  <button
                    className={`py-3 px-6 text-sm font-medium ${
                      activeTab === "answers"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("answers")}
                  >
                    Đáp án
                  </button>
                )}
                {listChapterItem?.length > 0 && (
                  <button
                    className={`py-3 px-6 text-sm font-medium ${
                      activeTab === "subchapters"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("subchapters")}
                  >
                    Danh sách các mục
                  </button>
                )}
              </div>
            </div>

            {/* Tab content */}
            <div className="bg-white p-5 rounded-xl shadow-sm">
              {activeTab === "content" ? (
                <div>
                  {/* Cover image */}
                  {chapter?.cover && !isIframeVideo(chapter?.video) && (
                    <div className="mb-6">
                      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4 relative">
                        <Image
                          src={chapter.cover}
                          alt={chapter.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Video content - trường hợp là iframe */}
                  {chapter?.video && isIframeVideo(chapter.video) && (
                    <VideoIframe videoHtml={chapter.video} title={chapter?.title || ""} />
                  )}

                  {/* Video content - trường hợp là URL thông thường */}
                  {chapter?.video && !isIframeVideo(chapter.video) && (
                    <VideoThumbnail 
                      coverImage={chapter?.cover || "/images/default-cover.jpg"}
                      title={chapter?.title || ""}
                      video={chapter.video}
                    />
                  )}

                  {/* Attachments (nếu có) */}
                  {chapter.attached && chapter.attached.length > 0 && (
                    <div className="mb-6">
                      {chapter.attached.map((attachment: any, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-3 flex items-center mb-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                            <FileText className="w-5 h-5 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {attachment.name || "Tài liệu đính kèm"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {attachment.size ||
                                "Không có thông tin kích thước"}
                            </p>
                          </div>
                          <button className="text-sm text-blue-600 hover:text-blue-700">
                            Click to view
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Mô tả (nếu có) */}
                  {chapter.description ? (
                    <div className="prose max-w-none">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: chapter.description,
                        }}
                      />
                    </div>
                  ) : (
                    <div className="prose max-w-none">
                      <p className="text-gray-500">
                        Chương này hiện chưa có nội dung mô tả.
                      </p>
                    </div>
                  )}

                  {/* Thông tin chi tiết */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Thông tin chi tiết
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Mã chương</p>
                          <p className="font-medium">{chapter.code_id}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Clock className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Được tạo vào</p>
                          <p className="font-medium">
                            {new Date(chapter.created_at).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-yellow-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Thứ tự</p>
                          <p className="font-medium">{chapter.order}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Thuộc sách</p>
                          <Link
                            href={`/books/${chapter.book_id}`}
                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {chapter?.book?.name || "Không có thông tin sách"}
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Thông tin bổ sung */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <div className="bg-gray-100 text-xs text-gray-800 px-3 py-1 rounded-full">
                        Ngày cập nhật:{" "}
                        {new Date(chapter.updated_at).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                      {chapter.active && (
                        <div className="bg-green-100 text-xs text-green-800 px-3 py-1 rounded-full">
                          Đang hoạt động
                        </div>
                      )}
                      {chapter.active_code_id && (
                        <div className="bg-blue-100 text-xs text-blue-800 px-3 py-1 rounded-full">
                          Mã kích hoạt
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : activeTab === "answers" ? (
                <div className="prose max-w-none">
                  {/* Nội dung đáp án sẽ được hiển thị ở tab này */}
                  {chapter?.exam ? (
                    <ExamQuestionList exam={chapter.exam} />
                  ) : (
                    <div className="text-center py-8 text-gray-500 flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6">
                      <FileText className="h-12 w-12 text-gray-300 mb-2" />
                      <p className="text-gray-500">
                        Chương này không có bài kiểm tra hoặc đáp án đính kèm.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="prose max-w-none">
                  {/* Subchapters tab content */}
                  {isContentLoading ? (
                    <div className="py-8 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-2" />
                      <p className="text-gray-500">Đang tải danh sách...</p>
                    </div>
                  ) : contentError ? (
                    <div className="py-8 text-center">
                      <p className="text-red-500">
                        Có lỗi xảy ra: {contentError}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">
                        Danh sách các mục
                      </h3>

                      {/* Thông tin thống kê */}
                      <div className="p-4 bg-blue-50 rounded-lg mb-6 border border-blue-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center mr-3">
                              <Book className="h-4 w-4 text-blue-700" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Tổng số mục
                              </p>
                              <p className="font-medium">
                                {listChapterItem.length} mục
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center mr-3">
                              <FileText className="h-4 w-4 text-green-700" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Số bộ đề</p>
                              <p className="font-medium">
                                {
                                  listChapterItem.filter(
                                    (item) => item.type === "DE"
                                  ).length
                                }{" "}
                                bộ đề
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center mr-3">
                              <BookOpen className="h-4 w-4 text-yellow-700" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Số chương</p>
                              <p className="font-medium">
                                {
                                  listChapterItem.filter(
                                    (item) => item.type === "CHUONG"
                                  ).length
                                }{" "}
                                chương
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Danh sách các phần tử */}
                      {filteredChapter.length > 0 ? (
                        <div>
                          {listChapterItem && listChapterItem.length > 0 && (
                            <div className="pl-10 pr-4 py-2 bg-gray-50">
                              <div className="space-y-2">
                                {listChapterItem.map((child) => (
                                  <Link
                                    key={child.id}
                                    href={`/books/${bookId}/chapters/${child.id}`}
                                    className={`flex items-center p-2 rounded-md hover:bg-blue-100/50 transition-colors ${
                                      child.id === chapterId
                                        ? "bg-blue-100/50"
                                        : ""
                                    }`}
                                  >
                                    <div className="w-8 h-8 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                                      {child.type === "DE" ? (
                                        <FileText className="h-4 w-4 text-blue-500" />
                                      ) : (
                                        <BookOpen className="h-4 w-4 text-green-500" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center">
                                        <h5 className="text-sm font-medium text-gray-800 truncate">
                                          {child.title}
                                        </h5>
                                        {child.active && (
                                          <span className="ml-2 bg-green-50 text-green-600 text-[10px] px-1.5 py-0.5 rounded-full">
                                            Hoạt động
                                          </span>
                                        )}
                                        {child.id === chapterId && (
                                          <span className="ml-2 bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded-full">
                                            Hiện tại
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-xs text-gray-500 truncate">
                                        Mã: {child.code_id} • Loại:{" "}
                                        {child.type === "DE"
                                          ? "Đề thi"
                                          : "Chương"}
                                      </div>
                                    </div>
                                    <div className="ml-2">
                                      <ChevronRight className="h-4 w-4 text-gray-400" />
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6">
                          <Book className="h-12 w-12 text-gray-300 mb-2" />
                          <p className="text-gray-500">
                            Không tìm thấy mục nào.
                          </p>
                          {(searchTerm || filterType !== "all") && (
                            <button
                              onClick={() => {
                                setSearchTerm("");
                                setFilterType("all");
                              }}
                              className="mt-3 px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                              Xóa bộ lọc
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Phần bên phải - Thống kê và bình luận */}
          <div className="lg:col-span-1">
            {/* Stats */}
            <div className="bg-white p-5 rounded-xl shadow-sm mb-6 flex justify-around">
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 text-yellow-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Số lượt xem</p>
                  <p className="font-medium">{mockStats.views}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 text-green-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Số lượng bình luận</p>
                  <p className="font-medium">{mockStats.questions}</p>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium mb-4">Bình luận & Câu hỏi</h3>

              <div 
                ref={commentsContainerRef} 
                className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar"
              >
                {comments.length > 0 ? (
                  comments.slice(0, visibleComments).map((comment) => (
                    <div
                      key={comment.id}
                      className="pb-5 border-b last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 relative">
                          <Image
                            src={comment.user.avatar}
                            alt={comment.user.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-800">
                              {comment.user.name}
                              {comment.isTeacher && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                  {comment.user.role || "Giáo viên"}
                                </span>
                              )}
                            </h4>
                            <span className="ml-auto text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTimeAgo(comment.timestamp)}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">
                            {comment.content}
                          </p>
                          {comment.image && (
                            <div className="mt-2">
                              <div className="max-w-xs overflow-hidden rounded-lg">
                                <Image
                                  src={comment.image}
                                  alt="Comment attachment"
                                  width={400}
                                  height={240}
                                  className="object-contain"
                                />
                              </div>
                            </div>
                          )}
                          {/* <div className="flex items-center mt-2">
                            <button className="flex items-center text-green-600 text-sm mr-4">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              <span>Hữu ích</span>
                            </button>
                            <button 
                              onClick={() => handleReplyStart(comment.id, comment.user.name)}
                              className="text-blue-600 text-sm"
                            >
                              Phản hồi
                            </button>
                          </div> */}
                          
                          <div className="flex items-center mt-2">
                            <button 
                              onClick={() => handleReplyStart(comment.id, comment.user.name)}
                              className="text-blue-600 text-sm"
                            >
                              Phản hồi
                            </button>
                          </div>
                          
                          {/* Hiển thị phản hồi nếu có */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-100">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 relative">
                                    <Image
                                      src={reply.user.avatar}
                                      alt={reply.user.name}
                                      fill
                                      sizes="32px"
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center">
                                      <h4 className="font-medium text-gray-800 text-sm">
                                        {reply.user.name}
                                        {reply.isTeacher && (
                                          <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                            {reply.user.role || "Giáo viên"}
                                          </span>
                                        )}
                                      </h4>
                                      <span className="ml-auto text-xs text-gray-500 flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {formatTimeAgo(reply.timestamp)}
                                      </span>
                                    </div>
                                    <p className="text-gray-600 mt-1 text-sm">
                                      {reply.content}
                                    </p>
                                    {reply.image && (
                                      <div className="mt-2">
                                        <div className="max-w-xs overflow-hidden rounded-lg">
                                          <Image
                                            src={reply.image}
                                            alt="Reply attachment"
                                            width={300}
                                            height={180}
                                            className="object-contain"
                                          />
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex items-center mt-2">
                                      {/* <button className="flex items-center text-green-600 text-xs mr-4">
                                        <ThumbsUp className="w-3 h-3 mr-1" />
                                        <span>Hữu ích</span>
                                      </button> */}
                                      <button 
                                        onClick={() => handleReplyStart(comment.id, comment.user.name)}
                                        className="text-blue-600 text-xs"
                                      >
                                        Phản hồi
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p>
                      Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                    </p>
                  </div>
                )}
                
                {/* Nút hiển thị thêm bình luận nếu còn bình luận chưa hiển thị */}
                {visibleComments < comments.length && (
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={loadMoreComments}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center transition-colors"
                      disabled={isLoadingMore}
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          <span>Đang tải...</span>
                        </>
                      ) : (
                        <>
                          <span>Xem thêm {Math.min(5, comments.length - visibleComments)} bình luận</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Comment input */}
              <div className="mt-6">
                {replyingTo && (
                  <div className="bg-blue-50 p-2 mb-2 rounded-lg flex items-center justify-between">
                    <div className="text-sm text-blue-700">
                      Đang phản hồi tới <span className="font-medium">{replyingTo.userName}</span>
                    </div>
                    <button 
                      onClick={handleCancelReply}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <div className="mt-2 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={localStorage.getItem("userAvatar") || ""}
                      alt="Avatar"
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow relative">
                    <textarea
                      id="comment-textarea"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={replyingTo ? `Phản hồi tới ${replyingTo.userName}...` : "Viết bình luận của bạn..."}
                      className="w-full min-h-[80px] border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    ></textarea>
                    <div className="flex justify-between items-center mt-2">
                      {/* <button className="text-gray-500 hover:text-gray-700 ">
                        <ImageIcon className="h-5 w-5" />
                      </button> */}
                      <button
                        onClick={handleSubmitComment}
                        disabled={!comment.trim()}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                          !comment.trim()
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        } transition-colors`}
                      >
                        <Send className="h-4 w-4" />
                        <span>{replyingTo ? "Phản hồi" : "Gửi"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterDetail;
