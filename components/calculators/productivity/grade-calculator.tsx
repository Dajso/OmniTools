'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateGrade, type GradeItem, type GradeResults } from '@/lib/calculations/productivity/grade-calculator';

export function GradeCalculator() {
  const [items, setItems] = React.useState<GradeItem[]>([{ name: 'Assignment 1', score: 85, maxScore: 100, weight: 25 }]);
  const [useWeights, setUseWeights] = React.useState(true);
  const [results, setResults] = React.useState<GradeResults | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleCalculate = () => {
    try {
      setError(null);
      const result = calculateGrade({ items, useWeights });
      setResults(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Calculation failed');
      setResults(null);
    }
  };

  const addItem = () => {
    setItems([...items, { name: `Item ${items.length + 1}`, score: 0, maxScore: 100, weight: 10 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof GradeItem, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  React.useEffect(() => { handleCalculate(); }, [items, useWeights]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Grade Calculator</CardTitle>
        <CardDescription>Calculate your overall grade from assignments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={useWeights} onChange={(e) => setUseWeights(e.target.checked)} className="w-4 h-4" />
          <span className="text-sm">Use weighted grades</span>
        </label>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Assignments</Label>
            <Button size="sm" variant="outline" onClick={addItem}>+ Add</Button>
          </div>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input type="text" value={item.name} onChange={(e) => updateItem(i, 'name', e.target.value)}
                  className="flex-1 p-2 border rounded-md text-sm" placeholder="Name" />
                <input type="number" value={item.score} onChange={(e) => updateItem(i, 'score', Number(e.target.value))}
                  className="w-16 p-2 border rounded-md text-sm" min={0} placeholder="Score" />
                <span className="text-muted-foreground">/</span>
                <input type="number" value={item.maxScore} onChange={(e) => updateItem(i, 'maxScore', Number(e.target.value))}
                  className="w-16 p-2 border rounded-md text-sm" min={1} placeholder="Max" />
                {useWeights && (
                  <input type="number" value={item.weight} onChange={(e) => updateItem(i, 'weight', Number(e.target.value))}
                    className="w-16 p-2 border rounded-md text-sm" min={0} max={100} placeholder="%" />
                )}
                {items.length > 1 && (
                  <Button size="sm" variant="ghost" onClick={() => removeItem(i)}>×</Button>
                )}
              </div>
            ))}
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {results && (
          <div className="border-t pt-4 space-y-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-4xl font-bold">{results.percentage.toFixed(1)}%</p>
              <p className="text-2xl font-semibold text-muted-foreground">{results.letterGrade}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Total Points" value={`${results.totalPoints}/${results.maxPoints}`} />
              <ResultDisplay label="Weighted Avg" value={`${results.weightedAverage.toFixed(1)}%`} />
              {results.neededForA && <ResultDisplay label="Need for A" value={`${results.neededForA}%`} />}
              {results.neededForB && <ResultDisplay label="Need for B" value={`${results.neededForB}%`} />}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default GradeCalculator;
