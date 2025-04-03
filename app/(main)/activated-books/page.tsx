import ActivatedBooks from "@/components/ActivatedBooks";

export const metadata = {
  title: 'Sách đã kích hoạt - HSA Education',
  description: 'Xem danh sách sách đã kích hoạt và quản lý tài nguyên học tập của bạn',
};

export default function ActivatedBooksPage() {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">Sách đã kích hoạt</h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý và truy cập vào tất cả sách bạn đã kích hoạt
          </p>
        </div>
      </div>
      
      {/* Hiển thị component ActivatedBooks */}
      <ActivatedBooks />
    </div>
  );
} 