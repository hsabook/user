"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { loginUser } from '@/app/api/auth/authServices';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    try {
      const result = await loginUser(username, password);

      if (result.success) {
        // Lưu token
        if (result.data.data.accessToken) {
          localStorage.setItem("accessToken", result.data.data.accessToken);
        }
        
        // Chuyển hướng
        router.push('/');
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
              className="w-full py-3.5 px-4 bg-yellow-300 hover:bg-yellow-400 text-black font-medium rounded-md transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </button>

            <button
              type="button"
              onClick={() => console.log("Đăng nhập với google")}
              className="w-full py-3.5 px-4 bg-green-100 hover:bg-green-200 text-black font-medium rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path
                    fill="#4285F4"
                    d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                  />
                  <path
                    fill="#34A853"
                    d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                  />
                </g>
              </svg>
              Hoặc đăng nhập với Google
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
