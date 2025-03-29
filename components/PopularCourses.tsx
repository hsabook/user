import Image from 'next/image';

type CourseProps = {
  title: string;
  instructor: string;
  image: string;
  trendType: 'up' | 'down' | 'stable';
};

/**
 * Individual course item component
 */
const CourseItem = ({ title, instructor, image, trendType }: CourseProps) => {
  return (
    <div className="flex items-center p-3 border-b">
      <div className="w-10 h-10 bg-blue-100 rounded-md overflow-hidden relative mr-3">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-sm">{title}</h3>
        <div className="flex items-center mt-1">
          <div className="w-5 h-5 rounded-full overflow-hidden relative mr-1">
            <Image src="/instructor-avatar.png" alt={instructor} fill className="object-cover" />
          </div>
          <span className="text-xs text-gray-500">{instructor}</span>
        </div>
      </div>
      {trendType === 'up' && (
        <div className="text-green-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      )}
      {trendType === 'down' && (
        <div className="text-red-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
        </div>
      )}
      {trendType === 'stable' && (
        <div className="text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        </div>
      )}
    </div>
  );
};

/**
 * Popular courses section component
 */
const PopularCourses = () => {
  const courses: CourseProps[] = [
    {
      title: 'CSS for Designers',
      instructor: 'Thuy Le',
      image: '/css-icon.png',
      trendType: 'up'
    },
    {
      title: '3D Design Foundations',
      instructor: 'Thuy Le',
      image: '/3d-icon.png',
      trendType: 'stable'
    },
    {
      title: 'Design Composition',
      instructor: 'Thuy Le',
      image: '/design-icon.png',
      trendType: 'stable'
    },
    {
      title: 'Color Psychology',
      instructor: 'Thuy Le',
      image: '/color-icon.png',
      trendType: 'up'
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Khóa học phổ biến</h2>
        <button className="text-blue-500 font-medium">
          <span className="mr-1">+</span>
        </button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        {courses.map((course, index) => (
          <CourseItem key={index} {...course} />
        ))}
      </div>
    </div>
  );
};

export default PopularCourses; 