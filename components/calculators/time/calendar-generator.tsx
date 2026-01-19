'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  generateCalendar,
  generateCalendarPDF,
  getDayNames,
  MONTH_NAMES,
  type CalendarGeneratorResult,
  type CalendarMonth,
} from '@/lib/calculations/time';

/**
 * Calendar Generator Component
 * 
 * Generates printable calendars with PDF export functionality.
 * 
 * @see Requirements 30.5, 30.8
 */
export function CalendarGenerator() {
  const [year, setYear] = React.useState<number>(new Date().getFullYear());
  const [month, setMonth] = React.useState<number | undefined>(undefined);
  const [startWeekOnMonday, setStartWeekOnMonday] = React.useState(true);
  const [includeHolidays, setIncludeHolidays] = React.useState(true);
  const [calendar, setCalendar] = React.useState<CalendarGeneratorResult | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();

  const generate = React.useCallback(() => {
    try {
      setError(undefined);
      const result = generateCalendar({
        year,
        month,
        startWeekOnMonday,
        includeHolidays,
      });
      setCalendar(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation error');
      setCalendar(null);
    }
  }, [year, month, startWeekOnMonday, includeHolidays]);

  const reset = () => {
    setYear(new Date().getFullYear());
    setMonth(undefined);
    setStartWeekOnMonday(true);
    setIncludeHolidays(true);
    setCalendar(null);
    setError(undefined);
  };

  const downloadPDF = async () => {
    if (!calendar) return;
    
    setIsGeneratingPDF(true);
    try {
      const blob = await generateCalendarPDF(calendar, startWeekOnMonday);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = month !== undefined 
        ? `calendar-${year}-${MONTH_NAMES[month].toLowerCase()}.pdf`
        : `calendar-${year}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  React.useEffect(() => {
    generate();
  }, [generate]);

  const dayNames = getDayNames(startWeekOnMonday);

  const renderMonth = (calendarMonth: CalendarMonth) => (
    <div key={`${calendarMonth.year}-${calendarMonth.month}`} className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold text-center mb-3">
        {calendarMonth.monthName} {calendarMonth.year}
      </h3>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarMonth.weeks.slice(0, 6).flatMap((week) =>
          week.map((day, dayIndex) => {
            const isToday = day.isToday;
            const isCurrentMonth = day.isCurrentMonth;
            const isWeekend = day.isWeekend;
            
            return (
              <div
                key={`${day.date.toISOString()}-${dayIndex}`}
                className={`
                  text-center py-2 text-sm rounded
                  ${isToday ? 'bg-blue-500 text-white font-bold' : ''}
                  ${!isToday && !isCurrentMonth ? 'text-gray-300' : ''}
                  ${!isToday && isCurrentMonth && isWeekend ? 'text-gray-400 bg-gray-50' : ''}
                  ${!isToday && isCurrentMonth && !isWeekend ? 'text-gray-700' : ''}
                  ${day.isHoliday && isCurrentMonth ? 'bg-red-50 text-red-600' : ''}
                `}
                title={day.holidayName}
              >
                {day.day}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <CalculatorBase
      title="Printable Calendar Generator"
      description="Generate and download printable calendars in PDF format"
      onCalculate={generate}
      onReset={reset}
      error={error}
      results={calendar && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {month !== undefined 
                  ? `${MONTH_NAMES[month]} ${year}`
                  : `Full Year ${year}`}
                {calendar.isLeapYear && ' (Leap Year)'}
              </p>
            </div>
            <Button 
              onClick={downloadPDF} 
              disabled={isGeneratingPDF}
              className="flex items-center gap-2"
            >
              {isGeneratingPDF ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Generating...
                </>
              ) : (
                <>
                  📥 Download PDF
                </>
              )}
            </Button>
          </div>

          <div className={`grid gap-4 ${month === undefined ? 'md:grid-cols-2 lg:grid-cols-3' : ''}`}>
            {calendar.months.map(renderMonth)}
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Click &quot;Download PDF&quot; to get a printable version. 
              The PDF is optimized for landscape A4 paper.
            </p>
          </div>

          {includeHolidays && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
                <span>Holiday</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
                <span>Weekend</span>
              </div>
            </div>
          )}
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="year">Year</Label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
            className="w-full mt-1 p-2 border rounded-md bg-background"
            min={1900}
            max={2100}
          />
        </div>

        <div>
          <Label htmlFor="month">Month (optional)</Label>
          <select
            id="month"
            value={month ?? ''}
            onChange={(e) => setMonth(e.target.value === '' ? undefined : parseInt(e.target.value))}
            className="w-full mt-1 p-2 border rounded-md bg-background"
          >
            <option value="">Full Year</option>
            {MONTH_NAMES.map((name, index) => (
              <option key={index} value={index}>
                {name}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Leave empty to generate a full year calendar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="start-monday"
            checked={startWeekOnMonday}
            onChange={(e) => setStartWeekOnMonday(e.target.checked)}
            className="rounded border-gray-300"
          />
          <Label htmlFor="start-monday" className="cursor-pointer">
            Start week on Monday (ISO standard)
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="include-holidays"
            checked={includeHolidays}
            onChange={(e) => setIncludeHolidays(e.target.checked)}
            className="rounded border-gray-300"
          />
          <Label htmlFor="include-holidays" className="cursor-pointer">
            Highlight US holidays
          </Label>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default CalendarGenerator;
