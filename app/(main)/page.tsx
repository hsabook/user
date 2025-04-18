import RecentAccess from '@/components/RecentAccess';
import ActivatedBooks from '@/components/ActivatedBooks';
import NewestBooks from '@/components/NewestBooks';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HSABook - Nền tảng Sách ID Hiện Đại',
  description: 'Khám phá kho tàng sách điện tử với ID cá nhân hóa, truy cập dễ dàng trên mọi thiết bị, cùng trải nghiệm học tập hiện đại và hiệu quả tại HSABook',
  keywords: 'sách điện tử, học tập hiện đại, sách ID, HSABook, giáo dục trực tuyến, học liệu số',
  openGraph: {
    title: 'HSABook - Nền tảng Sách ID Hiện Đại',
    description: 'Khám phá kho tàng sách điện tử với ID cá nhân hóa tại HSABook',
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

export default function Home() {
  return (
    <div>
      {/* Hiển thị đầy đủ chiều rộng cho các thành phần */}
      <div className="space-y-8">
        {/* Truy cập gần đây */}
        <RecentAccess />
        
        {/* Layout lưới cho sách đã kích hoạt và sách mới */}
        <div className="flex flex-col gap-2">
          {/* Sách đã kích hoạt */}
          <div className="flex-1">
            <ActivatedBooks />
          </div>
          
          {/* Sách mới */}
          <div className="flex-1">
            <NewestBooks />
          </div>
        </div>
      </div>
    </div>
  );
} 