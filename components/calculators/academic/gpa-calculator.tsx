'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  calculateGPA,
  AVAILABLE_GRADES,
  MAX_UNWEIGHTED_GPA,
  MAX_WEIGHTED_GPA,
  type Course,
  type GPAResult
} from '@/lib/calculations/academic/gpa-calculator';
import { Plus, Trash2 } from 'lucide-react';

const GRADE_OPTIONS = AVAILABLE_GRADES.map(grade => ({
  value: grade,
  label: grade,
}));

const CREDIT_OPTIONS = [1, 2, 3, 4, 5, 6].map(c => ({
  value: c.toString(),
  label: `${c} credit${c > 1 ? 's' : ''}`,
}));

interface CourseInput {
  id: string;
  name: string;
  credits: number;
  grade: string;
  isHonors: boolean;
  isAP: boolean;
}

const createEmptyCourse = (): CourseInput => ({
  id: crypto.randomUUID(),
  name: '',
  credits: 3,
  grade: 'A',
  isHonors: false,
  isAP: false,
});

const INITIAL_COURSES: CourseInput[] = [
  { id: '1', name: 'Course 1', credits: 3, grade: 'A', isHonors: false, isAP: false },
  { id: '2', name: 'Course 2', credits: 3, grade: 'B+', isHonors: false, isAP: false },
  { id: '3', name: 'Course 3', credits: 4, grade: 'A-', isHonors: true, isAP: false },
];

export function GPACalculator() {
  const [courses, setCourses] = React.useState<CourseInput[]>(INITIAL_COURSES);
  const [results, setResults] = React.useState<GPAResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const addCourse = () => {
    setCourses(prev => [...prev, createEmptyCourse()]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(prev => prev.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof CourseInput, value: string | number | boolean) => {
    setCourses(prev => prev.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const validCourses: Course[] = courses
        .filter(c => c.grade && c.credits > 0)
        .map(c => ({
          name: c.name || 'Unnamed Course',
          credits: c.credits,
          grade: c.grade,
          isHonors: c.isHonors,
          isAP: c.isAP,
        }));

      if (validCourses.length === 0) {
        setError('Please add at least one course with valid grade and credits');
        setResults(null);
        return;
      }

      const result = calculateGPA(validCourses);
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResults(null);
    }
  }, [courses]);

  const reset = () => {
    setCourses(INITIAL_COURSES);
    setResults(null);
    setError(undefined);
  };

  // Auto-calculate on changes
  React.useEffect(() => {
    calculate();
  }, [courses, calculate]);

  return (
    <CalculatorBase
      title="College GPA Calculator"
      description="Calculate your weighted and unweighted GPA on a 4.0 scale"
      formula="GPA = Σ(Grade Points × Credits) / Σ(Credits)"
      formulaExplanation="Weighted GPA adds +0.5 for Honors and +1.0 for AP courses"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Unweighted GPA"
              value={results.unweightedGPA.toFixed(2)}
              highlight
              copyable
            />
            <ResultDisplay
              label="Weighted GPA"
              value={results.weightedGPA.toFixed(2)}
              highlight
              copyable
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Total Credits"
              value={results.totalCredits.toString()}
            />
            <ResultDisplay
              label="Max Possible (Weighted)"
              value={MAX_WEIGHTED_GPA.toFixed(1)}
            />
          </div>
          {Object.keys(results.gradeDistribution).length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">Grade Distribution</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(results.gradeDistribution).map(([grade, count]) => (
                  <span
                    key={grade}
                    className="px-2 py-1 bg-muted rounded text-sm"
                  >
                    {grade}: {count}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Courses</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCourse}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </div>

        {courses.map((course, index) => (
          <Card key={course.id} className="p-3">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                  placeholder={`Course ${index + 1}`}
                  className="flex-1 px-3 py-1.5 text-sm border rounded-md bg-background"
                  aria-label={`Course ${index + 1} name`}
                />
                {courses.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCourse(course.id)}
                    aria-label={`Remove course ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SelectInput
                  id={`grade-${course.id}`}
                  label="Grade"
                  value={course.grade}
                  onChange={(v) => updateCourse(course.id, 'grade', v)}
                  options={GRADE_OPTIONS}
                />
                <SelectInput
                  id={`credits-${course.id}`}
                  label="Credits"
                  value={course.credits.toString()}
                  onChange={(v) => updateCourse(course.id, 'credits', parseInt(v, 10))}
                  options={CREDIT_OPTIONS}
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={course.isHonors}
                    onChange={(e) => {
                      updateCourse(course.id, 'isHonors', e.target.checked);
                      if (e.target.checked) {
                        updateCourse(course.id, 'isAP', false);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  Honors (+0.5)
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={course.isAP}
                    onChange={(e) => {
                      updateCourse(course.id, 'isAP', e.target.checked);
                      if (e.target.checked) {
                        updateCourse(course.id, 'isHonors', false);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  AP/IB (+1.0)
                </label>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </CalculatorBase>
  );
}

export default GPACalculator;
