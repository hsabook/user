import { ReactNode } from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HSABook - Nền tảng Sách ID',
  description: 'Khám phá kho tàng sách điện tử với ID cá nhân hóa, truy cập dễ dàng trên mọi thiết bị, cùng trải nghiệm học tập hiện đại và hiệu quả tại HSABook',
  icons: {
    icon: 'https://hsavnu.edu.vn/images/hsa-logo.png',
    apple: 'https://hsavnu.edu.vn/images/hsa-logo.png',
    shortcut: 'https://hsavnu.edu.vn/images/hsa-logo.png',
  },
  openGraph: {
    images: ['https://s3-website-r1.s3cloud.vn/hsa/2025-04-11/1744331303710.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
