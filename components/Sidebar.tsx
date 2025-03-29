import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, BookOpen, Book, MessageSquare, HelpCircle, LogOut, Plus } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-60 min-h-screen border-r bg-white flex flex-col">
      {/* Logo */}
      <div className="p-4 mb-4 flex justify-center">
        <Image src="/logo.png" alt="HSA Logo" width={60} height={60} />
      </div>

      {/* User Profile */}
      <div className="px-4 py-2 flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-red-100 overflow-hidden mr-3">
          <Image src="/avatar.png" alt="User" width={40} height={40} />
        </div>
        <span className="font-medium">Alex Rouge</span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow">
        <ul>
          <li className="mb-1">
            <Link href="/" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md">
              <Clock className="w-5 h-5 mr-3" />
              <span>Trang chủ</span>
            </Link>
          </li>
          <li className="mb-1">
            <Link href="/courses" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md">
              <BookOpen className="w-5 h-5 mr-3" />
              <span>Khóa học</span>
            </Link>
          </li>
          <li className="mb-1">
            <Link href="/books" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md bg-amber-50">
              <Book className="w-5 h-5 mr-3 text-amber-500" />
              <span className="text-amber-500">Sách đã kích hoạt</span>
            </Link>
          </li>
          <li className="mb-1">
            <Link href="/chat" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md">
              <MessageSquare className="w-5 h-5 mr-3" />
              <span>Chat</span>
              <div className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                4
              </div>
            </Link>
          </li>
          <li className="mb-1">
            <Link href="/questions" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md">
              <HelpCircle className="w-5 h-5 mr-3" />
              <span>Hỏi đáp</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Activate ID Button */}
      <div className="p-4">
        <button className="flex items-center justify-center w-full bg-amber-100 text-amber-500 py-3 px-4 rounded-md font-medium">
          <Plus className="w-5 h-5 mr-2" />
          Kích hoạt ID
        </button>
      </div>

      {/* Logout */}
      <div className="p-4 border-t">
        <button className="flex items-center text-gray-700 hover:text-gray-900">
          <LogOut className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 