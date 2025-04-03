import BookDetailClient from "@/components/BookDetailClient";
import { dataMock } from "@/lib/mockData";

interface PageProps {
  params: {
    id: string;
  };
}

// Thêm hàm generateStaticParams để xác định trước tất cả các ID sách
export async function generateStaticParams() {
  // Danh sách các ID sách mà bạn muốn tạo trang tĩnh
  const bookIds = ['8d523d9b-67c7-449a-8041-01f48ff3d4e0', '013244', '013245'];
  
  return bookIds.map(id => ({
    id: id,
  }));
}

export default function BookDetailPage({ params }: PageProps) {
  const initialBookData = {
    ...dataMock,
    id: params.id,
    title: `Sách ${params.id.substring(0, 6)}...`,
  };

  return <BookDetailClient bookId={params.id} initialData={initialBookData} />;
} 