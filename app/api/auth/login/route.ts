import { loginUser } from '@/lib/authServices';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const result = await loginUser(username, password);

    if (result.success) {
      return NextResponse.json(result.data, { status: 200 });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }
  } catch (error) {
    console.error('Lỗi API route đăng nhập:', error);
    return NextResponse.json(
      { error: 'Lỗi server khi xử lý đăng nhập' },
      { status: 500 }
    );
  }
} 

