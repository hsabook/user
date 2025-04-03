"use client";

import { useModal } from '@/contexts/ModalContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ActivateIdModal from '@/components/ActivateIdModal';
import UserProfileModal from '@/components/UserProfileModal';
import { toast } from 'sonner';
import { useState } from 'react';
import { useUserInfo } from '@/hooks/useUserInfo';
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
  
  // Hàm xử lý khi lưu thông tin người dùng
  const handleSaveUserProfile = async (data: typeof userData) => {
    // Mô phỏng gọi API lưu thông tin
    console.log("Saving user data:", data);
    toast.success("Cập nhật thông tin thành công!", {
      description: "Thông tin của bạn đã được lưu",
    });
    return Promise.resolve();
  };

  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar luôn hiển thị */}
      <Sidebar />
      
      {/* Main Content - ẩn khi bất kỳ modal nào mở */}
      <div className={`flex-1 flex flex-col overflow-hidden ${isAnyModalOpen ? 'hidden' : ''}`}>
        <Header />
        
        <div className="flex-1 overflow-auto p-6">
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