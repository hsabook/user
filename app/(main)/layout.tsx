import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ModalProvider } from '@/contexts/ModalContext';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ModalProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </ModalProvider>
  );
} 