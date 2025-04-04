"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUser } from '@/app/api/auth/authServices';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  // Kiểm tra nếu đã đăng nhập thì chuyển hướng
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        router.push(redirectPath);
      }
    }
  }, [router, redirectPath]);

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    try {
      const result = await loginUser(username, password);

      if (result.success) {
        // Lưu token vào localStorage
        if (result.data.data.accessToken) {
          localStorage.setItem("accessToken", result.data.data.accessToken);
          
          // Lưu token vào cookie để middleware có thể truy cập
          document.cookie = `accessToken=${result.data.data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
          
          // Lưu thông tin người dùng vào localStorage
          if (result.data.data.user) {
            localStorage.setItem("userFullName", result.data.data.user.full_name || "");
            localStorage.setItem("username", result.data.data.user.username || "");
            if (result.data.data.user.avatar) {
              localStorage.setItem("userAvatar", result.data.data.user.avatar);
            }
          }
        }
        
        // Chuyển hướng về trang được yêu cầu hoặc trang chủ
        router.push(redirectPath);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Phần hình ảnh bên trái */}
      <div className="hidden lg:block lg:w-2/5 relative p-10">
        <div className="w-full h-full rounded-[30px] overflow-hidden relative">
          <Image
            src={
              imageError
                ? "/images/teacher.jpg"
                : "https://s3-alpha-sig.figma.com/img/e3c7/2251/266af941e257aaf407a189e3f1034437?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=n1Y2-Kue38sNAwhnmZ8ttK0Pl~-rT0ayKjAf8pfKZt~3zkdVaCi7M8V4ZltHCREGSt2-h5LcrbCdDiAUsOujcMszOHQm~X-bc8~2y6qExUd3mfq8-BcPsXZg5LdXCChIbDlrRPRvJl6cyf~VHTxbayk3Eq5vqfF4VDfKZ9Oz8U-lr8ytH~PqBIpPLkdaxsl6~9T7zBWpmMWrUxZIQ~gJWLyV9hikPRo-SFzUHVAA3Ss~7~zAeCG~DV7TxpOj-ZM3t6k3bOoZU~fku1zX6-S57BO4i7zJW3rQMtAVc-zimorHIoYjJWNJeX2qjUV0wM6zUQ6IfDdGMS6AiL0M0hFC-w__"
            }
            alt="Giáo viên nữ mặc áo vàng cầm sách"
            fill
            style={{ objectFit: "cover", objectPosition: " 70% center" }}
            priority
            onError={() => setImageError(true)}
          />
        </div>
      </div>

      {/* Phần đăng nhập bên phải */}
      <div className="w-full lg:w-3/5 flex flex-col justify-center px-6 md:px-12 lg:px-24 py-8 relative">
        {/* Nền vân vân cho phần đăng nhập */}
        <div className="absolute bottom-0 right-0 w-full h-full overflow-hidden z-[-1]">
          <svg
            viewBox="0 0 600 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-0 right-0 w-full opacity-[0.03]"
          >
            <path
              d="M-30.5 800C-200.5 600 199.5 400 -30.5 200C-200.5 50 199.5 -100 -30.5 -300"
              stroke="#FF9800"
              strokeWidth="100"
            />
            <path
              d="M600 800C430 600 830 400 600 200C430 50 830 -100 600 -300"
              stroke="#FF9800"
              strokeWidth="100"
            />
          </svg>
        </div>

        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <div className="flex items-center mb-12">
            <div className="w-14 h-14 relative mr-3 flex-shrink-0">
              <Image
                src="/images/hsa-logo.svg"
                alt="HSA Education Logo"
                width={56}
                height={56}
                className="w-full h-full"
              />
            </div>
            <div>
              <div className="text-2xl font-bold text-black leading-tight">
                HSA
              </div>
              <div className="text-xl font-bold text-black leading-tight">
                EDUCATION
              </div>
            </div>
          </div>

          {/* Tiêu đề */}
          <h1 className="text-3xl font-bold mb-2">Đăng nhập</h1>
          <p className="text-gray-600 mb-10">
            Hãy đăng nhập để bắt đầu với{" "}
            <span className="font-semibold">HSA Education</span>
          </p>

          {/* Form đăng nhập */}
          <form className="space-y-6" onSubmit={formSubmitHandler}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tài khoản
              </label>
              <input
                id="username"
                type="text"
                placeholder="@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                placeholder="***********"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 text-sm bg-red-50 text-red-500 rounded-md">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-3.5 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          {/* Đăng ký */}
          <div className="mt-10 text-center">
            <p className="text-gray-600">
              Bạn chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="text-black font-semibold underline"
              >
                Đăng Ký Tại Đây
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
