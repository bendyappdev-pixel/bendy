import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '../../types';
import {
  getDaysInMonth,
  getEventsForDay,
  formatMonthYear,
  isSameDay,
  isSameMonth,
} from '../../utils/dateUtils';
import CalendarDay from './CalendarDay';

interface EventCalendarProps {
  events: Event[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function EventCalendar({
  events,
  selectedDate,
  onDateSelect,
  currentMonth,
  onMonthChange,
}: EventCalendarProps) {
  const today = new Date();
  const days = getDaysInMonth(currentMonth);

  const handlePrevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    onMonthChange(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    onMonthChange(next);
  };

  const handleToday = () => {
    onMonthChange(new Date());
  };

  return (
    <div className="bg-snow rounded-2xl shadow-sm p-4 md:p-6">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg hover:bg-sage/20 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 min-w-[140px] text-center">
            {formatMonthYear(currentMonth)}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg hover:bg-sage/20 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <button
          onClick={handleToday}
          className="px-3 py-1.5 text-sm font-medium text-forest bg-white border border-forest/20 rounded-lg hover:bg-forest/5 transition-colors"
        >
          Today
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(events, day);
          return (
            <CalendarDay
              key={index}
              date={day}
              events={dayEvents}
              isSelected={selectedDate !== null && isSameDay(day, selectedDate)}
              isToday={isSameDay(day, today)}
              isCurrentMonth={isSameMonth(day, currentMonth)}
              onClick={() => onDateSelect(day)}
            />
          );
        })}
      </div>
    </div>
  );
}
