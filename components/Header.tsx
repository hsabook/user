"use client";

import { useState, useEffect } from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import UserProfileModal from '@/components/UserProfileModal';
import { useUserInfo } from '@/hooks/useUserInfo';

// Định nghĩa interface cho dữ liệu API trả về
interface ApiUserData {
  username: string;
  email: string;
  phone_number: string;
  full_name: string;
  avatar: string | null;
  description: string | null;
  role: string;
  rank: number;
  status: string;
}

// Định nghĩa interface cho dữ liệu local sử dụng trong component
interface LocalUserData {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  username: string;
}

const Header = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { userData: apiUserData, loading, error, fetchUserInfo, updateUserInfo } = useUserInfo();
  
  // State để lưu trữ dữ liệu người dùng ở định dạng phù hợp với UserProfileModal
  const [localUserData, setLocalUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    username: ""
  });
  
  // Cập nhật localUserData khi apiUserData thay đổi
  useEffect(() => {
    if (apiUserData) {
      setLocalUserData({
        fullName: apiUserData.full_name,
        email: apiUserData.email,
        phone: apiUserData.phone_number,
        bio: apiUserData.description || "",
        username: apiUserData.username
      });
    }
  }, [apiUserData]);
  
  // Mở modal và fetch dữ liệu người dùng
  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true);
    fetchUserInfo();
  };
  
  // Đóng modal
  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };
  
  // Xử lý khi người dùng lưu thông tin
  const handleSaveUserData = async (data: any) => {
    try {
      // Chuyển đổi từ định dạng của UserProfileModal sang định dạng của API
      const apiData = {
        full_name: data.fullName,
        email: data.email,
        phone_number: data.phone,
        description: data.bio,
        username: data.username
      };
      
      // Gọi API cập nhật
      await updateUserInfo(apiData);
      
      // Cập nhật dữ liệu local
      setLocalUserData({...localUserData, ...data});
      
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      throw error; // Ném lỗi để UserProfileModal có thể bắt và xử lý
    }
  };

  return (
    <header className="h-16 border-b flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative w-72">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="pl-10 pr-3 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Search"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
          <Bell className="w-5 h-5 text-gray-600" />
        </div>
        
        <div className="flex items-center cursor-pointer" onClick={handleOpenProfileModal}>
          <div className="relative h-9 w-9 rounded-full overflow-hidden bg-gray-200">
            {apiUserData?.avatar ? (
              <Image 
                src={apiUserData.avatar} 
                alt={apiUserData.full_name || "User avatar"} 
                width={36} 
                height={36}
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white">
                {localUserData.fullName ? localUserData.fullName.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
          <span className="ml-2 text-sm font-medium hidden md:block">
            {apiUserData?.full_name || "Người dùng"}
          </span>
          <ChevronDown className="w-4 h-4 ml-1 text-gray-600" />
        </div>
      </div>

      {/* Modal */}
      {isProfileModalOpen && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={handleCloseProfileModal}
          userData={localUserData}
          onSave={handleSaveUserData}
          isLoading={loading}
          error={error}
        />
      )}
    </header>
  );
};

export default Header; 