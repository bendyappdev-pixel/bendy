import { List, CalendarDays } from 'lucide-react';

export type ViewMode = 'list' | 'calendar';

interface ViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-xl bg-white shadow-sm">
      <button
        onClick={() => onViewChange('list')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
          view === 'list'
            ? 'bg-forest text-white'
            : 'text-gray-700 hover:bg-sage/20'
        }`}
      >
        <List className="w-4 h-4" />
        List
      </button>
      <button
        onClick={() => onViewChange('calendar')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
          view === 'calendar'
            ? 'bg-forest text-white'
            : 'text-gray-700 hover:bg-sage/20'
        }`}
      >
        <CalendarDays className="w-4 h-4" />
        Calendar
      </button>
    </div>
  );
}
