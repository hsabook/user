import RecentAccess from '@/components/RecentAccess';
import ActivatedBooks from '@/components/ActivatedBooks';
import NewestBooks from '@/components/NewestBooks';
import Calendar from '@/components/Calendar';
import PopularCourses from '@/components/PopularCourses';
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
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-1 md:col-span-2">
          <RecentAccess />
          <ActivatedBooks />
          <NewestBooks />
        </div>
        
        {/* Right Column */}
        <div className="col-span-1">
          <Calendar />
          <div className="mt-8">
            <PopularCourses />
          </div>
        </div>
      </div>
    </div>
  );
} 