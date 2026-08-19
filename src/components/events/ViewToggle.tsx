import { List, CalendarDays } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ViewMode = 'list' | 'calendar';

interface ViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex border border-hair" role="group" aria-label="Events view">
      <button
        onClick={() => onViewChange('list')}
        aria-pressed={view === 'list'}
        className={cn(
          'small-caps flex items-center gap-2 border-r border-hair px-4 py-2.5 min-h-[44px] transition-colors',
          view === 'list'
            ? 'bg-[var(--ember-50)] text-film-white'
            : 'text-whisper hover:text-film-white'
        )}
      >
        <List className="h-3.5 w-3.5" />
        List
      </button>
      <button
        onClick={() => onViewChange('calendar')}
        aria-pressed={view === 'calendar'}
        className={cn(
          'small-caps flex items-center gap-2 px-4 py-2.5 min-h-[44px] transition-colors',
          view === 'calendar'
            ? 'bg-[var(--ember-50)] text-film-white'
            : 'text-whisper hover:text-film-white'
        )}
      >
        <CalendarDays className="h-3.5 w-3.5" />
        Calendar
      </button>
    </div>
  );
}
