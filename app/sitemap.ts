import { MetadataRoute } from 'next';
import { getBooks } from '@/services/bookService';

type SitemapItem = {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Các URL tĩnh
  const staticRoutes: SitemapItem[] = [
    {
      url: 'https://hsabook.vn',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://hsabook.vn/book-list',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://hsabook.vn/login',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://hsabook.vn/register',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Lấy danh sách sách từ API
  let bookRoutes: SitemapItem[] = [];
  try {
    const booksResponse = await getBooks({
      take: 100,
      page: 1,
      sort_field: 'created_at',
      sort_type: 'DESC',
    });

    if (booksResponse && booksResponse.data && booksResponse.data.data) {
      bookRoutes = booksResponse.data.data.map((book) => ({
        url: `https://hsabook.vn/books/${book.id}`,
        lastModified: new Date(book.updated_at || book.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sách cho sitemap:', error);
  }

  return [...staticRoutes, ...bookRoutes];
} 