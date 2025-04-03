import ChapterDetail from "@/components/ChapterDetail";
import { mockData } from "@/lib/mockData";

interface PageProps {
  params: {
    bookId: string;
    chapterId: string;
  }
}

export default function ChapterDetailPage({ params }: PageProps) {
  // Trong thực tế, bạn sẽ lấy dữ liệu từ API dựa trên bookId và chapterId
  const chapterData = {
    id: params.chapterId,
    title: "Chương 1: Chủ đề về địa lý cư dân Việt Nam",
    author: {
      name: "Lê Thu Trang",
      avatar: mockData.avatar_link,
    },
    content: {
      text: "This free short story e-romance is a prequel to The Pebble Creek Amish Series by Vannetta Chapman. Fans of the series will enjoy this chance to briefly revisit Pebble Creek, and new readers will be introduced to an Amish community that is more deeply explored in the three full novels, A Promise for Miriam, A Home for Lydia, and A Wedding for Julia.",
      attachments: [
        {
          name: "HannahBusing_Resume.pdf",
          size: "200 KB",
          type: "pdf",
        }
      ],
      video: {
        title: "Tính Đơn Điệu Của Hàm Số - Toán 12",
        description: "This free short story e-romance is a prequel to The Pebble Creek Amish Series by Vannetta Chapman. Fans of the series will enjoy this chance to briefly revisit Pebble Creek."
      }
    },
    stats: {
      views: 50,
      questions: 3
    },
    comments: [
      {
        id: "1",
        user: {
          name: "Hà Quỳnh Anh",
          avatar: mockData.avatar_link
        },
        content: "Xét tính đồng biến và nghịch biến của hàm số y=x3 - 6x2 + 9x - 3 theo cách thầy giảng nhưng vẫn sai gì?",
        timestamp: "20 phút trước"
      },
      {
        id: "2",
        user: {
          name: "Thu Trang",
          avatar: mockData.avatar_link,
          role: "Giáo viên"
        },
        content: "Có gửi lời giải nhé, em check lại xem",
        timestamp: "20 phút trước",
        isTeacher: true,
        image: mockData.avatar_link
      }
    ]
  };

  return <ChapterDetail chapter={chapterData} />;
} 