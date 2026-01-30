import { Event } from '../types';

/**
 * Get all days to display in a calendar month grid.
 * Includes padding days from previous/next months to fill the grid.
 */
export function getDaysInMonth(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();

  // First day of the month
  const firstDay = new Date(year, month, 1);

  // Day of week for the first day (0 = Sunday)
  const startDayOfWeek = firstDay.getDay();

  // Start from the Sunday of the week containing the first day
  const calendarStart = new Date(year, month, 1 - startDayOfWeek);

  // We need 6 weeks (42 days) to cover all possible month layouts
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const day = new Date(calendarStart);
    day.setDate(calendarStart.getDate() + i);
    days.push(day);
  }

  return days;
}

/**
 * Check if two dates are the same day (ignoring time).
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Check if an event occurs on a specific day.
 * Handles multi-day events by checking if the day falls within the event's date range.
 *
 * Note: Event dates are created from ISO strings (e.g., '2024-07-12') which are parsed
 * as UTC. We use UTC methods to extract the intended date, then compare with local dates.
 */
export function isEventOnDay(event: Event, day: Date): boolean {
  const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());

  // Use UTC methods because event dates are parsed from ISO strings as UTC
  const eventStart = new Date(
    event.date.getUTCFullYear(),
    event.date.getUTCMonth(),
    event.date.getUTCDate()
  );
  const eventEnd = event.endDate
    ? new Date(
        event.endDate.getUTCFullYear(),
        event.endDate.getUTCMonth(),
        event.endDate.getUTCDate()
      )
    : eventStart;

  return dayStart >= eventStart && dayStart <= eventEnd;
}

/**
 * Get all events that occur on a specific day.
 */
export function getEventsForDay(events: Event[], day: Date): Event[] {
  return events.filter((event) => isEventOnDay(event, day));
}

/**
 * Format a date as "Month Year" (e.g., "June 2024").
 */
export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format a date as "Weekday, Month Day, Year" (e.g., "Friday, June 7, 2024").
 */
export function formatFullDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Check if a date is in the same month as another date.
 */
export function isSameMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}
