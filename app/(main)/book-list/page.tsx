import BookListClient from '@/components/BookListClient';

// This is a Server Component
export default function BookListPage() {
  // Server-side metadata và các tính năng khác có thể thêm ở đây
  return (
    <div className="container mx-auto px-4 py-8">
      <BookListClient />
    </div>
  );
} 