import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HSABook - Nền tảng Sách ID',
    short_name: 'HSABook',
    description: 'Truy cập kho tàng sách điện tử với ID cá nhân hóa, trên mọi thiết bị',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#22c55e',
    icons: [
      {
        src: 'https://hsavnu.edu.vn/images/hsa-logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://hsavnu.edu.vn/images/hsa-logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
} 