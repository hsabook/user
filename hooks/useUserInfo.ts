import { useState, useEffect } from 'react';

interface UserData {
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

interface UpdateUserParams {
  password?: string;
  username?: string;
  email?: string;
  phone_number?: string;
  full_name?: string;
  role?: string; 
  avatar?: string;
  status?: string;
}

export function useUserInfo() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Lấy token từ localStorage
      let token = '';
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('accessToken') || '';
      }
      
      if (!token) {
        throw new Error('Không tìm thấy token đăng nhập');
      }
      
      const response = await fetch('https://api.hsabook.vn/users/info', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setUserData(result.data);
      } else {
        setError(result.error || 'Không thể lấy thông tin người dùng');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const updateUserInfo = async (params: UpdateUserParams) => {
    setLoading(true);
    setError(null);
    
    try {
      // Lấy token từ localStorage
      let token = '';
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('accessToken') || '';
      }
      
      if (!token) {
        throw new Error('Không tìm thấy token đăng nhập');
      }
      
      const response = await fetch('https://api.hsabook.vn/users', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(params)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setUserData(result.data);
      } else {
        setError(result.error || 'Không thể cập nhật thông tin người dùng');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };
  
  return { userData, loading, error, fetchUserInfo, updateUserInfo };
}
