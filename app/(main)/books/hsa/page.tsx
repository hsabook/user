import BookCategoryClient from '@/components/BookCategoryClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sách HSA | HSABook',
  description: 'Khám phá kho tàng sách HSA với các môn học từ Toán, Lý, Hóa, Sinh học đến Văn học, Lịch sử và Địa lý.',
  keywords: 'sách HSA, sách học tập, sách giáo khoa, học liệu, HSA, học sinh, sinh viên, giáo viên',
  openGraph: {
    title: 'Sách HSA | HSABook',
    description: 'Khám phá kho tàng sách HSA trên HSABook. Truy cập hàng ngàn tài liệu học tập chất lượng cao.',
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
export default function HSABooksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BookCategoryClient category="HSA" />
    </div>
  );
} 