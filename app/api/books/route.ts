import { NextRequest, NextResponse } from 'next/server';

// Đảm bảo route luôn mới và không được cache
export const dynamic = 'force-dynamic';

// Các giá trị hợp lệ cho sort_field và sort_type
const VALID_SORT_FIELDS = ['created_at', 'updated_at', 'name'];
const VALID_SORT_TYPES = ['ASC', 'DESC'];

export async function GET(req: NextRequest) {
  try {
    // Lấy tham số từ URL
    const { searchParams } = new URL(req.url);
    const take = searchParams.get('take') || '10';
    const page = searchParams.get('page') || '1';
    const sort_field = searchParams.get('sort_field') || 'created_at';
    const sort_type = searchParams.get('sort_type') || 'DESC';
    const search = searchParams.get('search') || '';
    const subject = searchParams.get('subject') || '';

    // Lấy token từ request header
    const authorization = req.headers.get('authorization') || '';
    const token = authorization.replace('Bearer ', '');

    // Tạo URL API
    const apiUrl = new URL('https://api.hsabook.vn/books');
    apiUrl.searchParams.set('take', take);
    apiUrl.searchParams.set('page', page);
    apiUrl.searchParams.set('sort_field', sort_field);
    apiUrl.searchParams.set('sort_type', sort_type);
    
    if (search) {
      apiUrl.searchParams.set('search', search);
    }
    
    if (subject) {
      apiUrl.searchParams.set('subject', subject);
    }

    // Headers cho request
    const headers: HeadersInit = {
      'accept': '*/*',
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Gọi API
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    // Lấy dữ liệu từ response
    const data = await response.json();

    // Trả về kết quả
    if (response.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: data.message || 'Lỗi khi lấy danh sách sách' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Lỗi server khi lấy danh sách sách:', error);
    return NextResponse.json(
      { error: 'Lỗi server khi xử lý yêu cầu' },
      { status: 500 }
    );
  }
} 