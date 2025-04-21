"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUser } from '@/app/api/auth/authServices';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageError, setImageError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const { login, isAuthenticated } = useAuth();

  // Kiểm tra nếu đã đăng nhập thì chuyển hướng
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectPath);
    }
  }, [isAuthenticated, router, redirectPath]);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Kiểm tra kết nối internet
    if (!navigator.onLine) {
      setError("Không có kết nối internet. Vui lòng kiểm tra lại kết nối của bạn.");
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await loginUser(username, password);

      if (result.success) {
        // Hiển thị thông báo thành công
        setSuccess("Đăng nhập thành công! Đang chuyển hướng...");
        
        // Lưu token và thông tin người dùng qua Context
        if (result.data.data.accessToken) {
          const userData = result.data.data.user || {
            username: username,
            full_name: '',
            email: ''
          };
          
          // Sử dụng hook login để lưu thông tin
          login(result.data.data.accessToken, userData);
          
          // Đợi một chút để đảm bảo localStorage đã được cập nhật
          setTimeout(() => {
            if (redirectPath === '/') {
              window.location.href = redirectPath;
            } else {
              router.push(redirectPath);
            }
          }, 300);
        } else {
          setError("Không nhận được token xác thực");
        }
      } else {
        setError(result.error || "Đăng nhập thất bại");
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

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError("");
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError("");
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Phần hình ảnh bên trái */}
      <div className="hidden lg:block lg:w-2/5 relative p-10">
        <div className="w-full h-full rounded-[30px] overflow-hidden relative">
          <Image
            src={
              imageError
                ? "/images/teacher.png"
                : "https://s3-alpha-sig.figma.com/img/e3c7/2251/266af941e257aaf407a189e3f1034437?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=n1Y2-Kue38sNAwhnmZ8ttK0Pl~-rT0ayKjAf8pfKZt~3zkdVaCi7M8V4ZltHCREGSt2-h5LcrbCdDiAUsOujcMszOHQm~X-bc8~2y6qExUd3mfq8-BcPsXZg5LdXCChIbDlrRPRvJl6cyf~VHTxbayk3Eq5vqfF4VDfKZ9Oz8U-lr8ytH~PqBIpPLkdaxsl6~9T7zBWpmMWrUxZIQ~gJWLyV9hikPRo-SFzUHVAA3Ss~7~zAeCG~DV7TxpOj-ZM3t6k3bOoZU~fku1zX6-S57BO4i7zJW3rQMtAVc-zimorHIoYjJWNJeX2qjUV0wM6zUQ6IfDdGMS6AiL0M0hFC-w__"
            }
            alt="Giáo viên nữ mặc áo vàng cầm sách"
            fill
            style={{ objectFit: "contain", objectPosition: " 70% center" }}
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
          {/* Tiêu đề */}
          <h1 className="text-3xl font-bold mb-2 text-center">Đăng nhập</h1>
          <p className="text-gray-600 mb-10 text-center">
            Hãy đăng nhập để bắt đầu với{" "}
            <span className="font-semibold text-orange-500">HSABook</span>
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
                onChange={handleUsernameChange}
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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="***********"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
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
            
            {/* Success message */}
            {success && (
              <div className="p-3 text-sm bg-green-50 text-green-600 rounded-md">
                {success}
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
