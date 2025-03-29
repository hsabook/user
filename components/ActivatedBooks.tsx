import Image from 'next/image';

type BookData = {
  id: string;
  title: string;
  author: string;
  activationDate: string;
  expiryDate: string;
  coverImage: string;
  progress: number;
};

/**
 * Displays the table of activated books with their details
 */
const ActivatedBooks = () => {
  const books: BookData[] = [
    {
      id: '013243',
      title: 'The Two Towers',
      author: 'J.R.R Tolkien',
      activationDate: '10/10/2023',
      expiryDate: '10/10/2024',
      coverImage: '/book-cover-1.jpg',
      progress: 25
    },
    {
      id: '013243',
      title: 'The growth of the soil',
      author: 'Knut Hamsun',
      activationDate: '10/10/2023',
      expiryDate: '10/10/2024',
      coverImage: '/book-cover-2.jpg',
      progress: 25
    },
    {
      id: '013243',
      title: 'The Name of the Rose',
      author: 'Umberto Eco',
      activationDate: '10/10/2023',
      expiryDate: '10/10/2024',
      coverImage: '/book-cover-3.jpg',
      progress: 25
    }
  ];

  return (
    <div>
      <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
        Sách đã kích hoạt
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Tên sách</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Tác giả</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Ngày kích hoạt</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Hạn</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="w-10 h-14 relative mr-3 overflow-hidden rounded">
                      <Image src={book.coverImage} alt={book.title} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-medium">{book.title}</p>
                      <p className="text-xs text-gray-500">ID: {book.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">{book.author}</td>
                <td className="py-3 px-4">{book.activationDate}</td>
                <td className="py-3 px-4">{book.expiryDate}</td>
                <td className="py-3 px-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{ width: `${book.progress}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivatedBooks; 