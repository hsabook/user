import BookListClient from '@/components/BookListClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Danh sách sách | HSABook',
  description: 'Khám phá kho tàng sách đa dạng với các môn học từ Toán, Lý, Hóa, Sinh học đến Văn học, Lịch sử và Địa lý. Tìm kiếm và truy cập dễ dàng vào tài liệu học tập hiện đại tại HSABook.',
  keywords: 'sách học tập, sách giáo khoa, học liệu, HSABook, học sinh, sinh viên, giáo viên',
  openGraph: {
    title: 'Danh sách sách | HSABook',
    description: 'Khám phá kho tàng sách đa dạng trên HSABook. Truy cập hàng ngàn tài liệu học tập chất lượng cao.',
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
export default function BookListPage() {
  // Server-side metadata và các tính năng khác có thể thêm ở đây
  return (
    <div className="container mx-auto px-4 py-8">
      <BookListClient />
    </div>
  );
} 