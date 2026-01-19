'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { 
  calculateRequiredFinalScore, 
  GRADE_THRESHOLDS,
  type FinalGradeResult 
} from '@/lib/calculations/academic/final-grade-calculator';

const finalGradeSchema = z.object({
  currentGrade: z.number().min(0, 'Grade cannot be negative').max(100, 'Grade cannot exceed 100'),
  targetGrade: z.number().min(0, 'Target cannot be negative').max(100, 'Target cannot exceed 100'),
  finalWeight: z.number().min(1, 'Weight must be at least 1%').max(100, 'Weight cannot exceed 100%'),
});

type FinalGradeInputs = z.infer<typeof finalGradeSchema>;

const INITIAL_INPUTS: FinalGradeInputs = {
  currentGrade: 85,
  targetGrade: 90,
  finalWeight: 25,
};

const TARGET_PRESETS = [
  { label: 'A (90%)', value: 90 },
  { label: 'B (80%)', value: 80 },
  { label: 'C (70%)', value: 70 },
  { label: 'D (60%)', value: 60 },
];

export function FinalGradeCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = 
    useCalculator<FinalGradeInputs, FinalGradeResult>({
      initialInputs: INITIAL_INPUTS,
      schema: finalGradeSchema,
      calculate: (values) => calculateRequiredFinalScore({
        currentGrade: values.currentGrade,
        targetGrade: values.targetGrade,
        finalWeight: values.finalWeight / 100, // Convert percentage to decimal
      }),
      storageKey: 'final-grade-calculator',
    });

  React.useEffect(() => { calculate(); }, []);

  const getScoreColor = (score: number, isAchievable: boolean) => {
    if (!isAchievable) return 'text-destructive';
    if (score <= 60) return 'text-green-600';
    if (score <= 80) return 'text-yellow-600';
    if (score <= 100) return 'text-orange-600';
    return 'text-destructive';
  };

  return (
    <CalculatorBase
      title="Final Grade Calculator"
      description="Calculate the score you need on your final exam to achieve your target grade"
      formula="Required = (Target - Current × (1 - Weight)) / Weight"
      formulaExplanation="Based on weighted average: Final Grade = Current × (1 - Weight) + Exam × Weight"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay 
            label="Required Final Exam Score" 
            value={
              results.requiredScore < 0 
                ? "Already achieved!" 
                : `${results.requiredScore.toFixed(1)}%`
            }
            highlight 
            copyable 
            className={getScoreColor(results.requiredScore, results.isAchievable)}
          />
          
          <div className="p-3 rounded-md bg-muted/50">
            <p className="text-sm">{results.message}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay 
              label="Current Grade Weight" 
              value={`${(results.currentWeight * 100).toFixed(0)}%`} 
            />
            <ResultDisplay 
              label="Final Exam Weight" 
              value={`${inputs.finalWeight}%`} 
            />
          </div>

          {results.isAchievable && results.requiredScore >= 0 && (
            <div className="text-sm text-muted-foreground">
              {results.requiredScore <= 60 && "✅ Very achievable - you're in great shape!"}
              {results.requiredScore > 60 && results.requiredScore <= 80 && "📚 Achievable with good preparation"}
              {results.requiredScore > 80 && results.requiredScore <= 100 && "⚠️ Challenging but possible - study hard!"}
            </div>
          )}
        </div>
      )}
    >
      <NumberInput 
        id="currentGrade" 
        label="Current Grade" 
        value={inputs.currentGrade} 
        onChange={(v) => setInput('currentGrade', v)} 
        min={0} 
        max={100} 
        step={0.1} 
        unit="%" 
        error={errors.currentGrade} 
        required 
      />
      
      <div className="space-y-2">
        <NumberInput 
          id="targetGrade" 
          label="Target Grade" 
          value={inputs.targetGrade}
          onChange={(v) => setInput('targetGrade', v)} 
          min={0} 
          max={100} 
          step={0.1} 
          unit="%" 
          error={errors.targetGrade}
          required
        />
        <div className="flex gap-2 flex-wrap">
          {TARGET_PRESETS.map((preset) => (
            <button 
              key={preset.value} 
              type="button" 
              onClick={() => setInput('targetGrade', preset.value)}
              className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                inputs.targetGrade === preset.value 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <NumberInput 
        id="finalWeight" 
        label="Final Exam Weight" 
        value={inputs.finalWeight}
        onChange={(v) => setInput('finalWeight', v)} 
        min={1} 
        max={100} 
        step={1} 
        unit="%" 
        error={errors.finalWeight}
        required
      />
    </CalculatorBase>
  );
}

export default FinalGradeCalculator;
