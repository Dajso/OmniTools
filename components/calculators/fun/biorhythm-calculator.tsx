'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  calculateBiorhythm,
  getBiorhythmChart,
  getBiorhythmPhase,
  type BiorhythmResult,
} from '@/lib/calculations/fun/biorhythm-calculator';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

/**
 * Zod schema for biorhythm inputs
 */
const biorhythmSchema = z.object({
  birthDate: z.string().min(1, 'Birth date is required'),
  targetDate: z.string().min(1, 'Target date is required'),
});

type BiorhythmInputs = {
  birthDate: string;
  targetDate: string;
};

const INITIAL_INPUTS: BiorhythmInputs = {
  birthDate: '',
  targetDate: new Date().toISOString().split('T')[0],
};

interface ChartData {
  date: string;
  physical: number;
  emotional: number;
  intellectual: number;
  isToday: boolean;
}

interface BiorhythmResults {
  current: BiorhythmResult;
  chartData: ChartData[];
}

/**
 * Cycle indicator component
 */
function CycleIndicator({ 
  label, 
  value, 
  color, 
  emoji 
}: { 
  label: string; 
  value: number; 
  color: string;
  emoji: string;
}) {
  const phase = getBiorhythmPhase(value);
  const percentage = ((value + 100) / 200) * 100;
  
  return (
    <div className="bg-muted/30 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium flex items-center gap-2">
          <span>{emoji}</span> {label}
        </span>
        <span className={cn('text-sm px-2 py-0.5 rounded', {
          'bg-green-100 text-green-700': phase === 'Peak' || phase === 'High',
          'bg-yellow-100 text-yellow-700': phase === 'Neutral',
          'bg-orange-100 text-orange-700': phase === 'Low',
          'bg-red-100 text-red-700': phase === 'Critical',
        })}>
          {phase}
        </span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 rounded-full"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>-100</span>
        <span className="font-medium text-foreground">{value.toFixed(0)}</span>
        <span>+100</span>
      </div>
    </div>
  );
}

/**
 * Custom tooltip for the chart
 */
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value.toFixed(1)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

/**
 * Biorhythm Calculator Component
 * 
 * Calculates and displays biorhythm cycles based on birth date using
 * recharts for visualization.
 * 
 * Features:
 * - Physical, Emotional, and Intellectual cycle tracking
 * - Interactive line chart visualization
 * - Current day indicators
 * - Phase descriptions
 * 
 * @see Requirements 19.4
 */
export function BiorhythmCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<BiorhythmInputs, BiorhythmResults>({
    initialInputs: INITIAL_INPUTS,
    schema: biorhythmSchema as unknown as z.ZodType<BiorhythmInputs>,
    calculate: (formInputs) => {
      const birthDate = new Date(formInputs.birthDate);
      const targetDate = new Date(formInputs.targetDate);
      
      const current = calculateBiorhythm(birthDate, targetDate);
      const chartResults = getBiorhythmChart(birthDate, 30, targetDate);
      
      const chartData: ChartData[] = chartResults.map((result) => ({
        date: result.date.toLocaleDateString('nb-NO', { month: 'short', day: 'numeric' }),
        physical: result.physical,
        emotional: result.emotional,
        intellectual: result.intellectual,
        isToday: result.date.toDateString() === targetDate.toDateString(),
      }));
      
      return { current, chartData };
    },
    storageKey: 'biorhythm-calculator',
  });

  return (
    <CalculatorBase
      title="Biorhythm Calculator"
      description="Track your physical, emotional, and intellectual cycles based on your birth date"
      isCalculateDisabled={!isValid || !inputs.birthDate}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-6">
            {/* Current values */}
            <div className="space-y-3">
              <h3 className="font-medium text-center">Your Biorhythm Today</h3>
              <CycleIndicator
                label="Physical"
                value={results.current.physical}
                color="#ef4444"
                emoji="💪"
              />
              <CycleIndicator
                label="Emotional"
                value={results.current.emotional}
                color="#22c55e"
                emoji="💚"
              />
              <CycleIndicator
                label="Intellectual"
                value={results.current.intellectual}
                color="#3b82f6"
                emoji="🧠"
              />
            </div>
            
            {/* Chart */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-4 text-center">30-Day Biorhythm Chart</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results.chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      domain={[-100, 100]} 
                      tick={{ fontSize: 10 }}
                      ticks={[-100, -50, 0, 50, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                    <Line
                      type="monotone"
                      dataKey="physical"
                      name="Physical"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="emotional"
                      name="Emotional"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="intellectual"
                      name="Intellectual"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Days since birth */}
            <div className="text-center text-sm text-muted-foreground">
              <p>Days since birth: <span className="font-medium text-foreground">{results.current.daysSinceBirth.toLocaleString('nb-NO')}</span></p>
            </div>
            
            {/* Legend explanation */}
            <div className="bg-muted/30 p-4 rounded-lg text-sm">
              <h4 className="font-medium mb-2">Understanding Your Cycles</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li><span className="text-red-500">●</span> <strong>Physical (23 days):</strong> Energy, strength, endurance</li>
                <li><span className="text-green-500">●</span> <strong>Emotional (28 days):</strong> Mood, creativity, sensitivity</li>
                <li><span className="text-blue-500">●</span> <strong>Intellectual (33 days):</strong> Alertness, memory, reasoning</li>
              </ul>
            </div>
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="birthDate">Your Birth Date</Label>
          <Input
            id="birthDate"
            type="date"
            value={inputs.birthDate}
            onChange={(e) => setInput('birthDate', e.target.value)}
            className={cn(errors.birthDate && 'border-destructive')}
          />
          {errors.birthDate && (
            <p className="text-sm text-destructive mt-1">{errors.birthDate}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="targetDate">View Date</Label>
          <Input
            id="targetDate"
            type="date"
            value={inputs.targetDate}
            onChange={(e) => setInput('targetDate', e.target.value)}
            className={cn(errors.targetDate && 'border-destructive')}
          />
          {errors.targetDate && (
            <p className="text-sm text-destructive mt-1">{errors.targetDate}</p>
          )}
        </div>
      </div>
    </CalculatorBase>
  );
}

export default BiorhythmCalculator;
