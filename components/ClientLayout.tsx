"use client";

import { useModal } from '@/contexts/ModalContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ActivateIdModal from '@/components/ActivateIdModal';
import { toast } from 'sonner';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isActivateModalOpen, closeActivateModal } = useModal();
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar luôn hiển thị */}
      <Sidebar />
      
      {/* Main Content - ẩn khi modal mở */}
      <div className={`flex-1 flex flex-col overflow-hidden ${isActivateModalOpen ? 'hidden' : ''}`}>
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
    </div>
  );
} 