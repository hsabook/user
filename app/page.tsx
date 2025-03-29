import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import RecentAccess from '@/components/RecentAccess';
import ActivatedBooks from '@/components/ActivatedBooks';
import Calendar from '@/components/Calendar';
import QuestionsSection from '@/components/QuestionsSection';
import PopularCourses from '@/components/PopularCourses';

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
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
        </div>
      </div>
    </div>
  );
}
