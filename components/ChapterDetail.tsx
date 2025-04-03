"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FileText, Clock, BookOpen, MessageCircle, ThumbsUp, Send, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { mockData } from "@/lib/mockData";
import useChapter, { ChapterData } from "@/hooks/useChapter";

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
}

interface ChapterDetailComponentProps {
  chapterId: string;
  comments?: Comment[];
}

const ChapterDetail = ({ chapterId, comments = [] }: ChapterDetailComponentProps) => {
  const [activeTab, setActiveTab] = useState<"content" | "answers">("content");
  const [comment, setComment] = useState("");
  const { chapter, isLoading, error, fetchChapter } = useChapter();

  useEffect(() => {
    if (chapterId) {
      fetchChapter(chapterId);
    }
  }, [chapterId, fetchChapter]);

  // Kiểm tra xem video có phải dạng iframe không
  const isIframeVideo = (videoString: string | null): boolean => {
    if (!videoString) return false;
    return videoString.trim().startsWith('<iframe') && videoString.trim().endsWith('</iframe>');
  };

  // Dữ liệu mẫu cho thống kê và bình luận - trong thực tế sẽ lấy từ API
  const mockStats = {
    views: 124,
    questions: 3
  };

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
          <div className="text-yellow-500 text-xl mb-4">Không tìm thấy chương</div>
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
            <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 flex-shrink-0 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-8 w-8 text-yellow-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">{chapter.title}</h1>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <span>Loại: {chapter.type === 'DE' ? 'Đề thi' : 'Chương'}</span>
                    <span className="mx-2">•</span>
                    <span>Mã: {chapter.code_id}</span>
                    {chapter.active && 
                      <>
                        <span className="mx-2">•</span>
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                          Đang hoạt động
                        </span>
                      </>
                    }
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
                {
                  chapter.type === 'DE' && <button
                  className={`py-3 px-6 text-sm font-medium ${
                    activeTab === "answers"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("answers")}
                >
                  Đáp án
                </button>
                }
              </div>
            </div>

            {/* Tab content */}
            <div className="bg-white p-5 rounded-lg shadow-sm">
              {activeTab === "content" ? (
                <div>
                  {/* Cover image */}
                  {chapter.cover && !isIframeVideo(chapter.video) && (
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
                  {chapter.video && isIframeVideo(chapter.video) && (
                    <div className="mb-6">
                      <h2 className="text-lg font-medium text-gray-800 mb-2">[Video] {chapter.title}</h2>
                      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4 relative">
                        <div className="absolute inset-0 w-full h-full" 
                             dangerouslySetInnerHTML={{ 
                              __html: chapter.video.replace('<iframe', '<iframe style="width:100%; height:100%; border:0;"') 
                             }} />
                      </div>
                    </div>
                  )}

                  {/* Video content - trường hợp là URL thông thường */}
                  {chapter.video && !isIframeVideo(chapter.video) && (
                    <div className="mb-6">
                      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4 relative">
                        <Image
                          src={chapter.cover || "https://static.vecteezy.com/system/resources/thumbnails/033/057/229/small_2x/teacher-teaching-her-boy-student-the-world-map-video.jpg"}
                          alt={chapter.title}
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
                      <h2 className="text-lg font-medium text-gray-800 mb-2">[Video] {chapter.title}</h2>
                    </div>
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
                            <p className="text-sm font-medium">{attachment.name || "Tài liệu đính kèm"}</p>
                            <p className="text-xs text-gray-500">{attachment.size || "Không có thông tin kích thước"}</p>
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
                      <p dangerouslySetInnerHTML={{ __html: chapter.description }} />
                    </div>
                  ) : (
                    <div className="prose max-w-none">
                      <p className="text-gray-500">Chương này hiện chưa có nội dung mô tả.</p>
                    </div>
                  )}

                  {/* Thông tin chi tiết */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Thông tin chi tiết</h3>
                    <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <p className="font-medium">{new Date(chapter.created_at).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
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
                          <Link href={`/books/${chapter.book_id}`} className="font-medium text-blue-600 hover:text-blue-800 hover:underline">
                            {chapter?.book.name}
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    {/* Thông tin bổ sung */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <div className="bg-gray-100 text-xs text-gray-800 px-3 py-1 rounded-full">
                        Ngày cập nhật: {new Date(chapter.updated_at).toLocaleDateString('vi-VN')}
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
              ) : (
                <div className="prose max-w-none">
                  {/* Nội dung đáp án sẽ được hiển thị ở tab này */}
                  {chapter.exam ? (
                    <div>
                      <h3>Bài kiểm tra</h3>
                      <p>ID bài kiểm tra: {chapter.exam.id}</p>
                      {chapter.exam.file_download && (
                        <div className="mt-4">
                          <a 
                            href={chapter.exam.file_download} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block"
                          >
                            Tải xuống đáp án
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 flex justify-center items-center h-full text-lg font-medium">Chương này không có bài kiểm tra hoặc đáp án đính kèm.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Phần bên phải - Thống kê và bình luận */}
          <div className="lg:col-span-1">
            {/* Stats */}
            <div className="bg-white p-5 rounded-lg shadow-sm mb-6 flex justify-around">
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
                  <p className="text-sm text-gray-500">Số lượt câu hỏi</p>
                  <p className="font-medium">{mockStats.questions}</p>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Bình luận & Câu hỏi</h3>

              <div className="space-y-6">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="pb-5 border-b last:border-b-0 last:pb-0">
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
                              {comment.timestamp}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">{comment.content}</p>
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
                          <div className="flex items-center mt-2">
                            <button className="flex items-center text-green-600 text-sm mr-4">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              <span>Hữu ích</span>
                            </button>
                            <button className="text-blue-600 text-sm">
                              Phản hồi
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                  </div>
                )}
              </div>

              {/* Comment input */}
              <div className="mt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 relative">
                    <Image 
                      src={mockData.avatar_link}
                      alt="Your avatar"
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="border rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                      <textarea
                        placeholder="Viết phản hồi..."
                        className="w-full px-3 py-2 border-none focus:outline-none text-sm"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                      <div className="px-3 py-2 bg-gray-50 border-t flex justify-between items-center">
                        <button className="text-gray-500 hover:text-gray-700">
                          <ImageIcon className="w-5 h-5" />
                        </button>
                        <button
                          className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm font-medium flex items-center"
                          disabled={!comment.trim()}
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Gửi
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
    </div>
  );
};

export default ChapterDetail; 