import { Event } from '../../types';

interface CalendarDayProps {
  date: Date;
  events: Event[];
  isSelected: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
  onClick: () => void;
}

// Category colors for event dots
const categoryDotColors: Record<Event['category'], string> = {
  music: 'bg-purple-500',
  outdoor: 'bg-green-500',
  food: 'bg-amber-500',
  arts: 'bg-pink-500',
  sports: 'bg-blue-500',
  community: 'bg-teal-500',
};

export default function CalendarDay({
  date,
  events,
  isSelected,
  isToday,
  isCurrentMonth,
  onClick,
}: CalendarDayProps) {
  // Get unique categories for the day (max 3 dots)
  const uniqueCategories = [...new Set(events.map((e) => e.category))].slice(0, 3);

  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center
        min-h-[48px] md:min-h-[64px] p-1 rounded-lg
        transition-colors cursor-pointer
        ${
          isSelected
            ? 'bg-sunset-500 text-white'
            : isToday
            ? 'bg-sunset-500/20 text-sunset-400 font-semibold ring-1 ring-sunset-500/50'
            : isCurrentMonth
            ? 'hover:bg-white/10 text-white'
            : 'text-gray-600 hover:bg-white/5'
        }
      `}
    >
      <span className={`text-sm md:text-base ${isSelected ? 'font-semibold' : ''}`}>
        {date.getDate()}
      </span>

      {/* Event indicators */}
      {events.length > 0 && (
        <div className="flex gap-0.5 mt-1">
          {uniqueCategories.map((category) => (
            <span
              key={category}
              className={`w-1.5 h-1.5 rounded-full ${
                isSelected ? 'bg-white' : categoryDotColors[category]
              }`}
            />
          ))}
        </div>
      )}
    </button>
  );
}
