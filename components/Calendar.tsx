import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = () => {
  const currentMonth = 'February 2021';
  const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  
  // Calendar data for February 2021
  const days = [
    { day: 1, isToday: false, isPast: false, hasEvent: false },
    { day: 2, isToday: false, isPast: false, hasEvent: false },
    { day: 3, isToday: false, isPast: false, hasEvent: false },
    { day: 4, isToday: false, isPast: false, hasEvent: false },
    { day: 5, isToday: false, isPast: false, hasEvent: false },
    { day: 6, isToday: false, isPast: false, hasEvent: false },
    { day: 7, isToday: false, isPast: false, hasEvent: false },
    { day: 8, isToday: false, isPast: false, hasEvent: false },
    { day: 9, isToday: false, isPast: false, hasEvent: false },
    { day: 10, isToday: false, isPast: false, hasEvent: false },
    { day: 11, isToday: false, isPast: false, hasEvent: false },
    { day: 12, isToday: false, isPast: false, hasEvent: false },
    { day: 13, isToday: false, isPast: false, hasEvent: false },
    { day: 14, isToday: false, isPast: false, hasEvent: false },
    { day: 15, isToday: false, isPast: false, hasEvent: false },
    { day: 16, isToday: false, isPast: false, hasEvent: false },
    { day: 17, isToday: false, isPast: false, hasEvent: false },
    { day: 18, isToday: false, isPast: false, hasEvent: false },
    { day: 19, isToday: false, isPast: false, hasEvent: false },
    { day: 20, isToday: false, isPast: false, hasEvent: false },
    { day: 21, isToday: false, isPast: false, hasEvent: false },
    { day: 22, isToday: false, isPast: false, hasEvent: false },
    { day: 23, isToday: true, isPast: false, hasEvent: true },
    { day: 24, isToday: false, isPast: false, hasEvent: false },
    { day: 25, isToday: false, isPast: false, hasEvent: false },
    { day: 26, isToday: false, isPast: false, hasEvent: false },
    { day: 27, isToday: false, isPast: false, hasEvent: true },
    { day: 28, isToday: false, isPast: false, hasEvent: false },
  ];
  
  // March days for display
  const nextMonthDays = [
    { day: 1, isToday: false, isPast: false, hasEvent: false },
    { day: 2, isToday: false, isPast: false, hasEvent: false },
    { day: 3, isToday: false, isPast: false, hasEvent: false },
    { day: 4, isToday: false, isPast: false, hasEvent: false },
    { day: 5, isToday: false, isPast: false, hasEvent: false }
  ];
  
  /**
   * Get CSS classes for calendar day cell
   */
  const getDayClasses = (day: { day: number; isToday: boolean; isPast: boolean; hasEvent: boolean }) => {
    let classes = 'w-8 h-8 flex items-center justify-center rounded-full text-sm';
    
    if (day.isToday) {
      classes += ' bg-green-500 text-white';
    } else if (day.hasEvent) {
      classes += ' bg-gray-200';
    }
    
    return classes;
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">{currentMonth}</h2>
        <div className="flex space-x-2">
          <button className="p-1 rounded hover:bg-gray-100">
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
          <button className="p-1 rounded hover:bg-gray-100">
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {/* Weekday headers */}
        {weekdays.map((day, index) => (
          <div key={index} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Days */}
        {days.map((day, index) => (
          <div key={index} className="text-center">
            <div className={getDayClasses(day)}>
              {day.day}
            </div>
          </div>
        ))}
        
        {/* Next month days */}
        {nextMonthDays.map((day, index) => (
          <div key={`next-${index}`} className="text-center">
            <div className="w-8 h-8 flex items-center justify-center rounded-full text-sm text-gray-400">
              {day.day}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar; 