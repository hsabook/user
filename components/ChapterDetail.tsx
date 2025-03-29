"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText, Clock, BookOpen, MessageCircle, ThumbsUp, Send, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { mockData } from "@/lib/mockData";

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

interface ChapterDetailProps {
  chapter: {
    id: string;
    title: string;
    author: {
      name: string;
      avatar: string;
    };
    content: {
      text: string;
      attachments?: {
        name: string;
        size: string;
        type: string;
      }[];
      video?: {
        title: string;
        description: string;
      };
    };
    stats: {
      views: number;
      questions: number;
    };
    comments: Comment[];
  };
}

const ChapterDetail = ({ chapter }: ChapterDetailProps) => {
  const [activeTab, setActiveTab] = useState<"content" | "answers">("content");
  const [comment, setComment] = useState("");

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
                  <div className="flex items-center mt-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2 relative">
                      <Image 
                        src={chapter.author.avatar}
                        alt={chapter.author.name}
                        width={32}
                        height={32}
                        className="object-cover"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{chapter.author.name}</span>
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
              </div>
            </div>

            {/* Tab content */}
            <div className="bg-white p-5 rounded-lg shadow-sm">
              {activeTab === "content" ? (
                <div>
                  {/* Video section với nút play cải tiến */}
                  {chapter.content.video && (
                    <div className="mb-6">
                      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4 relative">
                        <Image
                          src="https://static.vecteezy.com/system/resources/thumbnails/033/057/229/small_2x/teacher-teaching-her-boy-student-the-world-map-video.jpg"
                          alt="Chapter thumbnail"
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
                      <h2 className="text-lg font-medium text-gray-800 mb-2">[Video] {chapter.content.video.title}</h2>
                      <p className="text-gray-600">{chapter.content.video.description}</p>
                    </div>
                  )}

                  {/* Attachments */}
                  {chapter.content.attachments && chapter.content.attachments.length > 0 && (
                    <div className="mb-6">
                      {chapter.content.attachments.map((attachment, index) => (
                        <div 
                          key={index} 
                          className="border rounded-lg p-3 flex items-center mb-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                            <FileText className="w-5 h-5 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{attachment.name}</p>
                            <p className="text-xs text-gray-500">{attachment.size}</p>
                          </div>
                          <button className="text-sm text-blue-600 hover:text-blue-700">
                            Click to view
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Text content */}
                  <div className="prose max-w-none">
                    <p>{chapter.content.text}</p>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <p>Nội dung đáp án sẽ hiển thị ở đây...</p>
                  {/* Nội dung đáp án sẽ được hiển thị ở tab này */}
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
                  <p className="font-medium">{chapter.stats.views}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 text-green-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Số lượt câu hỏi</p>
                  <p className="font-medium">{chapter.stats.questions}</p>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Bình luận & Câu hỏi</h3>

              <div className="space-y-6">
                {chapter.comments.map((comment) => (
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
                ))}
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