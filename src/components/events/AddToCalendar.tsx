import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CalendarPlus, ChevronDown } from 'lucide-react';
import { Event } from '../../types';
import { generateGoogleCalendarUrl, downloadICalFile } from '../../utils/calendarUtils';
import { cn } from '../../lib/utils';

interface AddToCalendarProps {
  event: Event;
  compact?: boolean;
}

export default function AddToCalendar({ event, compact = false }: AddToCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 140; // Approximate height of dropdown
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Position above if not enough space below
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition({
          top: rect.top - dropdownHeight - 4 + window.scrollY,
          left: rect.left + window.scrollX,
        });
      } else {
        setDropdownPosition({
          top: rect.bottom + 4 + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on scroll
  useEffect(() => {
    if (isOpen) {
      const handleScroll = () => setIsOpen(false);
      window.addEventListener('scroll', handleScroll, true);
      return () => window.removeEventListener('scroll', handleScroll, true);
    }
  }, [isOpen]);

  const handleGoogleCalendar = () => {
    window.open(generateGoogleCalendarUrl(event), '_blank');
    setIsOpen(false);
  };

  const handleAppleCalendar = () => {
    downloadICalFile(event);
    setIsOpen(false);
  };

  const dropdown = isOpen ? (
    <div
      ref={dropdownRef}
      className="fixed z-[9999] w-48 border border-hair bg-film-deep py-1"
      style={{
        top: dropdownPosition.top,
        left: dropdownPosition.left,
      }}
    >
      <button
        onClick={handleGoogleCalendar}
        className="row-hover flex w-full items-center gap-2 px-4 py-2.5 text-left font-mono text-[11px] uppercase tracking-[0.06em] text-mist"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"
            fill="#fff"
            stroke="#4285F4"
            strokeWidth="2"
          />
          <path d="M12 6v6l4 2" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Google Calendar
      </button>
      <button
        onClick={handleAppleCalendar}
        className="row-hover flex w-full items-center gap-2 px-4 py-2.5 text-left font-mono text-[11px] uppercase tracking-[0.06em] text-mist"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" fill="#fff" stroke="#333" strokeWidth="2" />
          <path d="M3 10h18" stroke="#333" strokeWidth="2" />
          <path d="M8 2v4M16 2v4" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Apple Calendar
      </button>
      <button
        onClick={handleAppleCalendar}
        className="row-hover flex w-full items-center gap-2 px-4 py-2.5 text-left font-mono text-[11px] uppercase tracking-[0.06em] text-mist"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" fill="#fff" stroke="#0078D4" strokeWidth="2" />
          <path d="M3 10h18" stroke="#0078D4" strokeWidth="2" />
          <path d="M8 2v4M16 2v4" stroke="#0078D4" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Outlook / Other
      </button>
    </div>
  ) : null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={cn('btn-secondary', compact && 'gap-1.5 px-3 py-1.5 text-[9px]')}
      >
        <CalendarPlus className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
        <span>Add to Calendar</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {createPortal(dropdown, document.body)}
    </div>
  );
}
