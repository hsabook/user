"use client";

import { useModal } from '@/contexts/ModalContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ActivateIdModal from '@/components/ActivateIdModal';
import UserProfileModal from '@/components/UserProfileModal';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useUserInfo } from '@/hooks/useUserInfo';
import { X } from 'lucide-react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { 
    isActivateModalOpen, 
    closeActivateModal,
    isUserProfileModalOpen,
    closeUserProfileModal,
    isAnyModalOpen
  } = useModal();
  
  // Sử dụng hook useUserInfo để lấy thông tin người dùng
  const { userData, loading, error, fetchUserInfo, updateUserInfo } = useUserInfo();
  
  // State kiểm soát hiển thị sidebar trên mobile
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Fetch thông tin người dùng khi component mount
  useEffect(() => {
    // Chỉ fetch nếu chưa có dữ liệu
    if (!userData && !loading) {
      fetchUserInfo();
    }
  }, [userData, loading, fetchUserInfo]);
  
  // Hàm xử lý khi lưu thông tin người dùng
  const handleSaveUserProfile = async (data: any) => {
    try {
      // Chuyển đổi dữ liệu từ format UserProfileModal sang format API
      const apiData = {
        full_name: data.fullName,
        email: data.email,
        phone_number: data.phone,
        description: data.bio,
        username: data.username,
        avatar: data.avatar
      };
      
      // Gọi API cập nhật thông tin
      await updateUserInfo(apiData);
      
      // Hiển thị thông báo thành công
      toast.success("Cập nhật thông tin thành công!", {
        description: "Thông tin của bạn đã được lưu",
      });
      
      return Promise.resolve();
    } catch (error) {
      // Hiển thị thông báo lỗi
      toast.error("Không thể cập nhật thông tin", {
        description: error instanceof Error ? error.message : "Có lỗi xảy ra",
      });
      
      return Promise.reject(error);
    }
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

  // Hàm toggle sidebar
  const toggleSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  
  // Chuyển đổi dữ liệu từ API sang format UserProfileModal
  const userProfileData = userData ? {
    fullName: userData.full_name || '',
    email: userData.email || '',
    phone: userData.phone_number || '',
    bio: userData.description || '',
    username: userData.username || ''
  } : null;
  
  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Sidebar trên desktop - hidden trên mobile */}
      <div className="hidden lg:block">
        <Sidebar userData={userData} />
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
        <Sidebar userData={userData} />
      </div>
      
      {/* Main Content - ẩn khi bất kỳ modal nào mở */}
      <div className={`flex-1 flex flex-col overflow-hidden ${isAnyModalOpen ? 'hidden' : ''}`}>
        {/* Truyền toggleSidebar và userData vào Header */}
        <Header toggleSidebar={toggleSidebar} userData={userData} />
        
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
        userData={userProfileData}
        onSave={handleSaveUserProfile}
        isLoading={loading}
        error={error}
      />
    </div>
  );
} 