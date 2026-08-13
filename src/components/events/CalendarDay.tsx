import { Event } from '../../types';
import { cn } from '../../lib/utils';

interface CalendarDayProps {
  date: Date;
  events: Event[];
  isSelected: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
  onClick: () => void;
}

export default function CalendarDay({
  date,
  events,
  isSelected,
  isToday,
  isCurrentMonth,
  onClick,
}: CalendarDayProps) {
  const hasEvents = events.length > 0;

  return (
    <button
      onClick={onClick}
      aria-pressed={isSelected}
      className={cn(
        'row-hover relative flex aspect-square min-h-[40px] flex-col items-center justify-center gap-1 border border-hair font-mono transition-colors md:min-h-[64px]',
        isSelected
          ? 'border-ember bg-[var(--ember-50)] text-film-white'
          : isCurrentMonth
          ? 'text-film-white'
          : 'text-whisper',
        isToday && !isSelected && 'border-ember text-ember'
      )}
    >
      <span className={cn('text-[12px] md:text-[14px]', isSelected && 'font-medium')}>
        {date.getDate()}
      </span>

      {/* Ember dot marks any day carrying events. */}
      {hasEvents && (
        <span
          aria-hidden="true"
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            isSelected ? 'bg-film-white' : 'bg-ember'
          )}
        />
      )}
    </button>
  );
}
