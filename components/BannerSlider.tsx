"use client";

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getBannerData, type BannerData, type BannerItem } from '@/api/banner';

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
        const data = await getBannerData();
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
    return <div className="h-48 bg-gray-100 animate-pulse rounded-lg mb-6"></div>;
  }

  if (error || !bannerData || bannerData.data.length === 0) {
    return null;
  }

  const currentBanner = bannerData.data[currentIndex];

  return (
    <div 
      className="relative w-full h-48 rounded-lg overflow-hidden mb-6 group shadow-md"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link href={currentBanner.link} target="_blank">
        <div className="relative w-full h-full">
          <Image 
            src={currentBanner.url} 
            alt={currentBanner.name} 
            fill 
            className="object-cover transition-transform duration-500 hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
          <div className="absolute bottom-4 left-4 text-white font-semibold text-lg drop-shadow-md">
            {currentBanner.name}
          </div>
        </div>
      </Link>

      {/* Navigation arrows */}
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevSlide(); }} 
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 text-gray-800" />
      </button>
      
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextSlide(); }} 
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 text-gray-800" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
        {bannerData.data.map((_, index) => (
          <button
            key={index}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(index); }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white w-4' : 'bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
        {currentIndex + 1}/{bannerData.data.length}
      </div>
    </div>
  );
};

export default BannerSlider; 