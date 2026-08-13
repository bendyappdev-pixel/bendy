import { ExternalLink } from 'lucide-react';
import { Event } from '../../types';
import AddToCalendar from './AddToCalendar';
import { cn } from '../../lib/utils';

interface EventCardProps {
  event: Event;
  compact?: boolean;
}

const categoryLabels: Record<Event['category'], string> = {
  music: 'Live Music',
  outdoor: 'Outdoor',
  food: 'Food & Drink',
  arts: 'Arts & Culture',
  sports: 'Sports',
  community: 'Community',
};

/**
 * EventCard — a hairline row, not a card. Deliberately mirrors the
 * MarqueeRow treatment on the homepage's "Now Showing" scene: a large
 * film-display date numeral, the title in film-display-thin, and mono
 * venue / category / price columns. `compact` (used inside DayEventsPanel's
 * narrow sidebar) drops the dedicated venue/category/price columns and
 * folds that detail into a single mono meta line under the title instead.
 */
export default function EventCard({ event, compact = false }: EventCardProps) {
  // Event dates are parsed from ISO strings ("2026-04-16") as UTC midnight.
  // Reading them back with UTC accessors keeps the displayed day-of-month
  // and weekday matching the source string; local getters would shift the
  // date by a day for anyone west of UTC.
  const day = String(event.date.getUTCDate()).padStart(2, '0');
  const monthWeekday = event.date.toLocaleDateString('en-US', {
    month: 'short',
    weekday: 'short',
    timeZone: 'UTC',
  });

  return (
    <article
      className={cn(
        'row-hover grid grid-cols-12 items-start gap-x-3 gap-y-2 border-b border-hair',
        compact ? 'py-4' : 'py-5'
      )}
    >
      {/* Date */}
      <div className="col-span-3 flex items-baseline gap-2 md:col-span-2">
        <span
          className={cn(
            'film-display leading-none text-film-white',
            compact ? 'text-[28px]' : 'text-[40px]'
          )}
        >
          {day}
        </span>
        <span className="font-mono text-[10px] uppercase text-whisper">{monthWeekday}</span>
      </div>

      {/* Title + mobile / compact meta */}
      <div className={cn('col-span-9', compact ? 'md:col-span-10' : 'md:col-span-4')}>
        <h3
          className={cn(
            'film-display-thin text-film-white',
            compact ? 'text-[18px]' : 'text-[22px]'
          )}
        >
          {event.title}
        </h3>
        {!compact && (
          <p className="mt-1 line-clamp-1 font-mono text-[11px] text-mist">{event.description}</p>
        )}
        <div
          className={cn(
            'mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.04em] text-whisper',
            !compact && 'md:hidden'
          )}
        >
          <span>{event.location}</span>
          <span>{categoryLabels[event.category]}</span>
          {event.price && <span className="text-ember">{event.price}</span>}
        </div>
      </div>

      {/* Venue / category / price columns — desktop, non-compact only */}
      {!compact && (
        <>
          <div className="col-span-2 hidden font-mono text-[11px] text-mist md:block">
            {event.location}
          </div>
          <div className="col-span-1 hidden font-mono text-[11px] capitalize text-whisper md:block">
            {event.category}
          </div>
          <div className="col-span-1 hidden font-mono text-[11px] text-mist md:block">
            {event.price ?? '—'}
          </div>
        </>
      )}

      {/* Actions */}
      <div
        className={cn(
          'col-span-12 flex flex-wrap items-center gap-4',
          compact ? 'md:col-span-12' : 'md:col-span-2 md:flex-col md:items-end md:gap-2'
        )}
      >
        <AddToCalendar event={event} compact />
        {event.ticketUrl && (
          <a
            href={event.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ember"
          >
            Get tickets
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </article>
  );
}
