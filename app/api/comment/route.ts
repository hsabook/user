import { NextRequest, NextResponse } from 'next/server';
import { Comment, CommentResponse, CommentQueryParams } from '@/types/comment';
// import { getServerSession } from 'next-auth';

// Mock data cho comments
const mockComments: Comment[] = [
  {
    children: [],
    id: "97af3f93-a785-465f-a54e-c86f9c7dcbf7",
    created_at: "2025-04-18T16:44:28.589Z",
    updated_at: "2025-04-18T16:44:28.589Z",
    deleted_at: null,
    content: "Đây là bình luận về quyển sách rất hay.",
    parent_id: null,
    book_id: "1",
    menu_book_id: null,
    question_id: null,
    user: {
      id: "e06cb48f-5d36-46b1-98f3-e574fcbefffe",
      full_name: "Nguyễn Văn A",
      email: "user@example.com",
      avatar: "https://example.com/avatar.jpg",
      role: "user",
      status: "active"
    }
  },
  {
    children: [
      {
        id: "87af3f93-a785-465f-a54e-c86f9c7dcbf8",
        created_at: "2025-04-18T17:44:28.589Z",
        updated_at: "2025-04-18T17:44:28.589Z",
        deleted_at: null,
        content: "Tôi cũng đồng ý với bạn.",
        parent_id: "97af3f93-a785-465f-a54e-c86f9c7dcbf7",
        book_id: "1",
        menu_book_id: null,
        question_id: null,
        user: {
          id: "f06cb48f-5d36-46b1-98f3-e574fcbefff1",
          full_name: "Trần Thị B",
          email: "userb@example.com",
          avatar: "https://example.com/avatar2.jpg",
          role: "user",
          status: "active"
        }
      }
    ],
    id: "59af3f93-a785-465f-a54e-c86f9c7dcbf9",
    created_at: "2025-04-19T16:44:28.589Z",
    updated_at: "2025-04-19T16:44:28.589Z",
    deleted_at: null,
    content: "Bài tập trong chương này hơi khó.",
    parent_id: null,
    book_id: "1",
    menu_book_id: "1",
    question_id: null,
    user: {
      id: "d06cb48f-5d36-46b1-98f3-e574fcbefff2",
      full_name: "Lê Văn C",
      email: "userc@example.com",
      avatar: "https://example.com/avatar3.jpg",
      role: "user",
      status: "active"
    }
  },
  {
    children: [],
    id: "39af3f93-a785-465f-a54e-c86f9c7dcbf0",
    created_at: "2025-04-20T16:44:28.589Z",
    updated_at: "2025-04-20T16:44:28.589Z",
    deleted_at: null,
    content: "Tôi không hiểu câu hỏi này lắm, ai giải thích giúp được không?",
    parent_id: null,
    book_id: "1",
    menu_book_id: "1",
    question_id: "1",
    user: {
      id: "c06cb48f-5d36-46b1-98f3-e574fcbefff3",
      full_name: "Phạm Thị D",
      email: "userd@example.com",
      avatar: "https://example.com/avatar4.jpg",
      role: "user",
      status: "active"
    }
  }
];

/**
 * GET /api/comment
 * Lấy danh sách comment với các tham số lọc và phân trang
 */
export async function GET(request: NextRequest) {
  try {
    // Lấy các query params
    const searchParams = request.nextUrl.searchParams;
    const queryParams: CommentQueryParams = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      book_id: searchParams.get('book_id') || undefined,
      menu_book_id: searchParams.get('menu_book_id') || undefined,
      question_id: searchParams.get('question_id') || undefined
    };
    
    // Lưu ý: Code xác thực đã được comment để tránh lỗi liên quan đến module next-auth
    // Trong thực tế, bạn cần triển khai xác thực phù hợp với hệ thống của bạn
    
    // Lọc comments dựa trên các tham số
    let filteredComments = [...mockComments];
    
    if (queryParams.book_id) {
      filteredComments = filteredComments.filter(comment => comment.book_id === queryParams.book_id);
    }
    
    if (queryParams.menu_book_id) {
      filteredComments = filteredComments.filter(comment => comment.menu_book_id === queryParams.menu_book_id);
    }
    
    if (queryParams.question_id) {
      filteredComments = filteredComments.filter(comment => comment.question_id === queryParams.question_id);
    }
    
    // Sắp xếp theo thời gian tạo mới nhất
    filteredComments.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    // Tính toán phân trang
    const startIndex = (queryParams.page! - 1) * queryParams.limit!;
    const endIndex = startIndex + queryParams.limit!;
    const paginatedComments = filteredComments.slice(startIndex, endIndex);
    
    // Trả về response
    const response: CommentResponse = {
      data: paginatedComments,
      total: filteredComments.length,
      page: queryParams.page!,
      limit: queryParams.limit!
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error getting comments:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi lấy danh sách bình luận' },
      { status: 500 }
    );
  }
} 