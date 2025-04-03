"use client";

import { useState, useRef, useEffect } from "react";
import { X, Eye, EyeOff, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { password: string; newPassword: string }) => Promise<void>;
}

const ChangePasswordModal = ({ isOpen, onClose, onSubmit }: ChangePasswordModalProps) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    // Ngăn scroll khi modal mở
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới không khớp");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Call the onSubmit function passed as prop
      await onSubmit({ password: oldPassword, newPassword });
      
      // If successful, close modal and show toast
      onClose();
      toast({
        title: "Thành công",
        description: "Mật khẩu đã được thay đổi",
        variant: "default",
      });
    } catch (err) {
      // Handle error
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi thay đổi mật khẩu";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fadeIn"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-3 sm:p-4 border-b">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Thay đổi mật khẩu</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-3 sm:p-4">
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {/* Old password */}
          <div className="mb-4">
            <label htmlFor="old-password" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu hiện tại
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="old-password"
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="pl-10 pr-10 py-2 sm:py-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Nhập mật khẩu hiện tại"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          {/* New password */}
          <div className="mb-4">
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu mới
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 pr-10 py-2 sm:py-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Nhập mật khẩu mới"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          {/* Confirm password */}
          <div className="mb-6">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu mới
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10 py-2 sm:py-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Nhập lại mật khẩu mới"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          {/* Button area */}
          <div className="flex justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm sm:text-base"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-3 sm:px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition-colors text-sm sm:text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang lưu..." : "Thay đổi mật khẩu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal; 