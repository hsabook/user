import BookCategoryClient from '@/components/BookCategoryClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sách VACT | HSABook',
  description: 'Khám phá kho tàng sách VACT với các môn học từ Toán, Lý, Hóa, Sinh học đến Văn học, Lịch sử và Địa lý.',
  keywords: 'sách VACT, sách học tập, sách giáo khoa, học liệu, VACT, học sinh, sinh viên, giáo viên',
  openGraph: {
    title: 'Sách VACT | HSABook',
    description: 'Khám phá kho tàng sách VACT trên HSABook. Truy cập hàng ngàn tài liệu học tập chất lượng cao.',
    images: [
      {
        url: 'https://s3-website-r1.s3cloud.vn/hsa/2025-04-11/1744331303710.jpg',
        width: 1200,
        height: 630,
        alt: 'HSABook - Kho tàng sách điện tử',
      },
    ],
  },
};

// This is a Server Component
export default function VACTBooksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BookCategoryClient category="VACT" />
    </div>
  );
} 