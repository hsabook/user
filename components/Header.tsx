"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, ChevronDown, Book, FileText, X, BookOpen, HelpCircle, Video } from 'lucide-react';
import Image from 'next/image';
import UserProfileModal from '@/components/UserProfileModal';
import { useUserInfo } from '@/hooks/useUserInfo';
import useSearch, { TaggedSearchResultItem } from '@/hooks/useSearch';
import Link from 'next/link';
import { useModal } from "@/contexts/ModalContext";

// Định nghĩa interface cho dữ liệu API trả về
interface ApiUserData {
  username: string;
  email: string;
  phone_number: string;
  full_name: string;
  avatar: string | null;
  description: string | null;
  role: string;
  rank: number;
  status: string;
}

// Định nghĩa interface cho dữ liệu local sử dụng trong component
interface LocalUserData {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  username: string;
  avatar?: string | null;
}

// Định nghĩa interface cho UserProfileModal
interface UserData {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  username: string;
  avatar?: string | null;
}

// Hàm để xác định loại kết quả tìm kiếm
const getResultType = (item: TaggedSearchResultItem): string => {
  return item.itemType;
};

// Hàm hiển thị ID dựa trên loại kết quả
const getIdDisplay = (item: TaggedSearchResultItem): string => {
  if ('code_id' in item) {
    // BookItem hoặc QuestionItem
    return `ID: ${item.code_id}`;
  }
  return '';
};

// Hàm lấy tiêu đề dựa vào loại kết quả
const getTitle = (item: TaggedSearchResultItem): string => {
  if ('name' in item) {
    return item.name;
  } else if ('title' in item) {
    return item.title;
  } else if ('question' in item) {
    // Loại bỏ HTML tags từ nội dung câu hỏi
    return item.question.replace(/<[^>]*>?/gm, '');
  }
  return 'Không có tiêu đề';
};

// Hàm lấy ảnh dựa vào loại kết quả
const getImageUrl = (item: TaggedSearchResultItem): string | null => {
  if ('avatar' in item) {
    return item.avatar;
  } else if ('cover' in item) {
    return item.cover;
  }
  return null;
};

// Hàm lấy icon dựa trên loại kết quả
const getResultIcon = (item: TaggedSearchResultItem) => {
  const type = getResultType(item);
  
  switch (type) {
    case 'book':
      return <Book className="w-6 h-6 text-green-600" />;
    case 'menu-book':
      if ('type' in item && item.type === 'CHUONG') {
        return <BookOpen className="w-6 h-6 text-blue-600" />;
      } else {
        return <FileText className="w-6 h-6 text-orange-600" />;
      }
    case 'question':
      if ('video' in item && item.video) {
        return <Video className="w-6 h-6 text-red-600" />;
      } else {
        return <HelpCircle className="w-6 h-6 text-purple-600" />;
      }
    default:
      return <Search className="w-6 h-6 text-gray-600" />;
  }
};

// Hàm lấy link chuyển hướng dựa trên loại kết quả
const getNavigationUrl = (item: TaggedSearchResultItem): string => {
  const type = getResultType(item);
  
  switch (type) {
    case 'book':
      return `/books/${item.id}`;
    case 'menu-book':
      if ('book_id' in item) {
        return `/books/${item.book_id}/chapters/${item.id}`;
      }
      return `/books`;
    case 'question':
      if ('book_id' in item && 'menu_book_id' in item) {
        return `/books/${item.book_id}/chapters/${item.menu_book_id}?question=${item.id}`;
      }
      return `/books`;
    default:
      return '/';
  }
};

// Hàm lấy thông tin phụ dựa vào loại kết quả
const getSubInfo = (item: TaggedSearchResultItem): string => {
  if ('subject' in item) {
    // BookItem hoặc QuestionItem
    return item.subject || '';
  } else if ('type' in item) {
    // MenuBookItem
    return item.type === 'CHUONG' ? 'Chương' : 
          item.type === 'DE' ? 'Đề' : item.type;
  }
  return '';
};

