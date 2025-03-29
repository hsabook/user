"use client";

import Link from "next/link";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-md shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Quên mật khẩu</h1>
        <p className="mb-8 text-center text-gray-600">
          Trang này chỉ là mẫu. Vui lòng quay lại trang đăng nhập.
        </p>
        <Link 
          href="/login" 
          className="block w-full text-center py-3 px-4 bg-yellow-300 hover:bg-yellow-400 text-black font-medium rounded-md"
        >
          Quay lại trang đăng nhập
        </Link>
      </div>
    </div>
  );
} 