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
  averageKmBetween: number;
  nextDueDate: Date;
  nextDueMileage: number;
  totalChanges: number;
  daysUntilDue: number;
  kmUntilDue: number;
}

const OIL_TYPES = [
  { value: 'conventional', label: 'Konvensjonell' },
  { value: 'synthetic-blend', label: 'Delsyntetisk' },
  { value: 'full-synthetic', label: 'Helsyntetisk' },
  { value: 'high-mileage', label: 'Høy kjørelengde' },
];

const RECOMMENDED_INTERVALS: Record<string, { km: number; months: number }> = {
  'conventional': { km: 5000, months: 6 },
  'synthetic-blend': { km: 10000, months: 12 },
  'full-synthetic': { km: 15000, months: 12 },
  'high-mileage': { km: 10000, months: 12 },
};

const STORAGE_KEY = 'oil-change-records-no';

function calculateStats(records: OilChangeRecord[], currentMileage: number, oilType: string): OilChangeStats | null {
  if (records.length === 0) return null;
  
  const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestRecord = sortedRecords[0];
  const recommended = RECOMMENDED_INTERVALS[oilType] || RECOMMENDED_INTERVALS['conventional'];
  
  // Calculate averages if we have multiple records
  let averageInterval = recommended.months * 30; // Default to recommended
  let averageKmBetween = recommended.km;
  
  if (sortedRecords.length >= 2) {
    let totalDays = 0;
    let totalKm = 0;
    
    for (let i = 0; i < sortedRecords.length - 1; i++) {
      const current = sortedRecords[i];
      const previous = sortedRecords[i + 1];
      
      const daysDiff = Math.abs(
        (new Date(current.date).getTime() - new Date(previous.date).getTime()) / (1000 * 60 * 60 * 24)
      );
      const kmDiff = current.mileage - previous.mileage;
      
      if (kmDiff > 0) {
        totalDays += daysDiff;
        totalKm += kmDiff;
      }
    }
    
    if (sortedRecords.length > 1) {
      averageInterval = totalDays / (sortedRecords.length - 1);
      averageKmBetween = totalKm / (sortedRecords.length - 1);
    }
  }
  
  // Calculate next due
  const lastChangeDate = new Date(latestRecord.date);
  const nextDueDate = new Date(lastChangeDate);
  nextDueDate.setDate(nextDueDate.getDate() + Math.round(averageInterval));
  
  const nextDueMileage = latestRecord.mileage + averageKmBetween;
  
  const today = new Date();
  const daysUntilDue = Math.round((nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const kmUntilDue = Math.round(nextDueMileage - currentMileage);
  
  return {
    averageInterval: Math.round(averageInterval),
    averageKmBetween: Math.round(averageKmBetween),
    nextDueDate,
    nextDueMileage: Math.round(nextDueMileage),
    totalChanges: records.length,
    daysUntilDue,
    kmUntilDue,
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
          console.error('Kunne ikke lese lagrede data');
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
    if (confirm('Er du sikker på at du vil slette alle registreringer?')) {
      setRecords([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  const getStatusColor = () => {
    if (!stats) return 'bg-muted';
    if (stats.daysUntilDue < 0 || stats.kmUntilDue < 0) return 'bg-red-500/20 border-red-500/50';
    if (stats.daysUntilDue < 14 || stats.kmUntilDue < 1000) return 'bg-yellow-500/20 border-yellow-500/50';
    return 'bg-green-500/20 border-green-500/50';
  };

  const getStatusText = () => {
    if (!stats) return 'Legg til første oljeskift';
    if (stats.daysUntilDue < 0 || stats.kmUntilDue < 0) return '⚠️ Oljeskiftet er på overtid!';
    if (stats.daysUntilDue < 14 || stats.kmUntilDue < 1000) return '🔔 Oljeskiftet nærmer seg';
    return '✅ Oljen er god';
  };

  return (
    <CalculatorBase
      title="Oljeskift og service"
      description="Hold oversikt over oljeskift og få beskjed når det er tid for service"
      onReset={clearAllRecords}
      results={stats && (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border ${getStatusColor()}`}>
            <p className="font-medium text-lg">{getStatusText()}</p>
            {stats && (
              <p className="text-sm text-muted-foreground mt-1">
                {stats.daysUntilDue > 0 
                  ? `${stats.daysUntilDue} dager eller ${stats.kmUntilDue.toLocaleString('nb-NO')} km til neste skift`
                  : `${Math.abs(stats.daysUntilDue)} dager eller ${Math.abs(stats.kmUntilDue).toLocaleString('nb-NO')} km på overtid`
                }
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Neste skift (dato)" 
              value={stats.nextDueDate.toLocaleDateString('nb-NO', { month: 'short', day: 'numeric', year: 'numeric' })}
            />
            <ResultDisplay 
              label="Neste skift (kilometerstand)" 
              value={`${stats.nextDueMileage.toLocaleString('nb-NO')} km`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Snitt dager mellom skift" 
              value={`${stats.averageInterval} dager`}
            />
            <ResultDisplay 
              label="Snitt km mellom skift" 
              value={`${stats.averageKmBetween.toLocaleString('nb-NO')} km`}
            />
          </div>

          <ResultDisplay 
            label="Registrerte oljeskift" 
            value={stats.totalChanges.toString()}
          />
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="current-mileage"
            label="Kilometerstand nå"
            value={currentMileage}
            onChange={setCurrentMileage}
            min={0}
            max={500000}
            step={100}
            unit="km"
          />
          <SelectInput
            id="oil-type"
            label="Oljetype"
            value={oilType}
            onChange={setOilType}
            options={OIL_TYPES}
          />
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Legg til oljeskift</p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="new-date" className="text-sm font-medium">Dato</label>
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
                label="Kilometerstand"
                value={newMileage}
                onChange={setNewMileage}
                min={0}
                max={500000}
                step={100}
                unit="km"
              />
            </div>
            <SelectInput
              id="new-oil-type"
              label="Oljetype"
              value={newOilType}
              onChange={setNewOilType}
              options={OIL_TYPES}
            />
            <Button onClick={addRecord} className="w-full">
              Lagre oljeskift
            </Button>
          </div>
        </div>

        {records.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Historikk ({records.length} registreringer)</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {[...records]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(record => (
                  <div key={record.id} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                    <div>
                      <span className="font-medium">{new Date(record.date).toLocaleDateString('nb-NO')}</span>
                      <span className="text-muted-foreground ml-2">@ {record.mileage.toLocaleString('nb-NO')} km</span>
                      <span className="text-muted-foreground ml-2">({record.oilType})</span>
                    </div>
                    <button
                      onClick={() => deleteRecord(record.id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Slett
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
