export interface Book {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  code_id: number;
  description: string;
  user_id: string;
  name: string;
  name_search: string;
  avatar: string;
  quantity: number;
  expiration_date: number;
  active: boolean;
  publishing_house: string;
  subject: string;
  is_file: boolean;
  file_download: null | string;
  xlsx_files: XlsxFile[];
  is_public: boolean;
  file_code_id_url: string;
  file_code_id_upload_url: string;
  status_add_code_id: string;
  book_tags: BookTag[];
  authors: any[]; // Có thể chỉnh sửa khi có dữ liệu tác giả đầy đủ
}

export interface XlsxFile {
  name: string;
  url: string;
  time: string;
  amount: number;
  timestamp: number;
}

export interface BookTag {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  book_id: string;
  tag_id: string;
  user_id: null | string;
  tag: Tag;
  _constructor_name_: string;
}

export interface Tag {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  description: null | string;
  user_id: null | string;
  updated_by: null | string;
  deleted_by: null | string;
  name: string;
  name_search: null | string;
  avatar: null | string;
  parent_id: null | string;
  _constructor_name_: string;
}

export interface BookPagination {
  current_page: number;
  total_pages: number;
  take: number;
  total: number;
}

export interface BooksResponseData {
  pagination: BookPagination;
  data: Book[];
}

export interface BooksResponse {
  messages: string;
  data: BooksResponseData;
  status_code: number;
}

export interface BookQueryParams {
  take?: number;
  page?: number;
  sort_field?: 'created_at' | 'updated_at' | 'name';
  sort_type?: 'ASC' | 'DESC';
  search?: string;
} 