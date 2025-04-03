import RecentAccess from '@/components/RecentAccess';
import ActivatedBooks from '@/components/ActivatedBooks';
import NewestBooks from '@/components/NewestBooks';
import Calendar from '@/components/Calendar';
import QuestionsSection from '@/components/QuestionsSection';
import PopularCourses from '@/components/PopularCourses';

export default function Home() {
  return (
    <div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-1 md:col-span-2">
          <RecentAccess />
          <ActivatedBooks />
          <NewestBooks />
        </div>
        
        {/* Right Column */}
        <div className="col-span-1">
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