'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Zod schema for day of week inputs
 */
const dayOfWeekSchema = z.object({
  date: z.string().min(1, 'Date is required'),
});

type DayOfWeekInputs = {
  date: string;
};

const INITIAL_INPUTS: DayOfWeekInputs = {
  date: '',
};

interface DayOfWeekResult {
  dayName: string;
  dayNumber: number;
  dayEmoji: string;
  funFact: string;
  historicalEvents: string[];
  famousBirthdays: string[];
  dayMeaning: string;
}

/**
 * Day data with emojis and meanings
 */
const DAY_DATA: Record<number, { name: string; emoji: string; meaning: string; funFact: string }> = {
  0: {
    name: 'Sunday',
    emoji: '☀️',
    meaning: 'Named after the Sun. A day of rest and reflection in many cultures.',
    funFact: 'Sunday is the first day of the week in many countries, but the last in others!',
  },
  1: {
    name: 'Monday',
    emoji: '🌙',
    meaning: 'Named after the Moon. Traditionally the start of the work week.',
    funFact: 'The word Monday comes from Old English "Mōnandæg" meaning "Moon\'s day".',
  },
  2: {
    name: 'Tuesday',
    emoji: '⚔️',
    meaning: 'Named after Tiw/Tyr, the Norse god of war and combat.',
    funFact: 'In Spanish, Tuesday is "Martes", named after Mars, the Roman god of war.',
  },
  3: {
    name: 'Wednesday',
    emoji: '🧙',
    meaning: 'Named after Odin/Woden, the chief Norse god of wisdom.',
    funFact: 'Wednesday is often called "hump day" as it\'s the middle of the work week.',
  },
  4: {
    name: 'Thursday',
    emoji: '⚡',
    meaning: 'Named after Thor, the Norse god of thunder.',
    funFact: 'In German, Thursday is "Donnerstag" which literally means "Thunder\'s day".',
  },
  5: {
    name: 'Friday',
    emoji: '💕',
    meaning: 'Named after Frigg/Freya, the Norse goddess of love and beauty.',
    funFact: 'TGIF! Friday is statistically the happiest day of the week for workers.',
  },
  6: {
    name: 'Saturday',
    emoji: '🪐',
    meaning: 'Named after Saturn, the Roman god of agriculture and time.',
    funFact: 'Saturday is the only day of the week named after a Roman god in English.',
  },
};

/**
 * Historical events by day of week (sample data)
 */
const HISTORICAL_EVENTS: Record<number, string[]> = {
  0: ['First Super Bowl (1967)', 'Moon landing broadcast (1969)', 'Many historic speeches'],
  1: ['Stock market crash (1929)', 'First email sent (1971)', 'Many product launches'],
  2: ['D-Day planning began', 'Mars rover landings', 'Election days in many countries'],
  3: ['First transatlantic flight', 'Many space launches', 'Historic treaties signed'],
  4: ['Thanksgiving (US)', 'Many historic battles', 'First Thanksgiving (1621)'],
  5: ['Black Friday shopping', 'Many historic discoveries', 'Good Friday observances'],
  6: ['Weekend celebrations', 'Many sporting events', 'Historic coronations'],
};

/**
 * Calculate day of week information
 */
function calculateDayOfWeek(date: Date): DayOfWeekResult {
  const dayNumber = date.getDay();
  const dayData = DAY_DATA[dayNumber];
  
  return {
    dayName: dayData.name,
    dayNumber,
    dayEmoji: dayData.emoji,
    funFact: dayData.funFact,
    historicalEvents: HISTORICAL_EVENTS[dayNumber],
    famousBirthdays: [], // Could be expanded with API
    dayMeaning: dayData.meaning,
  };
}

/**
 * Day of the Week Calculator Component
 * 
 * Calculates what day of the week any date falls on and provides
 * interesting facts about that day.
 * 
 * Features:
 * - Day of week calculation for any date
 * - Day name origins and meanings
 * - Fun facts about each day
 * - Historical context
 * 
 * @see Requirements 19.7
 */
export function DayOfWeekCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<DayOfWeekInputs, DayOfWeekResult>({
    initialInputs: INITIAL_INPUTS,
    schema: dayOfWeekSchema as unknown as z.ZodType<DayOfWeekInputs>,
    calculate: (formInputs) => {
      const date = new Date(formInputs.date);
      return calculateDayOfWeek(date);
    },
    storageKey: 'day-of-week-calculator',
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <CalculatorBase
      title="Day of the Week Calculator"
      description="Find out what day of the week any date falls on"
      isCalculateDisabled={!isValid || !inputs.date}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-6">
            {/* Main result */}
            <div className="text-center py-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
              <span className="text-5xl mb-3 block">{results.dayEmoji}</span>
              <p className="text-sm text-muted-foreground mb-1">
                {formatDate(inputs.date)} was a
              </p>
              <h3 className="text-3xl font-bold">{results.dayName}</h3>
            </div>
            
            {/* Day meaning */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <span>📚</span> Origin & Meaning
              </h4>
              <p className="text-sm text-muted-foreground">{results.dayMeaning}</p>
            </div>
            
            {/* Fun fact */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                <span>💡</span> Fun Fact
              </h4>
              <p className="text-sm text-yellow-700">{results.funFact}</p>
            </div>
            
            {/* Historical events */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <span>📜</span> Notable {results.dayName} Events in History
              </h4>
              <ul className="space-y-1">
                {results.historicalEvents.map((event, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {event}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Days of the week reference */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-3">All Days of the Week</h4>
              <div className="grid grid-cols-7 gap-2">
                {Object.entries(DAY_DATA).map(([num, data]) => (
                  <div
                    key={num}
                    className={cn(
                      'text-center p-2 rounded-lg text-xs',
                      parseInt(num) === results.dayNumber
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background'
                    )}
                  >
                    <span className="block text-lg mb-1">{data.emoji}</span>
                    <span className="block truncate">{data.name.slice(0, 3)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="date">Select a Date</Label>
          <Input
            id="date"
            type="date"
            value={inputs.date}
            onChange={(e) => setInput('date', e.target.value)}
            className={cn(errors.date && 'border-destructive')}
          />
          {errors.date && (
            <p className="text-sm text-destructive mt-1">{errors.date}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Enter any date to find out what day of the week it was
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default DayOfWeekCalculator;
