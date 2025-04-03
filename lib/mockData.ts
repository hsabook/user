export const mockData = {
    avatar_link: "https://s3-alpha-sig.figma.com/img/e3c7/2251/266af941e257aaf407a189e3f1034437?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=n1Y2-Kue38sNAwhnmZ8ttK0Pl~-rT0ayKjAf8pfKZt~3zkdVaCi7M8V4ZltHCREGSt2-h5LcrbCdDiAUsOujcMszOHQm~X-bc8~2y6qExUd3mfq8-BcPsXZg5LdXCChIbDlrRPRvJl6cyf~VHTxbayk3Eq5vqfF4VDfKZ9Oz8U-lr8ytH~PqBIpPLkdaxsl6~9T7zBWpmMWrUxZIQ~gJWLyV9hikPRo-SFzUHVAA3Ss~7~zAeCG~DV7TxpOj-ZM3t6k3bOoZU~fku1zX6-S57BO4i7zJW3rQMtAVc-zimorHIoYjJWNJeX2qjUV0wM6zUQ6IfDdGMS6AiL0M0hFC-w__",
    
}
export const dataMock = {
    title: "Chuyên đề trọng tâm: Ôn thi đánh giá năng lực phần Khoa học xã hội",
    authors: ["Lê Thu Trang", "Đặng Hải Yến", "Nguyễn Hoàng Trang"],
    publishDate: "20/10/2023",
    category: "Danh mục",
    subcategory: "Khoa học xã hội",
    rating: 4.0,
    authorDetails: [
      {
        id: "1",
        name: "Lê Thu Trang",
        email: "lethutrang10@gmail.com",
        avatar: mockData.avatar_link,
        achievements: {
          books: 100,
          graduates: "ĐHQG HN",
          followers: 500000,
        },
      },
      {
        id: "2",
        name: "Đặng Hải Yến",
        email: "lethutrang10@gmail.com",
        avatar: mockData.avatar_link,
        achievements: {
          books: 100,
          graduates: "ĐHQG HN",
          followers: 500000,
        },
      },
      {
        id: "3",
        name: "Nguyễn Hoàng Trang",
        email: "tranghoang@gmail.com",
        avatar: mockData.avatar_link,
        achievements: {
          books: 100,
          graduates: "ĐHQG HN",
          followers: 500000,
        },
      },
    ],
    chapters: [
      {
        id: "001234",
        title: "Chương 1: Chủ đề về địa lý cư dân Việt Nam",
        isLocked: false,
        content: [
          {
            id: "content1",
            title: "Bài kiểm tra 1",
            isLocked: false,
          },
        ],
      },
      {
        id: "002321",
        title: "Bộ đề 1",
        isLocked: false,
      },
      {
        id: "003456",
        title: "Chương 2: Địa lý các ngành kinh tế",
        isLocked: true,
      },
      {
        id: "004567",
        title: "Chương 3: Địa lý các vùng kinh tế",
        isLocked: true,
      },
      {
        id: "005678",
        title: "Chương 4: Biến động và khai thác tổ hợp kinh tế biển",
        isLocked: true,
      },
      {
        id: "006789",
        title: "Bài kiểm tra 2",
        isLocked: false,
        content: [
          {
            id: "content2",
            title: "Nội dung kiểm tra",
            isLocked: false,
          },
        ],
      },
      {
        id: "007890",
        title: "Bộ đề 2",
        isLocked: true,
      },
      {
        id: "008901",
        title: "Chương 5: Địa lý tự nhiên Việt Nam",
        isLocked: false,
      },
      {
        id: "009012",
        title: "Chương 6: Kỹ năng địa lý",
        isLocked: false,
      },
      {
        id: "010123",
        title: "Chương 7: Địa lý các khu vực và Quốc Gia",
        isLocked: true,
      },
    ],
  };
