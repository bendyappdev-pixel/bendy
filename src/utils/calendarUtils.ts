import { Event } from '../types';

/**
 * Format a date for Google Calendar URL (YYYYMMDDTHHmmssZ format)
 */
function formatDateForGoogle(date: Date): string {
  // Use UTC methods since our dates are stored as UTC
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  // Default to all-day event (no time component)
  return `${year}${month}${day}`;
}

/**
 * Format a date for iCal file (YYYYMMDD format for all-day events)
 */
function formatDateForICal(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Get the end date for calendar purposes (add 1 day for all-day events)
 */
function getCalendarEndDate(event: Event): Date {
  const endDate = event.endDate || event.date;
  // For all-day events, the end date needs to be the next day
  const adjustedEnd = new Date(endDate);
  adjustedEnd.setUTCDate(adjustedEnd.getUTCDate() + 1);
  return adjustedEnd;
}

/**
 * Generate a Google Calendar URL for an event
 */
export function generateGoogleCalendarUrl(event: Event): string {
  const startDate = formatDateForGoogle(event.date);
  const endDate = formatDateForGoogle(getCalendarEndDate(event));

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startDate}/${endDate}`,
    details: event.description + (event.ticketUrl ? `\n\nMore info: ${event.ticketUrl}` : ''),
    location: event.address || event.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate an iCal (.ics) file content for an event
 */
export function generateICalContent(event: Event): string {
  const startDate = formatDateForICal(event.date);
  const endDate = formatDateForICal(getCalendarEndDate(event));
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const uid = `${event.id}-${timestamp}@bendy.app`;

  // Escape special characters for iCal
  const escapeIcal = (str: string) =>
    str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

  const description = escapeIcal(
    event.description + (event.ticketUrl ? `\n\nMore info: ${event.ticketUrl}` : '')
  );
  const location = escapeIcal(event.address || event.location);
  const summary = escapeIcal(event.title);

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Bendy//Event Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
DTSTART;VALUE=DATE:${startDate}
DTEND;VALUE=DATE:${endDate}
DTSTAMP:${timestamp}
UID:${uid}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${location}
STATUS:CONFIRMED
TRANSP:TRANSPARENT
END:VEVENT
END:VCALENDAR`;
}

/**
 * Download an iCal file for an event
 */
export function downloadICalFile(event: Event): void {
  const content = generateICalContent(event);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
