import { useState, useCallback } from 'react';
import { Book, BooksResponse, BookPagination, BookQueryParams } from '@/types/book';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState<BookPagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async (params?: BookQueryParams) => {
    setLoading(true);
    setError(null);

    try {
      // Tạo URL với query params
      const url = new URL('/api/books', window.location.origin);
      
      if (params) {
        if (params.take) url.searchParams.set('take', params.take.toString());
        if (params.page) url.searchParams.set('page', params.page.toString());
        if (params.sort_field) url.searchParams.set('sort_field', params.sort_field);
        if (params.sort_type) url.searchParams.set('sort_type', params.sort_type);
        if (params.search) url.searchParams.set('search', params.search);
      }

      // Lấy access token từ localStorage (nếu có)
      let token = '';
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('accessToken') || '';
      }

      // Headers cho request
      const headers: HeadersInit = {
        'accept': '*/*'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Gọi API
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Không thể lấy danh sách sách');
      }

      const result: BooksResponse = await response.json();

      if (result.status_code === 200 && result.messages === 'Success') {
        setBooks(result.data.data);
        setPagination(result.data.pagination);
        return {
          books: result.data.data,
          pagination: result.data.pagination
        };
      } else {
        throw new Error(result.messages || 'Lỗi không xác định');
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi lấy danh sách sách');
      return {
        books: [],
        pagination: null
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    books,
    pagination,
    loading,
    error,
    fetchBooks
  };
} 