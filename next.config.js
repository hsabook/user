/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3-alpha-sig.figma.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Tối ưu hóa
  compress: true,
  swcMinify: true,
  poweredByHeader: false, // Tăng cường bảo mật
  
  // Cấu hình đường dẫn
  trailingSlash: false,
  
  // Tối ưu cho SEO
  generateEtags: true,
  
  // Cấu hình văn bản mở rộng
  i18n: {
    locales: ['vi'],
    defaultLocale: 'vi',
  },
};

module.exports = nextConfig;
