import BookDetail from "@/components/BookDetail";
import { dataMock } from "@/lib/mockData";

interface PageProps {
  params: {
    id: string;
  };
}

// Thêm hàm generateStaticParams để xác định trước tất cả các ID sách
export async function generateStaticParams() {
  // Danh sách các ID sách mà bạn muốn tạo trang tĩnh
  const bookIds = ['013243', '013244', '013245'];
  
  return bookIds.map(id => ({
    id: id,
  }));
}

export default function BookDetailPage({ params }: PageProps) {
  // Trong thực tế, bạn sẽ lấy dữ liệu sách từ API dựa trên ID
  const bookData = {...dataMock, id: params.id}

  return <BookDetail {...bookData} />;
} 