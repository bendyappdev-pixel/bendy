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
    <div className="border border-hair p-4 md:p-6">
      {/* Header with navigation */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="row-hover flex h-11 w-11 items-center justify-center border border-hair text-whisper transition-colors hover:text-film-white"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h2 className="film-display-thin min-w-[140px] text-center text-[18px] text-film-white md:text-[22px]">
            {formatMonthYear(currentMonth)}
          </h2>
          <button
            onClick={handleNextMonth}
            className="row-hover flex h-11 w-11 items-center justify-center border border-hair text-whisper transition-colors hover:text-film-white"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={handleToday}
          className="small-caps border border-ember px-3 py-3 text-ember transition-colors hover:bg-[var(--ember-50)] hover:text-film-white"
        >
          Today
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2 md:gap-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="small-caps py-2 text-center text-whisper"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid — small fixed gaps so 7 columns never overflow 390px. */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
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
