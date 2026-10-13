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
      setError(err instanceof Error ? err.message : 'Feil ved opprettelse');
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
        ? `kalender-${year}-${MONTH_NAMES[month].toLowerCase()}.pdf`
        : `kalender-${year}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Kunne ikke lage PDF. Prøv igjen.');
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
        <span className="capitalize">{calendarMonth.monthName}</span> {calendarMonth.year}
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
      title="Kalender til utskrift"
      description="Lag og last ned kalendere til utskrift som PDF, med norske helligdager"
      onCalculate={generate}
      onReset={reset}
      error={error}
      results={calendar && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {month !== undefined 
                  ? `${MONTH_NAMES[month].charAt(0).toUpperCase()}${MONTH_NAMES[month].slice(1)} ${year}`
                  : `Hele året ${year}`}
                {calendar.isLeapYear && '(skuddår)'}
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
                  Lager …
                </>
              ) : (
                <>
                  📥 Last ned PDF
                </>
              )}
            </Button>
          </div>

          <div className={`grid gap-4 ${month === undefined ? 'md:grid-cols-2 lg:grid-cols-3' : ''}`}>
            {calendar.months.map(renderMonth)}
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tips:</strong> Trykk «Last ned PDF» for å få en utskriftsvennlig versjon. PDF-en er tilpasset A4 i liggende format.
            </p>
          </div>

          {includeHolidays && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>I dag</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
                <span>Helligdag</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
                <span>Helg</span>
              </div>
            </div>
          )}
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="year">År</Label>
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
          <Label htmlFor="month">Måned (valgfritt)</Label>
          <select
            id="month"
            value={month ?? ''}
            onChange={(e) => setMonth(e.target.value === '' ? undefined : parseInt(e.target.value))}
            className="w-full mt-1 p-2 border rounded-md bg-background"
          >
            <option value="">Hele året</option>
            {MONTH_NAMES.map((name, index) => (
              <option key={index} value={index} className="capitalize">
                {name}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            La stå tom for å lage kalender for hele året
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
            La uken starte på mandag (ISO-standard)
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
            Marker norske helligdager
          </Label>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default CalendarGenerator;
