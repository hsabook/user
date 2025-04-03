import ChapterClient from "@/components/ChapterClient";

// Định nghĩa kiểu dữ liệu cho props của trang
interface ChapterPageProps {
  params: {
    id: string;
    chapterId: string;
  };
}

// Thêm hàm generateStaticParams để xác định trước tất cả các trang sẽ được tạo tĩnh
export async function generateStaticParams() {
  // Trong thực tế, bạn sẽ lấy dữ liệu từ API hoặc cơ sở dữ liệu
  // Đây chỉ là ví dụ
  return [
    {
      id: '8d523d9b-67c7-449a-8041-01f48ff3d4e0',
      chapterId: '4e440131-6b79-432f-b923-7e50a2b5909f',
    },
  ];
}

export default function ChapterPage({ params }: ChapterPageProps) {
  return (
    <ChapterClient 
      bookId={params.id} 
      chapterId={params.chapterId} 
    />
  );
} 