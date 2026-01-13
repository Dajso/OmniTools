'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateGPA, AVAILABLE_GRADES, type Course, type GPAResults } from '@/lib/calculations/productivity/gpa-calculator';

export function GPACalculator() {
  const [courses, setCourses] = React.useState<Course[]>([{ name: 'Course 1', grade: 'A', credits: 3 }]);
  const [scale, setScale] = React.useState<'4.0' | '4.3' | '5.0'>('4.0');
  const [results, setResults] = React.useState<GPAResults | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleCalculate = () => {
    try {
      setError(null);
      const result = calculateGPA({ courses, scale });
      setResults(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Calculation failed');
      setResults(null);
    }
  };

  const addCourse = () => {
    setCourses([...courses, { name: `Course ${courses.length + 1}`, grade: 'A', credits: 3 }]);
  };

  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const updateCourse = (index: number, field: keyof Course, value: string | number) => {
    const updated = [...courses];
    updated[index] = { ...updated[index], [field]: value };
    setCourses(updated);
  };

  React.useEffect(() => { handleCalculate(); }, [courses, scale]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>GPA Calculator</CardTitle>
        <CardDescription>Calculate your Grade Point Average</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>GPA Scale</Label>
          <select value={scale} onChange={(e) => setScale(e.target.value as typeof scale)} className="w-full p-2 border rounded-md">
            <option value="4.0">4.0 Scale (Standard)</option>
            <option value="4.3">4.3 Scale (A+ = 4.3)</option>
            <option value="5.0">5.0 Scale (Weighted)</option>
          </select>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Courses</Label>
            <Button size="sm" variant="outline" onClick={addCourse}>+ Add Course</Button>
          </div>
          <div className="space-y-2">
            {courses.map((course, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input type="text" value={course.name} onChange={(e) => updateCourse(i, 'name', e.target.value)}
                  className="flex-1 p-2 border rounded-md text-sm" placeholder="Course name" />
                <select value={course.grade} onChange={(e) => updateCourse(i, 'grade', e.target.value)} className="w-20 p-2 border rounded-md text-sm">
                  {AVAILABLE_GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                <input type="number" value={course.credits} onChange={(e) => updateCourse(i, 'credits', Number(e.target.value))}
                  className="w-20 p-2 border rounded-md text-sm" min={0} max={10} placeholder="Credits" />
                {courses.length > 1 && (
                  <Button size="sm" variant="ghost" onClick={() => removeCourse(i)}>×</Button>
                )}
              </div>
            ))}
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {results && (
          <div className="border-t pt-4 space-y-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-4xl font-bold">{results.gpa.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">GPA ({scale} scale)</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Letter Grade" value={results.letterGrade} />
              <ResultDisplay label="Classification" value={results.classification} />
              <ResultDisplay label="Total Credits" value={results.totalCredits.toString()} />
              <ResultDisplay label="Grade Points" value={results.totalGradePoints.toFixed(2)} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default GPACalculator;
