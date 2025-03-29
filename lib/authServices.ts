// lib/authService.ts

// Hàm xử lý đăng nhập
export async function loginUser(username: string, password: string) {
  try {
    // Gửi yêu cầu đến API thực tế
    const response = await fetch('https://api.hsabook.vn/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    // Lấy kết quả từ API
    const data = await response.json();

    // Trả về kết quả cho client
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message || 'Đăng nhập thất bại', status: response.status };
    }
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    return { success: false, error: 'Có lỗi xảy ra khi xử lý yêu cầu đăng nhập', status: 500 };
  }
}

// Hàm xử lý đăng ký
export async function registerUser(
  full_name: string, 
  email: string, 
  password: string, 
  confirmPassword: string,
  phone_number: string,
  avatar: string,
  username: string
) {
  try {
    // Kiểm tra mật khẩu nhập lại
    if (password !== confirmPassword) {
      return { success: false, error: 'Mật khẩu xác nhận không khớp', status: 400 };
    }

    // Gửi yêu cầu đến API thực tế
    const response = await fetch('https://api.hsabook.vn/users/create-client', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
      },
      body: JSON.stringify({
        full_name,
        email,
        password,
        phone_number,
        avatar,
        username
      })
    });

    // Lấy kết quả từ API
    const data = await response.json();

    // Trả về kết quả cho client
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message || 'Đăng ký thất bại', status: response.status };
    }
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    return { success: false, error: 'Có lỗi xảy ra khi xử lý yêu cầu đăng ký', status: 500 };
  }
}

// Hàm yêu cầu đặt lại mật khẩu
export async function forgotPassword(email: string) {
  try {
    const response = await fetch('https://api.hsabook.vn/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { 
        success: false, 
        error: data.message || 'Không thể khôi phục mật khẩu', 
        status: response.status 
      };
    }
  } catch (error) {
    console.error('Lỗi khôi phục mật khẩu:', error);
    return { 
      success: false, 
      error: 'Có lỗi xảy ra khi xử lý yêu cầu khôi phục mật khẩu', 
      status: 500 
    };
  }
}

// Hàm kiểm tra trạng thái đăng nhập
export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('token');
  return !!token;
}

// Hàm đăng xuất
export function logout() {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
