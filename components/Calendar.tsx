'use client'
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CalendarDay = {
  day: number;
  isToday: boolean;
  isPast: boolean;
  hasEvent: boolean;
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [nextMonthDays, setNextMonthDays] = useState<CalendarDay[]>([]);

  // Tên tháng tiếng Việt
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  
  // Thứ trong tuần bằng tiếng Việt
  const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  
  // Lấy tiêu đề tháng và năm tiếng việt
  const getMonthTitle = (date: Date) => {
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Tháng hiện tại
  const currentMonth = getMonthTitle(currentDate);

  // Tạo dữ liệu lịch khi currentDate thay đổi
  useEffect(() => {
    const generateCalendarData = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      // Ngày hiện tại
      const today = new Date();
      
      // Số ngày trong tháng hiện tại
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      // Tạo mảng ngày trong tháng
      const daysArray: CalendarDay[] = [];
      for (let i = 1; i <= daysInMonth; i++) {
        const dayDate = new Date(year, month, i);
        daysArray.push({
          day: i,
          isToday: 
            today.getDate() === i && 
            today.getMonth() === month && 
            today.getFullYear() === year,
          isPast: dayDate < today,
          // Chỉ để mô phỏng, thực tế sẽ lấy từ dữ liệu sự kiện
          hasEvent: false
        });
      }
      setDays(daysArray);
      
      // Những ngày của tháng tiếp theo để hiển thị đủ lưới
      const lastDay = new Date(year, month, daysInMonth);
      let remainingCells = 7 - (lastDay.getDay() || 7) + 1;
      if (remainingCells === 8) remainingCells = 1;
      
      const nextMonthDaysArray: CalendarDay[] = [];
      for (let i = 1; i <= remainingCells; i++) {
        nextMonthDaysArray.push({
          day: i,
          isToday: false,
          isPast: false,
          hasEvent: false
        });
      }
      setNextMonthDays(nextMonthDaysArray);
    };
    
    generateCalendarData();
  }, [currentDate]);

  // Đi đến tháng trước
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Đi đến tháng sau
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  /**
   * Lấy CSS classes cho ô ngày
   */
  const getDayClasses = (day: CalendarDay) => {
    let classes = 'calendar-day';
    
    if (day.isToday) {
      classes += ' today';
    } else if (day.hasEvent) {
      classes += ' event';
    }
    
    if (day.isPast && !day.isToday) {
      classes += ' past';
    }
    
    return classes;
  };

  return (
    <div className="sidebar-section p-5">
      <div className="dot-pattern"></div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">{currentMonth}</h2>
        <div className="flex space-x-2">
          <button 
            className="p-1 rounded-full hover:bg-white/40 transition-colors"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            className="p-1 rounded-full hover:bg-white/40 transition-colors"
            onClick={goToNextMonth}
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {/* Weekday headers */}
        {weekdays.map((day, index) => (
          <div key={index} className="text-center text-sm font-medium text-gray-600">
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
            <div className="calendar-day past">
              {day.day}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar; 