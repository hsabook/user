"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { registerUser } from "@/lib/authServices";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    
    // Kiểm tra đồng ý điều khoản
    if (!acceptTerms) {
      setError("Bạn cần đồng ý với điều khoản dịch vụ và chính sách bảo mật");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const phoneNumber = "";
      const avatar = "";
      const username = "";
      const response = await registerUser(fullName, email, password, confirmPassword, phoneNumber, avatar, username);

      if (response.success) {
        // Đăng ký thành công
        console.log("Đăng ký thành công:", response.data);
        
        // Chuyển hướng đến trang đăng nhập hoặc dashboard
        router.push('/login');
      } else {
        // Xử lý lỗi từ API
        setError(response.error || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      setError("Có lỗi xảy ra khi kết nối đến máy chủ. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
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

      {/* Phần đăng ký bên phải */}
      <div className="w-full lg:w-3/5 flex flex-col justify-center px-6 md:px-12 lg:px-24 py-8 relative">
        {/* Nền vân vân cho phần đăng ký */}
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
          <div className="flex items-center mb-10">
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
              <div className="text-2xl font-bold text-black leading-tight">HSA</div>
              <div className="text-xl font-bold text-black leading-tight">EDUCATION</div>
            </div>
          </div>

          {/* Tiêu đề */}
          <h1 className="text-3xl font-bold mb-2">Đăng ký</h1>
          <p className="text-gray-600 mb-8">
            Thông tin để đăng ký tài khoản <span className="font-semibold">HSA Education</span>
          </p>

          {/* Form đăng ký */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="***********"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                />
              </div>
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                Tôi đồng ý với <Link href="#" className="text-blue-600 hover:underline">Điều khoản Dịch vụ</Link> và <Link href="#" className="text-blue-600 hover:underline">Chính sách Bảo mật</Link>*
              </label>
            </div>

            {/* Hiển thị lỗi */}
            {error && (
              <div className="p-3 text-sm bg-red-50 text-red-500 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-yellow-300 hover:bg-yellow-400 text-black font-medium rounded-md transition-colors mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </form>

          {/* Đăng nhập */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Bạn đã có tài khoản?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}