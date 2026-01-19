/**
 * Calendar Generator
 * Generates calendar data and PDF export functionality
 * 
 * @module lib/calculations/time/calendar-generator
 * @see Requirements 30.5, 30.8
 */

export interface CalendarMonth {
  year: number;
  month: number; // 0-indexed
  monthName: string;
  days: CalendarDay[];
  weeks: CalendarDay[][];
}

export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isHoliday?: boolean;
  holidayName?: string;
}

export interface CalendarGeneratorInput {
  year: number;
  month?: number; // 0-indexed, if not provided generates full year
  startWeekOnMonday?: boolean;
  includeHolidays?: boolean;
}

export interface CalendarGeneratorResult {
  months: CalendarMonth[];
  year: number;
  isLeapYear: boolean;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES_SUNDAY_START = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES_MONDAY_START = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * US Federal Holidays (simplified for calendar display)
 */
const US_HOLIDAYS: { month: number; day: number; name: string }[] = [
  { month: 0, day: 1, name: "New Year's Day" },
  { month: 6, day: 4, name: 'Independence Day' },
  { month: 11, day: 25, name: 'Christmas Day' },
];

/**
 * Checks if a year is a leap year
 */
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Gets the number of days in a month
 */
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Checks if a date is today
 */
function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Checks if a date is a weekend
 */
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Gets holiday info for a date
 */
function getHolidayInfo(date: Date): { isHoliday: boolean; holidayName?: string } {
  const month = date.getMonth();
  const day = date.getDate();
  
  for (const holiday of US_HOLIDAYS) {
    if (holiday.month === month && holiday.day === day) {
      return { isHoliday: true, holidayName: holiday.name };
    }
  }
  
  return { isHoliday: false };
}

/**
 * Generates calendar data for a single month
 */
export function generateMonth(
  year: number,
  month: number,
  startWeekOnMonday: boolean = false,
  includeHolidays: boolean = true
): CalendarMonth {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = new Date(year, month, 1);
  let firstDayOfWeek = firstDay.getDay();
  
  // Adjust for Monday start
  if (startWeekOnMonday) {
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  }
  
  const days: CalendarDay[] = [];
  const weeks: CalendarDay[][] = [];
  
  // Add days from previous month
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
  
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(prevMonthYear, prevMonth, daysInPrevMonth - i);
    const holidayInfo = includeHolidays ? getHolidayInfo(date) : { isHoliday: false };
    days.push({
      date,
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: isToday(date),
      isWeekend: isWeekend(date),
      ...holidayInfo,
    });
  }
  
  // Add days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const holidayInfo = includeHolidays ? getHolidayInfo(date) : { isHoliday: false };
    days.push({
      date,
      day,
      isCurrentMonth: true,
      isToday: isToday(date),
      isWeekend: isWeekend(date),
      ...holidayInfo,
    });
  }
  
  // Add days from next month to complete the grid
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextMonthYear = month === 11 ? year + 1 : year;
  const remainingDays = 42 - days.length; // 6 weeks * 7 days
  
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(nextMonthYear, nextMonth, day);
    const holidayInfo = includeHolidays ? getHolidayInfo(date) : { isHoliday: false };
    days.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: isToday(date),
      isWeekend: isWeekend(date),
      ...holidayInfo,
    });
  }
  
  // Group into weeks
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  
  return {
    year,
    month,
    monthName: MONTH_NAMES[month],
    days,
    weeks,
  };
}

/**
 * Generates calendar data for a year or specific month
 */
export function generateCalendar(input: CalendarGeneratorInput): CalendarGeneratorResult {
  const { year, month, startWeekOnMonday = false, includeHolidays = true } = input;
  
  const months: CalendarMonth[] = [];
  
  if (month !== undefined) {
    // Generate single month
    months.push(generateMonth(year, month, startWeekOnMonday, includeHolidays));
  } else {
    // Generate full year
    for (let m = 0; m < 12; m++) {
      months.push(generateMonth(year, m, startWeekOnMonday, includeHolidays));
    }
  }
  
  return {
    months,
    year,
    isLeapYear: isLeapYear(year),
  };
}

/**
 * Gets day names based on week start preference
 */
export function getDayNames(startWeekOnMonday: boolean = false): string[] {
  return startWeekOnMonday ? DAY_NAMES_MONDAY_START : DAY_NAMES_SUNDAY_START;
}

/**
 * Gets month name from index
 */
export function getMonthName(month: number): string {
  return MONTH_NAMES[month];
}

/**
 * Generates PDF calendar using jspdf
 * This function should be called from the client-side component
 */
export async function generateCalendarPDF(
  calendar: CalendarGeneratorResult,
  startWeekOnMonday: boolean = false
): Promise<Blob> {
  // Dynamic import of jspdf for client-side only
  const { jsPDF } = await import('jspdf');
  
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const dayNames = getDayNames(startWeekOnMonday);
  
  calendar.months.forEach((month, index) => {
    if (index > 0) {
      doc.addPage();
    }
    
    // Title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(`${month.monthName} ${month.year}`, pageWidth / 2, margin + 10, { align: 'center' });
    
    // Day headers
    const cellWidth = (pageWidth - 2 * margin) / 7;
    const cellHeight = (pageHeight - margin - 40) / 7;
    const startY = margin + 25;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    dayNames.forEach((day, i) => {
      const x = margin + i * cellWidth + cellWidth / 2;
      doc.text(day, x, startY, { align: 'center' });
    });
    
    // Draw grid and days
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    
    month.weeks.forEach((week, weekIndex) => {
      week.forEach((day, dayIndex) => {
        const x = margin + dayIndex * cellWidth;
        const y = startY + 5 + weekIndex * cellHeight;
        
        // Draw cell border
        doc.setDrawColor(200, 200, 200);
        doc.rect(x, y, cellWidth, cellHeight);
        
        // Set text color based on day type
        if (!day.isCurrentMonth) {
          doc.setTextColor(180, 180, 180);
        } else if (day.isWeekend) {
          doc.setTextColor(150, 150, 150);
        } else {
          doc.setTextColor(0, 0, 0);
        }
        
        // Draw day number
        doc.text(day.day.toString(), x + 3, y + 6);
        
        // Reset text color
        doc.setTextColor(0, 0, 0);
      });
    });
  });
  
  return doc.output('blob');
}

export { MONTH_NAMES, DAY_NAMES_SUNDAY_START, DAY_NAMES_MONDAY_START };
