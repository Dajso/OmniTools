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
  date: z.string().min(1, 'Dato må fylles ut'),
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
    name: 'Søndag',
    emoji: '☀️',
    meaning: 'Oppkalt etter solen (norrønt «sunnudagr»). En hviledag i mange kulturer.',
    funFact: 'I Norge og resten av Europa regnes mandag som første dag i uken, mens søndag er første dag i USA.',
  },
  1: {
    name: 'Mandag',
    emoji: '🌙',
    meaning: 'Oppkalt etter månen (norrønt «mánadagr»). Tradisjonelt starten på arbeidsuken.',
    funFact: 'Mandag betyr «månens dag», og det engelske Monday har samme opphav.',
  },
  2: {
    name: 'Tirsdag',
    emoji: '⚔️',
    meaning: 'Oppkalt etter Tyr, den norrøne krigsguden («Tysdagr»).',
    funFact: 'På spansk heter tirsdag «martes», etter krigsguden Mars hos romerne.',
  },
  3: {
    name: 'Onsdag',
    emoji: '🧙',
    meaning: 'Oppkalt etter Odin («Óðinsdagr»), visdommens og krigens gud i norrøn mytologi.',
    funFact: 'På fransk heter onsdag «mercredi», oppkalt etter guden Merkur.',
  },
  4: {
    name: 'Torsdag',
    emoji: '⚡',
    meaning: 'Oppkalt etter Tor, tordenguden («Þórsdagr»).',
    funFact: 'På tysk heter torsdag «Donnerstag», som betyr «tordenens dag».',
  },
  5: {
    name: 'Fredag',
    emoji: '💕',
    meaning: 'Oppkalt etter Frigg eller Freyja, gudinner knyttet til kjærlighet og frodighet.',
    funFact: 'Fredagstaco er blitt en kjent norsk tradisjon, og mange spiser taco hver fredag.',
  },
  6: {
    name: 'Lørdag',
    emoji: '🪐',
    meaning: 'Kommer av norrønt «laugardagr», som betyr «bade- eller vaskedag».',
    funFact: 'I Norge er lørdag tradisjonelt dagen for lørdagsgodt.',
  },
};

/**
 * Kjente hendelser (norske og internasjonale) etter ukedag. Ukedagene er kontrollert mot kalenderen.
 */
const HISTORICAL_EVENTS: Record<number, string[]> = {
  0: ['Første menneske på månen (20. juli 1969)', 'Mange store taler og gudstjenester'],
  1: ['Norge blir medlem av NATO (4. april 1949)', 'Folkeavstemning om EU-medlemskap (28. november 1994)'],
  2: ['Tyskland angriper Norge (9. april 1940)', 'Frigjøringen etter andre verdenskrig (8. mai 1945)'],
  3: ['Unionsoppløsningen med Sverige vedtas (7. juni 1905)', 'Mange viktige avtaler er undertegnet på onsdager'],
  4: ['Roald Amundsen og følget når Sørpolen (14. desember 1911)', 'Mange store oppdagelser'],
  5: ['Andre verdenskrig begynner (1. september 1939)', 'Fredagstaco og helgestart for mange'],
  6: ['Vinter-OL åpnes på Lillehammer (12. februar 1994)', 'Mange idrettsarrangementer'],
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
      const [y, m, d] = formInputs.date.split('-').map(Number);
      return calculateDayOfWeek(new Date(y, m - 1, d));
    },
    storageKey: 'day-of-week-calculator',
  });

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('nb-NO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <CalculatorBase
      title="Ukedag-kalkulator"
      description="Finn ut hvilken ukedag en dato faller på"
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
                {formatDate(inputs.date)} faller på en
              </p>
              <h3 className="text-3xl font-bold">{results.dayName}</h3>
            </div>
            
            {/* Day meaning */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <span>📚</span> Opphav og betydning
              </h4>
              <p className="text-sm text-muted-foreground">{results.dayMeaning}</p>
            </div>
            
            {/* Fun fact */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                <span>💡</span> Visste du?
              </h4>
              <p className="text-sm text-yellow-700">{results.funFact}</p>
            </div>
            
            {/* Historical events */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <span>📜</span> Kjente hendelser på en {results.dayName.toLowerCase()}
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
              <h4 className="font-medium mb-3">Alle ukedager</h4>
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
          <Label htmlFor="date">Velg en dato</Label>
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
            Skriv inn en dato for å se hvilken ukedag det var eller blir
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default DayOfWeekCalculator;
