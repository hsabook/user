import Image from 'next/image';

type QuestionProps = {
  title: string;
  time: string;
  progress: number;
  icon: string;
};

/**
 * Individual question item component
 */
const QuestionItem = ({ title, time, progress, icon }: QuestionProps) => {
  return (
    <div className="border rounded-lg p-4 flex items-center mb-3">
      <div className="w-10 h-10 bg-amber-100 rounded-md flex items-center justify-center mr-4">
        <Image src={icon} alt="Question icon" width={24} height={24} />
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <div className="flex items-center mt-1">
          <p className="text-xs text-gray-500">{time}</p>
          <div className="ml-4 w-24 bg-gray-200 rounded-full h-1">
            <div 
              className="bg-yellow-400 h-1 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="ml-2 text-xs text-gray-500">{progress}/35</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Questions section component displaying recent questions
 */
const QuestionsSection = () => {
  const questions: QuestionProps[] = [
    {
      title: 'Đề thi THPT Quốc gia',
      time: '10:00 20/10/2024',
      progress: 25,
      icon: '/exam-icon.png'
    },
    {
      title: 'Bài tập toán cao cấp',
      time: '10:00 20/10/2024',
      progress: 25,
      icon: '/math-icon.png'
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-medium mb-4">Hỏi đáp</h2>
      <div>
        {questions.map((question, index) => (
          <QuestionItem key={index} {...question} />
        ))}
      </div>
    </div>
  );
};

export default QuestionsSection; 