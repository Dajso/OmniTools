'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { Button } from '@/components/ui/button';

interface OilChangeRecord {
  id: string;
  date: string;
  mileage: number;
  oilType: string;
  notes: string;
}

interface OilChangeStats {
  averageInterval: number;
  averageMilesBetween: number;
  nextDueDate: Date;
  nextDueMileage: number;
  totalChanges: number;
  daysUntilDue: number;
  milesUntilDue: number;
}

const OIL_TYPES = [
  { value: 'conventional', label: 'Conventional' },
  { value: 'synthetic-blend', label: 'Synthetic Blend' },
  { value: 'full-synthetic', label: 'Full Synthetic' },
  { value: 'high-mileage', label: 'High Mileage' },
];

const RECOMMENDED_INTERVALS: Record<string, { miles: number; months: number }> = {
  'conventional': { miles: 3000, months: 3 },
  'synthetic-blend': { miles: 5000, months: 6 },
  'full-synthetic': { miles: 7500, months: 12 },
  'high-mileage': { miles: 5000, months: 6 },
};

const STORAGE_KEY = 'oil-change-records';

function calculateStats(records: OilChangeRecord[], currentMileage: number, oilType: string): OilChangeStats | null {
  if (records.length === 0) return null;
  
  const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestRecord = sortedRecords[0];
  const recommended = RECOMMENDED_INTERVALS[oilType] || RECOMMENDED_INTERVALS['conventional'];
  
  // Calculate averages if we have multiple records
  let averageInterval = recommended.months * 30; // Default to recommended
  let averageMilesBetween = recommended.miles;
  
  if (sortedRecords.length >= 2) {
    let totalDays = 0;
    let totalMiles = 0;
    
    for (let i = 0; i < sortedRecords.length - 1; i++) {
      const current = sortedRecords[i];
      const previous = sortedRecords[i + 1];
      
      const daysDiff = Math.abs(
        (new Date(current.date).getTime() - new Date(previous.date).getTime()) / (1000 * 60 * 60 * 24)
      );
      const milesDiff = current.mileage - previous.mileage;
      
      if (milesDiff > 0) {
        totalDays += daysDiff;
        totalMiles += milesDiff;
      }
    }
    
    if (sortedRecords.length > 1) {
      averageInterval = totalDays / (sortedRecords.length - 1);
      averageMilesBetween = totalMiles / (sortedRecords.length - 1);
    }
  }
  
  // Calculate next due
  const lastChangeDate = new Date(latestRecord.date);
  const nextDueDate = new Date(lastChangeDate);
  nextDueDate.setDate(nextDueDate.getDate() + Math.round(averageInterval));
  
  const nextDueMileage = latestRecord.mileage + averageMilesBetween;
  
  const today = new Date();
  const daysUntilDue = Math.round((nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const milesUntilDue = Math.round(nextDueMileage - currentMileage);
  
  return {
    averageInterval: Math.round(averageInterval),
    averageMilesBetween: Math.round(averageMilesBetween),
    nextDueDate,
    nextDueMileage: Math.round(nextDueMileage),
    totalChanges: records.length,
    daysUntilDue,
    milesUntilDue,
  };
}

export function OilChangeTracker() {
  const [records, setRecords] = React.useState<OilChangeRecord[]>([]);
  const [currentMileage, setCurrentMileage] = React.useState(50000);
  const [oilType, setOilType] = React.useState('full-synthetic');
  
  // New record form
  const [newDate, setNewDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [newMileage, setNewMileage] = React.useState(50000);
  const [newOilType, setNewOilType] = React.useState('full-synthetic');
  const [newNotes, setNewNotes] = React.useState('');
  
  const [stats, setStats] = React.useState<OilChangeStats | null>(null);

  // Load records from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setRecords(parsed);
        } catch (e) {
          console.error('Failed to parse saved records');
        }
      }
    }
  }, []);

  // Save records to localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined' && records.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  }, [records]);

  // Calculate stats when records or current mileage changes
  React.useEffect(() => {
    const newStats = calculateStats(records, currentMileage, oilType);
    setStats(newStats);
  }, [records, currentMileage, oilType]);

  const addRecord = () => {
    const record: OilChangeRecord = {
      id: Date.now().toString(),
      date: newDate,
      mileage: newMileage,
      oilType: newOilType,
      notes: newNotes,
    };
    
    setRecords(prev => [...prev, record]);
    setNewNotes('');
    setNewMileage(currentMileage);
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const clearAllRecords = () => {
    if (confirm('Are you sure you want to delete all records?')) {
      setRecords([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  const getStatusColor = () => {
    if (!stats) return 'bg-muted';
    if (stats.daysUntilDue < 0 || stats.milesUntilDue < 0) return 'bg-red-500/20 border-red-500/50';
    if (stats.daysUntilDue < 14 || stats.milesUntilDue < 500) return 'bg-yellow-500/20 border-yellow-500/50';
    return 'bg-green-500/20 border-green-500/50';
  };

  const getStatusText = () => {
    if (!stats) return 'Add your first oil change record';
    if (stats.daysUntilDue < 0 || stats.milesUntilDue < 0) return '⚠️ Oil change overdue!';
    if (stats.daysUntilDue < 14 || stats.milesUntilDue < 500) return '🔔 Oil change due soon';
    return '✅ Oil is good';
  };

  return (
    <CalculatorBase
      title="Oil Change Tracker"
      description="Track your oil changes and get reminders when service is due"
      onReset={clearAllRecords}
      results={stats && (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border ${getStatusColor()}`}>
            <p className="font-medium text-lg">{getStatusText()}</p>
            {stats && (
              <p className="text-sm text-muted-foreground mt-1">
                {stats.daysUntilDue > 0 
                  ? `${stats.daysUntilDue} days or ${stats.milesUntilDue.toLocaleString()} miles until next change`
                  : `${Math.abs(stats.daysUntilDue)} days or ${Math.abs(stats.milesUntilDue).toLocaleString()} miles overdue`
                }
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Next Due Date" 
              value={stats.nextDueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            />
            <ResultDisplay 
              label="Next Due Mileage" 
              value={`${stats.nextDueMileage.toLocaleString()} mi`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Avg. Days Between" 
              value={`${stats.averageInterval} days`}
            />
            <ResultDisplay 
              label="Avg. Miles Between" 
              value={`${stats.averageMilesBetween.toLocaleString()} mi`}
            />
          </div>

          <ResultDisplay 
            label="Total Oil Changes Logged" 
            value={stats.totalChanges.toString()}
          />
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="current-mileage"
            label="Current Odometer"
            value={currentMileage}
            onChange={setCurrentMileage}
            min={0}
            max={500000}
            step={100}
            unit="mi"
          />
          <SelectInput
            id="oil-type"
            label="Oil Type Used"
            value={oilType}
            onChange={setOilType}
            options={OIL_TYPES}
          />
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Add New Oil Change</p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="new-date" className="text-sm font-medium">Date</label>
                <input
                  id="new-date"
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                />
              </div>
              <NumberInput
                id="new-mileage"
                label="Mileage"
                value={newMileage}
                onChange={setNewMileage}
                min={0}
                max={500000}
                step={100}
                unit="mi"
              />
            </div>
            <SelectInput
              id="new-oil-type"
              label="Oil Type"
              value={newOilType}
              onChange={setNewOilType}
              options={OIL_TYPES}
            />
            <Button onClick={addRecord} className="w-full">
              Add Oil Change Record
            </Button>
          </div>
        </div>

        {records.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">History ({records.length} records)</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {[...records]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(record => (
                  <div key={record.id} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                    <div>
                      <span className="font-medium">{new Date(record.date).toLocaleDateString()}</span>
                      <span className="text-muted-foreground ml-2">@ {record.mileage.toLocaleString()} mi</span>
                      <span className="text-muted-foreground ml-2">({record.oilType})</span>
                    </div>
                    <button
                      onClick={() => deleteRecord(record.id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorBase>
  );
}

export default OilChangeTracker;
