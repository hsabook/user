// components/UserProfileModal.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ChangePasswordModal from "./ChangePasswordModal";

interface UserData {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  username: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData;
  onSave: (data: UserData) => void;
  isLoading?: boolean;
  error?: string | null;
}

const UserProfileModal = ({ isOpen, onClose, userData, onSave, isLoading, error }: UserProfileModalProps) => {
  const [editedUser, setEditedUser] = useState<UserData>(userData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setEditedUser(userData);
    setIsEditing(false); // Reset về trạng thái view mỗi khi mở modal
  }, [userData, isOpen]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setUpdateError(null);
      
      // Chuyển đổi dữ liệu từ format UserData sang format API cần
      const apiData = {
        full_name: editedUser.fullName,
        email: editedUser.email,
        phone_number: editedUser.phone,
        description: editedUser.bio,
        username: editedUser.username
        // Không gửi password trừ khi người dùng chọn thay đổi mật khẩu
      };
      
      // Gọi hàm onSave đã được truyền từ component cha
      await onSave(editedUser);
      
      // Nếu lưu thành công, chuyển về chế độ xem
      setIsEditing(false);
      
      // Sử dụng toast thay vì alert
      toast({
        title: "Thành công",
        description: "Cập nhật thông tin thành công!",
        variant: "default", // hoặc "destructive" nếu là thông báo lỗi
      });
    } catch (err) {
      // Xử lý lỗi
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi cập nhật thông tin";
      setUpdateError(errorMessage);
      
      // Hiển thị toast lỗi
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      // Nếu đang ở chế độ edit, thì submit form
      const form = document.getElementById('userProfileForm') as HTMLFormElement;
      if (form) form.requestSubmit();
    } else {
      // Nếu đang ở chế độ view, thì chuyển sang chế độ edit
      setIsEditing(true);
    }
  };

  const cancelEdit = () => {
    setEditedUser(userData); // Reset về dữ liệu ban đầu
    setIsEditing(false); // Chuyển về chế độ view
  };

  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  // Hàm xử lý đổi mật khẩu
  const handleChangePassword = async (data: { password: string; newPassword: string }) => {
    try {
      // Gọi API đổi mật khẩu ở đây
      // Ví dụ:
      // await changePassword(data);
      
      // Đây là nơi bạn sẽ gọi API thực tế để thay đổi mật khẩu
      const response = await fetch("https://api.hsabook.vn/users/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({
          password: data.newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể thay đổi mật khẩu");
      }

      // Nếu thành công, đóng modal
      closePasswordModal();
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      throw error; // Ném lỗi để modal password có thể xử lý
    }
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-2">Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4">
        <div 
          ref={modalRef}
          className="bg-white rounded-lg shadow-xl w-full max-w-5xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-semibold text-gray-800">Thông tin</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <form id="userProfileForm" onSubmit={handleSubmit} className="p-4">
            {/* Hiển thị lỗi cập nhật nếu có */}
            {updateError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                {updateError}
              </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Ảnh bên trái */}
              <div className="w-full md:w-1/3">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src="https://s3-alpha-sig.figma.com/img/e3c7/2251/266af941e257aaf407a189e3f1034437?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=n1Y2-Kue38sNAwhnmZ8ttK0Pl~-rT0ayKjAf8pfKZt~3zkdVaCi7M8V4ZltHCREGSt2-h5LcrbCdDiAUsOujcMszOHQm~X-bc8~2y6qExUd3mfq8-BcPsXZg5LdXCChIbDlrRPRvJl6cyf~VHTxbayk3Eq5vqfF4VDfKZ9Oz8U-lr8ytH~PqBIpPLkdaxsl6~9T7zBWpmMWrUxZIQ~gJWLyV9hikPRo-SFzUHVAA3Ss~7~zAeCG~DV7TxpOj-ZM3t6k3bOoZU~fku1zX6-S57BO4i7zJW3rQMtAVc-zimorHIoYjJWNJeX2qjUV0wM6zUQ6IfDdGMS6AiL0M0hFC-w__"
                    alt="User profile"
                    fill
                    style={{ objectFit: "cover", objectPosition: "70% center" }}
                  />
                </div>
              </div>

              {/* Form bên phải */}
              <div className="w-full md:w-2/3 space-y-4">
                {/* Họ và tên */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={editedUser?.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-md ${
                      isEditing 
                        ? "focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                    required
                    disabled={!isEditing}
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={editedUser?.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-md ${
                      isEditing 
                        ? "focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                    required
                    disabled={!isEditing}
                  />
                </div>

                {/* Số điện thoại */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={editedUser?.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-md ${
                      isEditing 
                        ? "focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                    disabled={!isEditing}
                  />
                </div>

                {/* Giới thiệu */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Giới thiệu
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={editedUser?.bio}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-md ${
                      isEditing 
                        ? "focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                    disabled={!isEditing}
                  />
                </div>

                {/* Tài khoản */}
                <div className="pt-3">
                  <h3 className="font-medium text-gray-900 mb-3">Tài khoản</h3>
                  
                  {/* Tên tài khoản */}
                  <div className="mb-3">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Tên tài khoản
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={editedUser?.username}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-md ${
                        isEditing 
                          ? "focus:outline-none focus:ring-1 focus:ring-blue-500" 
                          : "bg-gray-50 cursor-not-allowed"
                      }`}
                      required
                      disabled={!isEditing}
                    />
                  </div>
                  
                  {/* Thay đổi mật khẩu */}
                  <button
                    type="button"
                    className={`w-full text-center py-3 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors ${
                      !isEditing ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!isEditing}
                    onClick={openPasswordModal}
                  >
                    Thay đổi mật khẩu
                  </button>
                </div>
              </div>
            </div>

            {/* Button area */}
            <div className="mt-6 flex justify-end gap-3">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-8 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    disabled={isSaving}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2 bg-yellow-300 text-black font-medium rounded-md hover:bg-yellow-400 transition-colors flex items-center"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <div className="mr-2 h-4 w-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Lưu
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={toggleEditMode}
                  className="px-8 py-2 bg-yellow-300 text-black font-medium rounded-md hover:bg-yellow-400 transition-colors flex items-center"
                >
                  <span className="mr-1">Chỉnh sửa</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Modal đổi mật khẩu */}
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={closePasswordModal}
        onSubmit={handleChangePassword}
      />
    </>
  );
};

export default UserProfileModal;