"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, BookOpen, AlertCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { activateBookCode } from "@/services/bookService";
import { useModal } from "@/contexts/ModalContext";

interface ActivateIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ActivateIdModal: React.FC<ActivateIdModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [activationId, setActivationId] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { closeActivateModal } = useModal();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const resetForm = () => {
    setActivationId("");
    setActivationCode("");
    setError(null);
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra dữ liệu nhập
    if (!activationId.trim()) {
      setError("Vui lòng nhập ID sách");
      return;
    }

    if (!activationCode.trim()) {
      setError("Vui lòng nhập mã kích hoạt");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      // Chuyển đổi bookCode sang số nếu có thể
      let bookCode: number;
      try {
        bookCode = parseInt(activationId);
        if (isNaN(bookCode)) {
          throw new Error("ID sách phải là số");
        }
      } catch (err) {
        setError("ID sách phải là số hợp lệ");
        setIsSubmitting(false);
        return;
      }
      
      // Gọi API để kích hoạt ID sách
      const result = await activateBookCode(activationCode, bookCode);
      
      // Hiển thị thông báo thành công
      toast.success("ID sách đã được kích hoạt thành công", {
        description: "Bạn có thể truy cập sách này trong thư viện của mình"
      });
      
      // Gọi callback onSuccess nếu có
      if (onSuccess) {
        onSuccess();
      }
      
      // Đóng modal
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi kích hoạt ID sách";
      setError(errorMessage);
      
      toast.error("Kích hoạt không thành công", {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Hàm ngăn sự kiện click lan ra ngoài
  const stopPropagation = (e: React.MouseEvent) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 z-[999] bg-gradient-to-r from-green-400/20 via-blue-500/20 to-purple-600/20 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative p-8 border border-white/50 z-[1000]"
        onClick={stopPropagation}
      >
        {/* Nút đóng ở góc phải trên cùng */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            onClose();
          }}
          className="absolute right-6 top-6 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Đóng"
          type="button"
        >
          <X size={22} />
        </button>
        
        {/* Icon và tiêu đề căn giữa */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-lime-400 to-green-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <Image
              src="/images/active-id-icon.svg"
              alt="Kích hoạt ID"
              width={40}
              height={40}
              className="w-10 h-10"
            />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Kích hoạt ID</h2>
          <p className="text-sm text-gray-600">Hãy nhập mã để kích hoạt sách</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <div className="space-y-5">
            {/* ID sách */}
            <div className="text-center">
              <label htmlFor="activationId" className="block text-sm font-medium text-gray-700 mb-2">
                ID sách
              </label>
              <input
                id="activationId"
                name="activationId"
                type="text"
                value={activationId}
                onChange={(e) => setActivationId(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all shadow-sm"
                placeholder="Nhập ID sách (số)"
                required
              />
            </div>
            
            {/* Mã kích hoạt */}
            <div className="text-center">
              <label htmlFor="activationCode" className="block text-sm font-medium text-gray-700 mb-2">
                Mã cào kích hoạt
              </label>
              <input
                id="activationCode"
                name="activationCode"
                type="text"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all shadow-sm"
                placeholder="Nhập mã kích hoạt"
                required
              />
            </div>
          </div>

          {/* Button area */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              className="px-4 py-3 bg-gray-100/80 backdrop-blur-sm text-gray-700 font-medium rounded-xl hover:bg-gray-200/80 transition-all shadow-sm border border-gray-100"
            >
              Hủy bỏ
            </button>
            
            <button
              type="submit"
              className="px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-medium rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="mr-2 h-4 w-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                "Kích hoạt"
              )}
            </button>
          </div>
        </form>
        
        {/* Hiệu ứng ánh sáng trang trí */}
        <div className="absolute w-40 h-40 bg-green-400/20 rounded-full blur-3xl -bottom-20 -left-20 z-0"></div>
        <div className="absolute w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl -top-20 -right-20 z-0"></div>
      </div>
    </div>
  );
};

export default ActivateIdModal; 