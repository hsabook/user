"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Chỉ kiểm tra khi đã load xong trạng thái đăng nhập
    if (!isLoading) {
      if (!isAuthenticated) {
        // Điều hướng về trang đăng nhập với redirect parameter
        const encodedRedirect = encodeURIComponent(pathname);
        router.push(`/login?redirect=${encodedRedirect}`);
      }
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Hiển thị màn hình loading trong quá trình kiểm tra
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Chỉ hiển thị children nếu đã đăng nhập
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Không hiển thị gì khi chưa đăng nhập và đang chuyển hướng
  return null;
} 