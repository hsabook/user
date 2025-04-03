import { ModalProvider } from '@/contexts/ModalContext';
import ClientLayout from '@/components/ClientLayout';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ModalProvider>
      <ClientLayout>
        {children}
      </ClientLayout>
    </ModalProvider>
  );
} 