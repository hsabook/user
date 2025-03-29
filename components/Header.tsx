import { Search, Bell, User, ChevronDown } from 'lucide-react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="h-16 border-b flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative w-72">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="pl-10 pr-3 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Search"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
          <Bell className="w-5 h-5 text-gray-600" />
        </div>
        
        <div className="flex items-center">
          <div className="relative h-9 w-9 rounded-full overflow-hidden">
            <Image src="/avatar.png" alt="User avatar" width={36} height={36} />
          </div>
          <ChevronDown className="w-4 h-4 ml-1 text-gray-600" />
        </div>
      </div>
    </header>
  );
};

export default Header; 