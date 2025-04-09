"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { checkLoginStatus } from '@/services/userService';

interface User {
  username: string;
  email: string;
  full_name: string;
  avatar?: string;
  phone_number?: string;
  description?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Kiểm tra trạng thái đăng nhập khi component được mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        const fullName = localStorage.getItem('userFullName');
        const username = localStorage.getItem('username');
        const avatar = localStorage.getItem('userAvatar');

        if (token && username) {
          try {
            // Kiểm tra token có hợp lệ không
            await checkLoginStatus();
            
            // Nếu token hợp lệ, cập nhật thông tin user
            setUser({
              username,
              full_name: fullName || username,
              email: '',
              avatar: avatar || undefined
            });
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Token không hợp lệ:', error);
            // Nếu token không hợp lệ, xóa token và thông tin user
            logout();
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token: string, userData: User) => {
    localStorage.setItem('accessToken', token);
    document.cookie = `accessToken=${token}; path=/; max-age=86400; SameSite=Lax`;
    
    if (userData) {
      localStorage.setItem('userFullName', userData.full_name || '');
      localStorage.setItem('username', userData.username || '');
      
      if (userData.avatar) {
        localStorage.setItem('userAvatar', userData.avatar);
      }
    }
    
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userFullName');
    localStorage.removeItem('username');
    localStorage.removeItem('userAvatar');
    
    // Remove cookie
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    
    setUser(null);
    setIsAuthenticated(false);
    
    // Điều hướng về trang đăng nhập
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading,
      login,
      logout,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 