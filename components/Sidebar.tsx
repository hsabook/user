"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  BookOpen,
  Book,
  MessageSquare,
  HelpCircle,
  LogOut,
  Plus,
  Home,
  Video,
  CalendarDays,
  GraduationCap,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { useModal } from "@/contexts/ModalContext";
import { usePathname, useRouter } from 'next/navigation';

interface SidebarProps {
  userData?: {
    full_name?: string;
    username?: string;
    avatar?: string | null;
  } | null;
}

const Sidebar = ({ userData: sidebarUserData }: SidebarProps) => {
  const [activeLink, setActiveLink] = useState("/books");
  const { openActivateModal } = useModal();
  const [userFullName, setUserFullName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  
  // Hàm cập nhật giá trị từ localStorage (trích xuất từ phần dispatchStorageEvent được sửa)
  const getUsernameFromStorage = () => {
    if (typeof window !== 'undefined') {
      setUsername(localStorage.getItem('username') || '');
      setUserFullName(localStorage.getItem('userFullName') || 'Khách');
      setUserAvatar(localStorage.getItem('userAvatar') || null);
    }
  };
  
  // Lắng nghe sự kiện thay đổi từ localStorage
  useEffect(() => {
    // Gọi lần đầu khi component mount
    getUsernameFromStorage();
    
    // Lắng nghe sự kiện từ window
    const handleStorageChange = () => {
      getUsernameFromStorage();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localstorage-changed', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localstorage-changed', handleStorageChange);
    };
  }, []);
  
  // Cập nhật dữ liệu localStorage khi userData từ props thay đổi
  useEffect(() => {
    if (sidebarUserData) {
      // Cập nhật localStorage khi có dữ liệu mới từ props
      if (typeof window !== 'undefined') {
        if (sidebarUserData.username) localStorage.setItem('username', sidebarUserData.username);
        if (sidebarUserData.full_name) localStorage.setItem('userFullName', sidebarUserData.full_name);
        if (sidebarUserData.avatar) localStorage.setItem('userAvatar', sidebarUserData.avatar);
        
        // Cập nhật state local
        setUsername(sidebarUserData.username || '');
        setUserFullName(sidebarUserData.full_name || 'Khách');
        setUserAvatar(sidebarUserData.avatar || null);
      }
    }
  }, [sidebarUserData]);
  
  const handleLogout = () => {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
      localStorage.removeItem('userFullName');
      localStorage.removeItem('userAvatar');
      
      // Xóa cookie
      document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
      
      // Redirect về trang login
      router.push('/login');
    }
  };
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  const menuItems = [
    { href: "/", icon: <Home className="w-5 h-5" />, text: "Trang chủ" },
    { href: "", icon: <GraduationCap className="w-5 h-5" />, text: "Khoá học (soon)" },
    { href: "/activated-books", icon: <BookOpen className="w-5 h-5" />, text: "Sách đã kích hoạt" },
  ];

  return (
    <div className="w-60 min-h-screen flex flex-col relative z-10">
      {/* Backdrop blur và gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-100/80 via-white/70 to-green-50/60 backdrop-blur-md border-r border-white/40 -z-10"></div>
      
      {/* Hiệu ứng glow top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400/0 via-green-500/70 to-green-400/0"></div>
      
      {/* Logo */}
      <div className="p-6 mb-2 flex justify-center">
        <div className="w-16 h-16 relative mr-3 flex-shrink-0 rounded-full bg-white/60 p-2 shadow-lg border border-green-100/70">
          <Image
            src="/images/hsa-logo.svg"
            alt="HSA Education Logo"
            width={56}
            height={56}
            className="w-full h-full drop-shadow-sm"
          />
        </div>
      </div>

      {/* User Profile */}
      <div className="px-5 py-4 flex items-center mb-6">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-200 to-green-100 overflow-hidden mr-3 border-2 border-white shadow-md">
          {sidebarUserData?.avatar ? (
            <Image 
              src={sidebarUserData.avatar} 
              alt={sidebarUserData.full_name || 'User avatar'} 
              width={44} 
              height={44} 
              style={{ objectFit: 'cover' }} 
              className="w-full h-full"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-green-500 to-green-400 text-white">
              {sidebarUserData?.full_name ? sidebarUserData.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-800 truncate">{sidebarUserData?.full_name || 'User'}</p>
          <p className="text-xs text-gray-500 truncate">@{sidebarUserData?.username || 'username'}</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow px-3">
        <ul>
          {menuItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive(item.href)
                    ? "bg-white/70 text-green-700 shadow-sm border border-green-100/50"
                    : "text-gray-700 hover:bg-white/40 hover:shadow-sm"
                }`}
                onClick={() => setActiveLink(item.href)}
              >
                <span className={`mr-3 ${isActive(item.href) ? "text-green-600" : ""}`}>
                  {item.icon}
                </span>
                <span>{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Activate ID Button */}
      <div className="p-5">
        <button 
          onClick={openActivateModal} 
          className="flex items-center justify-center w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 border border-green-400 hover:from-green-500 hover:to-green-400"
        >
          <Plus className="w-5 h-5 mr-2" />
          Kích hoạt ID
        </button>
      </div>

      {/* Logout */}
      <div className="p-5 mt-2">
        <button 
          onClick={handleLogout}
          className="flex items-center text-gray-600 hover:text-green-800 transition-colors duration-300 mx-1"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Đăng xuất</span>
        </button>
      </div>
      
      {/* Hiệu ứng glow bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400/0 via-green-400/50 to-green-400/0"></div>
    </div>
  );
};

export default Sidebar;
