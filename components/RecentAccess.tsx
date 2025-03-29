"use client";

import Image from 'next/image';
import { Star, ChevronRight } from 'lucide-react';
import BannerSlider from './BannerSlider';

type RecentItemProps = {
  title: string;
  author: string;
  rating: number;
  image: string;
  type: 'book' | 'course';
};

const RecentItem = ({ title, author, rating, image, type }: RecentItemProps) => {
  return (
    <div className="flex items-center p-4 border rounded-lg">
      <div className="w-32 h-32 relative rounded-md overflow-hidden mr-4">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="flex items-center mt-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 mr-2 overflow-hidden relative">
            <Image src="/author-avatar.png" alt={author} fill className="object-cover" />
          </div>
          <span className="text-sm text-gray-600">{author}</span>
        </div>
        <div className="flex items-center mt-2">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <span className="ml-1 text-yellow-500 font-medium">{rating}</span>
        </div>
      </div>
    </div>
  );
};

const RecentAccess = () => {
  const recentItems: RecentItemProps[] = [
    {
      title: 'The Two Towers',
      author: 'J.R.R Tolkien',
      rating: 4.8,
      image: '/book-cover-1.jpg',
      type: 'book'
    },
    {
      title: 'User Interface Design Masterclass',
      author: 'J.R.R Tolkien',
      rating: 4.4,
      image: '/course-cover-1.jpg',
      type: 'course'
    }
  ];

  return (
    <div className="mb-8">
      <BannerSlider />
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Truy cập gần đây</h2>
        <div className="flex items-center text-amber-500">
          <span>View all</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {recentItems.map((item, index) => (
          <RecentItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default RecentAccess; 