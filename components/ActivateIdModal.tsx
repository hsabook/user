"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface ActivateIdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ActivateIdModal = ({ isOpen, onClose }: ActivateIdModalProps) => {
  const [idSach, setIdSach] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
    setIdSach("");
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
    if (!idSach.trim()) {
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
      
      // Gọi API để kích hoạt ID sách (Thay thế bằng API thực tế)
      // Ví dụ:
      // await activateBook({ id: idSach, code: activationCode });
      
      // Giả lập API gọi thành công
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Thành công",
        description: "ID sách đã được kích hoạt thành công",
        variant: "default",
      });
      
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi kích hoạt ID sách";
      setError(errorMessage);
      
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Hàm ngăn sự kiện click lan ra ngoài
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center p-4 md:bg-black md:bg-opacity-30"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden relative p-6"
        onClick={stopPropagation}
      >
        {/* Nút đóng ở góc phải trên cùng */}
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        {/* Icon và tiêu đề căn trái */}
        <div className="flex items-start mb-2 flex-col gap-2">
          <div className="w-10 h-10 bg-lime-500 rounded-lg flex items-center justify-center mr-3">
          <Image
                src="/images/active-id-icon.svg"
                alt="HSA Education Logo"
                width={56}
                height={56}
                className="w-full h-full"
              />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Kích hoạt ID</h2>
            <p className="text-sm text-gray-500 mt-1">Hãy nhập mã để kích hoạt sách</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            {/* ID sách */}
            <div>
              <label htmlFor="idSach" className="block text-sm font-medium text-gray-700 mb-1">
                ID sách
              </label>
              <input
                id="idSach"
                name="idSach"
                type="text"
                value={idSach}
                onChange={(e) => setIdSach(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder=""
                required
              />
            </div>
            
            {/* Mã kích hoạt */}
            <div>
              <label htmlFor="activationCode" className="block text-sm font-medium text-gray-700 mb-1">
                Mã cào kích hoạt
              </label>
              <input
                id="activationCode"
                name="activationCode"
                type="text"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder=""
                required
              />
            </div>
          </div>

          {/* Button area */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors text-center"
            >
              Hủy bỏ
            </button>
            
            <button
              type="submit"
              className="px-4 py-3 bg-yellow-400 text-black font-medium rounded-md hover:bg-yellow-500 transition-colors text-center"
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
      </div>
    </div>
  );
};

export default ActivateIdModal; 