const Header = () => {
  const { userData: apiUserData, loading, error, fetchUserInfo, updateUserInfo } = useUserInfo();
  const { search, searchResults, resultCounts, isLoading: isSearching, error: searchError } = useSearch();
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'books' | 'chapters' | 'questions'>('all');
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [userData, setUserData] = useState<LocalUserData | null>(null);
  const { isActivateModalOpen, isUserProfileModalOpen, openUserProfileModal } = useModal();
  
  // Lọc kết quả dựa vào tab đang active
  const filteredResults = searchResults.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'books' && item.itemType === 'book') return true;
    if (activeTab === 'chapters' && item.itemType === 'menu-book') return true;
    if (activeTab === 'questions' && item.itemType === 'question') return true;
    return false;
  });
  
  // Xử lý click bên ngoài dropdown kết quả tìm kiếm
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Cập nhật localUserData khi apiUserData thay đổi
  useEffect(() => {
    if (apiUserData) {
      setUserData({
        fullName: apiUserData.full_name,
        email: apiUserData.email,
        phone: apiUserData.phone_number,
        bio: apiUserData.description || "",
        username: apiUserData.username,
        avatar: apiUserData.avatar
      });
    }
  }, [apiUserData]);

  // Debounced search - tìm kiếm khi người dùng đã ngừng gõ
  useEffect(() => {
    // Chỉ tìm kiếm khi có searchTerm và độ dài > 0
    if (searchTerm.trim().length > 0) {
      // Xóa timeout cũ nếu còn
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      
      // Tạo timeout mới để debounce
      searchTimeout.current = setTimeout(() => {
        // Gọi API tìm kiếm
        search(searchTerm);
      }, 500); // Đợi 500ms sau khi người dùng ngừng gõ
    }
    
    // Cleanup function
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm]); // Loại bỏ search từ dependencies để tránh re-run effect khi search thay đổi
  
  // Hàm xử lý tìm kiếm khi submit form
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      await search(searchTerm);
      setShowResults(true);
    }
  };
  
  // Hàm xử lý thay đổi input tìm kiếm
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value === '') {
      setShowResults(false);
    } else {
      setShowResults(true);
    }
  };
  
  // Mở modal thông tin người dùng và fetch dữ liệu
  const handleOpenUserProfile = () => {
    openUserProfileModal();
  };
  
  // Xóa tìm kiếm
  const clearSearch = () => {
    setSearchTerm('');
    setShowResults(false);
  };

  // Mở dropdown khi click vào ô tìm kiếm
  const handleSearchFocus = () => {
    setShowResults(true);
    if (searchTerm.trim() && !searchResults.length) {
      search(searchTerm);
    }
  };

  // Ẩn header khi modal mở
  if (isActivateModalOpen || isUserProfileModalOpen) {
    return null; 
  }

  return (
    <>
      <header className="h-16 flex items-center px-6 relative z-[30]">
        {/* Backdrop blur và gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-green-50/70 backdrop-blur-md border-b border-white/40 -z-10"></div>
        
        {/* Thanh tìm kiếm trong header */}
        <div className="flex-1 relative mx-auto max-w-[832px]" ref={searchRef}>
          <form onSubmit={handleSearch}>
            <div className="ml-[-140px] mr-[130px] relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="w-5 h-5 text-green-500" />
              </div>
              <input
                type="text"
                className="pl-12 pr-12 py-3 w-full border border-green-100 bg-white/80 backdrop-blur-sm rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all shadow-md hover:shadow-lg hover:bg-white/90"
                placeholder="Tìm kiếm mã sách, ID đề, chương..."
                value={searchTerm}
                onChange={handleSearchInputChange}
                onFocus={handleSearchFocus}
              />
              {searchTerm && (
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 flex items-center pr-4"
                  onClick={clearSearch}
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                </button>
              )}
            </div>
          </form>
          
          {/* Dropdown kết quả tìm kiếm - z-index cao hơn */}
          {showResults && (
            <div className="fixed ml-[-200px] inset-0 bg-black/5 z-[9998]" onClick={() => setShowResults(false)}>
              <div 
                className="absolute top-16 left-1/2 -translate-x-1/2 mt-4 mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-green-50 overflow-hidden z-[9999] w-full max-w-[832px]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-3 border-b border-gray-100 flex items-center">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Search className="w-5 h-5 text-green-500" />
                    </div>
                    <input
                      type="text"
                      className="pl-12 pr-12 py-3 w-full border border-green-100 bg-white/70 backdrop-blur-sm rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all shadow-inner"
                      placeholder="Tìm kiếm mã sách, ID đề, chương..."
                      value={searchTerm}
                      onChange={handleSearchInputChange}
                      autoFocus
                    />
                    {searchTerm && (
                      <button 
                        type="button" 
                        className="absolute inset-y-0 right-0 flex items-center pr-4"
                        onClick={clearSearch}
                      >
                        <X className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Tabs phân loại kết quả */}
                {!isSearching && searchResults.length > 0 && (
                  <div className="flex border-b border-gray-100">
                    <button
                      className={`flex items-center py-2 px-4 text-sm font-medium ${
                        activeTab === 'all' 
                          ? 'text-green-600 border-b-2 border-green-500' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('all')}
                    >
                      <span>Tất cả</span>
                      <span className="ml-1.5 bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                        {resultCounts.total}
                      </span>
                    </button>
                    
                    {resultCounts.books > 0 && (
                      <button
                        className={`flex items-center py-2 px-4 text-sm font-medium ${
                          activeTab === 'books' 
                            ? 'text-green-600 border-b-2 border-green-500' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('books')}
                      >
                        <Book className="w-3.5 h-3.5 mr-1" />
                        <span>Sách</span>
                        <span className="ml-1.5 bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                          {resultCounts.books}
                        </span>
                      </button>
                    )}
                    
                    {resultCounts.menuBooks > 0 && (
                      <button
                        className={`flex items-center py-2 px-4 text-sm font-medium ${
                          activeTab === 'chapters' 
                            ? 'text-green-600 border-b-2 border-green-500' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('chapters')}
                      >
                        <BookOpen className="w-3.5 h-3.5 mr-1" />
                        <span>Chương/Đề</span>
                        <span className="ml-1.5 bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                          {resultCounts.menuBooks}
                        </span>
                      </button>
                    )}
                    
                    {resultCounts.questions > 0 && (
                      <button
                        className={`flex items-center py-2 px-4 text-sm font-medium ${
                          activeTab === 'questions' 
                            ? 'text-green-600 border-b-2 border-green-500' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('questions')}
                      >
                        <HelpCircle className="w-3.5 h-3.5 mr-1" />
                        <span>Câu hỏi</span>
                        <span className="ml-1.5 bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                          {resultCounts.questions}
                        </span>
                      </button>
                    )}
                  </div>
                )}
                
                <div className="max-h-[calc(100vh-150px)] overflow-y-auto">
                  {/* Loading indicator */}
                  {isSearching && (
                    <div className="p-5 text-center text-gray-500">
                      <div className="animate-spin inline-block w-5 h-5 border-2 border-t-green-500 border-r-green-500 border-b-transparent border-l-transparent rounded-full mr-2"></div>
                      Đang tìm kiếm...
                    </div>
                  )}
                  
                  {/* Result count */}
                  {!isSearching && filteredResults.length > 0 && (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      {filteredResults.length} kết quả {activeTab !== 'all' && `cho ${
                        activeTab === 'books' ? 'sách' : 
                        activeTab === 'chapters' ? 'chương/đề' : 'câu hỏi'
                      }`}
                    </div>
                  )}
                  
                  {/* Error message */}
                  {searchError && !isSearching && (
                    <div className="p-5 text-center text-red-500">
                      <p>{searchError}</p>
                    </div>
                  )}
                  
                  {/* Empty results */}
                  {!isSearching && !searchError && searchResults.length === 0 && !searchTerm && (
                    <div className="p-5 text-center text-gray-500">
                      Nhập từ khóa để tìm kiếm
                    </div>
                  )}
                  
                  {!isSearching && !searchError && searchResults.length === 0 && searchTerm && (
                    <div className="p-5 text-center text-gray-500">
                      Không tìm thấy kết quả nào phù hợp với "{searchTerm}"
                    </div>
                  )}

                  {/* Filtered empty results */}
                  {!isSearching && !searchError && searchResults.length > 0 && filteredResults.length === 0 && (
                    <div className="p-5 text-center text-gray-500">
                      Không có kết quả nào thuộc loại {
                        activeTab === 'books' ? 'sách' : 
                        activeTab === 'chapters' ? 'chương/đề' : 'câu hỏi'
                      }
                    </div>
                  )}
                  
                  {/* Search results */}
                  {!isSearching && filteredResults.length > 0 && (
                    <ul>
                      {filteredResults.map((item: TaggedSearchResultItem) => (
                        <li key={item.id} className="border-b border-gray-100 last:border-none">
                          <Link 
                            href={getNavigationUrl(item)}
                            className="flex items-center px-4 py-3 hover:bg-green-50/50 transition-colors"
                            onClick={() => setShowResults(false)}
                          >
                            <div className="w-14 h-14 rounded-md overflow-hidden mr-3 bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm">
                              {getImageUrl(item) ? (
                                <Image 
                                  src={getImageUrl(item) as string} 
                                  alt={getTitle(item)} 
                                  width={56} 
                                  height={56}
                                  style={{ objectFit: 'cover' }}
                                  className="w-full h-full"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  {getResultIcon(item)}
                                </div>
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{getTitle(item)}</h3>
                              <div className="mt-1 text-xs text-gray-500 flex flex-wrap gap-1">
                                {getSubInfo(item) && (
                                  <span className="inline-flex items-center">
                                    {getSubInfo(item)}
                                    {getIdDisplay(item) && <span className="mx-1">·</span>}
                                  </span>
                                )}
                                {getIdDisplay(item) && getIdDisplay(item)}
                              </div>
                            </div>
                            <div className="ml-2 flex-shrink-0">
                              {('active' in item && item.active) ? (
                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                                </div>
                              )}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex-none flex items-center space-x-5 ml-4">
          <div className="relative p-2 rounded-full hover:bg-white/40 transition-all cursor-pointer">
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
            <Bell className="w-5 h-5 text-green-700" />
          </div>
          
          <div 
            className="flex items-center cursor-pointer bg-white/30 rounded-full pl-1 pr-3 py-1 border border-green-100/50 shadow-sm hover:bg-white/50 transition-all duration-300"
            onClick={handleOpenUserProfile}
          >
            <div className="relative h-9 w-9 rounded-full overflow-hidden mr-2 shadow-sm border border-white/80">
              {userData?.avatar ? (
                <Image 
                  src={userData.avatar} 
                  alt={userData?.fullName || "User avatar"} 
                  width={36} 
                  height={36}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-green-500 to-green-400 text-white">
                  {userData?.fullName ? userData.fullName.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-gray-800 mr-1">
              {localStorage.getItem('userFullName') ? localStorage.getItem('userFullName') : 'User'}
            </span>
            <ChevronDown className="w-4 h-4 text-green-600" />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header; 