import RecentAccess from '@/components/RecentAccess';
import ActivatedBooks from '@/components/ActivatedBooks';
import Calendar from '@/components/Calendar';
import QuestionsSection from '@/components/QuestionsSection';
import PopularCourses from '@/components/PopularCourses';

export default function Home() {
  return (
    <div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-2">
          <RecentAccess />
          <ActivatedBooks />
        </div>
        
        {/* Right Column */}
        <div>
          <Calendar />
          <div className="mt-8">
            <QuestionsSection />
            <PopularCourses />
          </div>
        </div>
      </div>
    </div>
  );
} 