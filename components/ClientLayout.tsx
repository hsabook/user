"use client";

import { useModal } from '@/contexts/ModalContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ActivateIdModal from '@/components/ActivateIdModal';
import UserProfileModal from '@/components/UserProfileModal';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useUserInfo } from '@/hooks/useUserInfo';
import { MenuIcon, X } from 'lucide-react';

// Dữ liệu mẫu cho user - sau này thay thế bằng dữ liệu từ API
const userData = {
  fullName: "Alex Rouge",
  email: "alex@example.com",
  phone: "0123456789",
  bio: "Là một người yêu thích đọc sách và học tập.",
  username: "alexrouge",
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { fetchUserInfo } = useUserInfo();
  const { 
    isActivateModalOpen, 
    closeActivateModal,
    isUserProfileModalOpen,
    closeUserProfileModal,
    isAnyModalOpen
  } = useModal();
  
  // State lưu trữ thông tin người dùng
  const [user, setUser] = useState(userData);
  // State kiểm soát hiển thị sidebar trên mobile
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Hàm xử lý khi lưu thông tin người dùng
  const handleSaveUserProfile = async (data: typeof userData) => {
    // Mô phỏng gọi API lưu thông tin
    console.log("Saving user data:", data);
    toast.success("Cập nhật thông tin thành công!", {
      description: "Thông tin của bạn đã được lưu",
    });
    return Promise.resolve();
  };

  // Đóng sidebar khi resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ngăn scroll khi sidebar mobile mở
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen]);
  
  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Sidebar trên desktop - hidden trên mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Overlay khi sidebar mobile mở */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar trên mobile - responsive */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute top-3 right-3 cursor-pointer p-1" onClick={() => setIsMobileSidebarOpen(false)}>
          <X className="h-6 w-6 text-gray-500" />
        </div>
        <Sidebar />
      </div>
      
      {/* Main Content - ẩn khi bất kỳ modal nào mở */}
      <div className={`flex-1 flex flex-col overflow-hidden ${isAnyModalOpen ? 'hidden' : ''}`}>
        {/* Button toggle sidebar trên mobile */}
        <div className="lg:hidden absolute top-3 left-4 z-30">
          <button 
            className="p-2 rounded-md bg-white/80 shadow-sm border border-gray-100"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <MenuIcon className="h-5 w-5 text-green-600" />
          </button>
        </div>
        
        <Header />
        
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>

      {/* Modal Activate ID */}
      <ActivateIdModal 
        isOpen={isActivateModalOpen} 
        onClose={closeActivateModal} 
        onSuccess={() => {
          toast.success("Sách đã được kích hoạt thành công", {
            description: "Bạn có thể truy cập sách này trong thư viện của mình",
          });
          closeActivateModal();
        }} 
      />
      
      {/* Modal Thông tin người dùng */}
      <UserProfileModal
        isOpen={isUserProfileModalOpen}
        onClose={closeUserProfileModal}
        userData={user}
        onSave={handleSaveUserProfile}
      />
    </div>
  );
} 