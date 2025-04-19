export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar: string;
  role: string;
  status: string;
}

export interface CommentChild {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  content: string;
  parent_id: string;
  book_id: string | null;
  menu_book_id: string | null;
  question_id: string | null;
  user: User;
}

export interface Comment {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  content: string;
  parent_id: null | string;
  book_id: string | null;
  menu_book_id: string | null;
  question_id: string | null;
  user: User;
  children: CommentChild[];
}

export interface CommentResponse {
  data: Comment[];
  total: number;
  page: number;
  limit: number;
}

export interface CommentQueryParams {
  page?: number;
  limit?: number;
  book_id?: string;
  menu_book_id?: string;
  question_id?: string;
} 