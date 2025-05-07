import HSABookSection from '@/components/HSABookSection';
import TSABookSection from '@/components/TSABookSection';
import VACTBookSection from '@/components/VACTBookSection';
import OtherBookSection from '@/components/OtherBookSection';
import { Metadata } from 'next';
import BannerSlider from '@/components/BannerSlider';
import ActivatedBooks from '@/components/ActivatedBooks';

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
      {/* Các danh mục sách */}
      <div className="space-y-8">
        <div className="sidebar-section p-0 mb-4 sm:mb-6">
          <BannerSlider />
        </div>
        
        {/* Sách đã kích hoạt */}
        <ActivatedBooks/>
        
        {/* Sách đánh giá năng lực HSA */}
        <div className="relative mt-8 mb-12">
          {/* Background với hiệu ứng gradient mờ */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 via-indigo-50/30 to-blue-50/70 rounded-xl -z-10"></div>
          
          <div className="p-6 backdrop-blur-sm rounded-xl border border-blue-100/50 shadow-lg">
            <HSABookSection />
          </div>
        </div>
        
        {/* Sách đánh giá tư duy TSA */}
        <div className="relative mt-8 mb-12">
          {/* Background với hiệu ứng gradient mờ */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50/80 via-pink-50/30 to-purple-50/70 rounded-xl -z-10"></div>
          
          <div className="p-6 backdrop-blur-sm rounded-xl border border-purple-100/50 shadow-lg">
            <TSABookSection />
          </div>
        </div>
        
        {/* Sách đánh giá năng lực VACT */}
        <div className="relative mt-8 mb-12">
          {/* Background với hiệu ứng gradient mờ */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-50/80 via-orange-50/30 to-amber-50/70 rounded-xl -z-10"></div>
          
          <div className="p-6 backdrop-blur-sm rounded-xl border border-amber-100/50 shadow-lg">
            <VACTBookSection />
          </div>
        </div>
        
        {/* Các sách khác */}
        <div className="relative mt-8 mb-12">
          {/* Background với hiệu ứng gradient mờ */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-50/80 via-emerald-50/30 to-teal-50/70 rounded-xl -z-10"></div>
          
          <div className="p-6 backdrop-blur-sm rounded-xl border border-teal-100/50 shadow-lg">
            <OtherBookSection />
          </div>
        </div>
      </div>
    </div>
  );
} 