"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  BookOpen,
  Book,
  MessageSquare,
  HelpCircle,
  LogOut,
  Plus,
} from "lucide-react";
import ActivateIdModal from "./ActivateIdModal";

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/books");
  
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <div className="w-60 min-h-screen flex flex-col relative z-10">
      {/* Backdrop blur và gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-100/80 via-white/70 to-green-50/60 backdrop-blur-md border-r border-white/40 -z-10"></div>
      
      {/* Hiệu ứng glow top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400/0 via-green-500/70 to-green-400/0"></div>
      
      {/* Logo */}
      <div className="p-6 mb-2 flex justify-center">
        <div className="w-16 h-16 relative mr-3 flex-shrink-0 rounded-full bg-white/60 p-2 shadow-lg border border-green-100/70">
          <Image
            src="/images/hsa-logo.svg"
            alt="HSA Education Logo"
            width={56}
            height={56}
            className="w-full h-full drop-shadow-sm"
          />
        </div>
      </div>

      {/* User Profile */}
      <div className="px-5 py-4 flex items-center mb-6">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-200 to-green-100 overflow-hidden mr-3 border-2 border-white shadow-md">
          <Image src="/avatar.png" alt="User" width={44} height={44} />
        </div>
        <span className="font-medium text-gray-800">Alex Rouge</span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow px-3">
        <ul>
          <li className="mb-2">
            <Link
              href="/"
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                activeLink === "/" 
                  ? "bg-white/70 text-green-700 shadow-sm border border-green-100/50" 
                  : "text-gray-700 hover:bg-white/40 hover:shadow-sm"
              }`}
              onClick={() => setActiveLink("/")}
            >
              <Clock className={`w-5 h-5 mr-3 ${activeLink === "/" ? "text-green-600" : ""}`} />
              <span>Trang chủ</span>
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/courses"
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                activeLink === "/courses" 
                  ? "bg-white/70 text-green-700 shadow-sm border border-green-100/50" 
                  : "text-gray-700 hover:bg-white/40 hover:shadow-sm"
              }`}
              onClick={() => setActiveLink("/courses")}
            >
              <BookOpen className={`w-5 h-5 mr-3 ${activeLink === "/courses" ? "text-green-600" : ""}`} />
              <span>Khóa học</span>
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/books"
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                activeLink === "/books" 
                  ? "bg-gradient-to-r from-green-50/80 to-green-100/60 text-green-700 shadow-sm border border-green-100/50" 
                  : "text-gray-700 hover:bg-white/40 hover:shadow-sm"
              }`}
              onClick={() => setActiveLink("/books")}
            >
              <Book className="w-5 h-5 mr-3 text-green-600" />
              <span>Sách đã kích hoạt</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Activate ID Button */}
      <div className="p-5">
        <button 
          onClick={openModal} 
          className="flex items-center justify-center w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 border border-green-400 hover:from-green-500 hover:to-green-400"
        >
          <Plus className="w-5 h-5 mr-2" />
          Kích hoạt ID
        </button>
      </div>

      <ActivateIdModal isOpen={isModalOpen} onClose={closeModal} onSuccess={closeModal} />

      {/* Logout */}
      <div className="p-5 mt-2">
        <button className="flex items-center text-gray-600 hover:text-green-800 transition-colors duration-300 mx-1">
          <LogOut className="w-5 h-5 mr-3" />
          <span>Đăng xuất</span>
        </button>
      </div>
      
      {/* Hiệu ứng glow bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400/0 via-green-400/50 to-green-400/0"></div>
    </div>
  );
};

export default Sidebar;
