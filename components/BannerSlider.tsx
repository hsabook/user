"use client";

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerItem {
  index: number;
  name: string;
  url: string;
  link: string;
}

interface BannerData {
  id: string;
  data: BannerItem[];
  key: string;
}

const BannerSlider = () => {
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  // Fetch banner data from API
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await fetch('https://api.hsabook.vn/config-data/banner');
        if (!response.ok) {
          throw new Error('Failed to fetch banner data');
        }
        const data = await response.json();
        setBannerData(data);
        setLoading(false);
      } catch (err) {
        console.log(`🔴 BannerSlider fetchBannerData error:`, err);
        setError('Failed to load banner data');
        setLoading(false);
      }
    };

    fetchBannerData();
  }, []);

  // Preload images
  useEffect(() => {
    if (!bannerData?.data) return;

    const preloadImages = () => {
      bannerData.data.forEach(banner => {
        const img = new window.Image();
        img.src = banner.url;
      });
    };

    preloadImages();
  }, [bannerData]);

  const nextSlide = useCallback(() => {
    if (!bannerData) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerData.data.length);
  }, [bannerData]);

  const prevSlide = useCallback(() => {
    if (!bannerData) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? bannerData.data.length - 1 : prevIndex - 1
    );
  }, [bannerData]);

  // Auto slide every 2 seconds
  useEffect(() => {
    if (!bannerData || bannerData.data.length <= 1 || isHovering) return;

    const intervalId = setInterval(() => {
      nextSlide();
    }, 2000);

    return () => clearInterval(intervalId);
  }, [bannerData, nextSlide, isHovering]);

  if (loading) {
    return <div className="w-full aspect-[3/1] bg-gray-100/50 backdrop-blur-sm animate-pulse rounded-xl sm:rounded-2xl glassmorphism"></div>;
  }

  if (error || !bannerData || bannerData.data.length === 0) {
    return null;
  }

  return (
    <div 
      className="relative w-full aspect-[3/1] rounded-xl sm:rounded-2xl overflow-hidden group bg-gray-100"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {bannerData.data.map((banner, index) => (
        <div 
          key={banner.index} 
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Link href={banner.link} target="_blank" className="block w-full h-full">
            <div className="relative w-full h-full">
              <Image 
                src={banner.url} 
                alt={banner.name} 
                fill 
                className="object-fill transition-transform duration-500 hover:scale-105"
                priority={index === currentIndex || 
                         index === (currentIndex + 1) % bannerData.data.length || 
                         index === (currentIndex - 1 + bannerData.data.length) % bannerData.data.length}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
              <div className="absolute bottom-1.5 sm:bottom-3 left-2 sm:left-3 text-white font-medium sm:font-semibold text-xs sm:text-sm md:text-base drop-shadow-md">
                {banner.name}
              </div>
            </div>
          </Link>
        </div>
      ))}

      {/* Navigation arrows - visible on touch and hover */}
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevSlide(); }} 
        className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-800" />
      </button>
      
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextSlide(); }} 
        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-800" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-1 z-20">
        {bannerData.data.map((_, index) => (
          <button
            key={index}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(index); }}
            className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white w-2 sm:w-3' : 'bg-white/60 w-1 sm:w-1.5'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-1 right-1 sm:right-2 bg-black/30 backdrop-blur-md text-white px-1 sm:px-1.5 py-0.5 rounded text-[8px] sm:text-[10px] z-20">
        {currentIndex + 1}/{bannerData.data.length}
      </div>
    </div>
  );
};

export default BannerSlider; 