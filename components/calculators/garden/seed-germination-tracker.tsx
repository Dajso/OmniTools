'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { Button } from '@/components/ui/button';

interface SeedEntry {
  id: string;
  plantName: string;
  datePlanted: string;
  seedsPlanted: number;
  seedsGerminated: number;
  daysToGerminate: number;
  notes: string;
}

const COMMON_SEEDS = [
  { value: 'tomato', label: 'Tomat (5–10 dager)', days: 7 },
  { value: 'pepper', label: 'Paprika og chili (10–14 dager)', days: 12 },
  { value: 'lettuce', label: 'Salat (2–10 dager)', days: 6 },
  { value: 'cucumber', label: 'Agurk (3–10 dager)', days: 6 },
  { value: 'squash', label: 'Squash (4–10 dager)', days: 7 },
  { value: 'beans', label: 'Bønner (5–10 dager)', days: 7 },
  { value: 'peas', label: 'Erter (7–14 dager)', days: 10 },
  { value: 'carrot', label: 'Gulrot (10–21 dager)', days: 14 },
  { value: 'spinach', label: 'Spinat (5–14 dager)', days: 9 },
  { value: 'basil', label: 'Basilikum (5–10 dager)', days: 7 },
  { value: 'other', label: 'Annet', days: 7 },
];

const NAME_BY_KEY: Record<string, string> = {
  tomato: 'Tomat', pepper: 'Paprika og chili', lettuce: 'Salat', cucumber: 'Agurk',
  squash: 'Squash', beans: 'Bønner', peas: 'Erter', carrot: 'Gulrot',
  spinach: 'Spinat', basil: 'Basilikum',
};

const displayName = (name: string) => NAME_BY_KEY[name] ?? name;

export function SeedGerminationTracker() {
  const [entries, setEntries] = React.useState<SeedEntry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('seed-germination-tracker');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const [newEntry, setNewEntry] = React.useState({
    plantName: 'tomato',
    customName: '',
    datePlanted: new Date().toISOString().split('T')[0],
    seedsPlanted: 10,
    notes: '',
  });

  // Save to localStorage
  React.useEffect(() => {
    localStorage.setItem('seed-germination-tracker', JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    const plantName = newEntry.plantName === 'other' ? (newEntry.customName.trim() || 'Annet') : displayName(newEntry.plantName);
    const seedInfo = COMMON_SEEDS.find(s => s.value === newEntry.plantName);
    
    const entry: SeedEntry = {
      id: Date.now().toString(),
      plantName,
      datePlanted: newEntry.datePlanted,
      seedsPlanted: newEntry.seedsPlanted,
      seedsGerminated: 0,
      daysToGerminate: seedInfo?.days || 7,
      notes: newEntry.notes,
    };

    setEntries([entry, ...entries]);
    setNewEntry({
      plantName: 'tomato',
      customName: '',
      datePlanted: new Date().toISOString().split('T')[0],
      seedsPlanted: 10,
      notes: '',
    });
  };

  const updateGerminated = (id: string, count: number) => {
    setEntries(entries.map(e => 
      e.id === id ? { ...e, seedsGerminated: Math.min(count, e.seedsPlanted) } : e
    ));
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const getDaysSincePlanting = (datePlanted: string) => {
    const planted = new Date(datePlanted);
    const today = new Date();
    return Math.floor((today.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getGerminationRate = (entry: SeedEntry) => {
    if (entry.seedsPlanted === 0) return 0;
    return Math.round((entry.seedsGerminated / entry.seedsPlanted) * 100);
  };

  const getStatus = (entry: SeedEntry) => {
    const days = getDaysSincePlanting(entry.datePlanted);
    const rate = getGerminationRate(entry);
    
    if (rate >= 80) return { text: 'Svært bra', color: 'text-green-600' };
    if (rate >= 50) return { text: 'Bra', color: 'text-yellow-600' };
    if (days < entry.daysToGerminate) return { text: 'Venter', color: 'text-blue-600' };
    if (rate > 0) return { text: 'Delvis', color: 'text-orange-600' };
    return { text: 'Ingen spiring', color: 'text-red-600' };
  };

  // Calculate summary stats
  const totalSeeds = entries.reduce((sum, e) => sum + e.seedsPlanted, 0);
  const totalGerminated = entries.reduce((sum, e) => sum + e.seedsGerminated, 0);
  const overallRate = totalSeeds > 0 ? Math.round((totalGerminated / totalSeeds) * 100) : 0;

  return (
    <CalculatorBase
      title="Spiringslogg"
      description="Hold oversikt over hvor mange frø som spirer"
      formula="Spiringsprosent = (frø som har spirt ÷ frø sådd) × 100 %"
      formulaExplanation="Loggen lagres bare i nettleseren din"
      results={
        entries.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold">{entries.length}</p>
                <p className="text-xs text-muted-foreground">Seriar</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{totalSeeds}</p>
                <p className="text-xs text-muted-foreground">Frø sådd</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{overallRate}&nbsp;%</p>
                <p className="text-xs text-muted-foreground">Spiringsprosent</p>
              </div>
            </div>

            <div className="space-y-3">
              {entries.map((entry) => {
                const days = getDaysSincePlanting(entry.datePlanted);
                const rate = getGerminationRate(entry);
                const status = getStatus(entry);

                return (
                  <div key={entry.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{displayName(entry.plantName)}</p>
                        <p className="text-xs text-muted-foreground">
                          Sådd {new Date(entry.datePlanted).toLocaleDateString('nb-NO')} ({days} dager siden)
                        </p>
                      </div>
                      <span className={`text-sm font-medium ${status.color}`}>
                        {status.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Spirt</span>
                          <span>{entry.seedsGerminated} / {entry.seedsPlanted} ({rate}&nbsp;%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateGerminated(entry.id, entry.seedsGerminated + 1)}
                          disabled={entry.seedsGerminated >= entry.seedsPlanted}
                        >
                          +1
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteEntry(entry.id)}
                        >
                          ✕
                        </Button>
                      </div>
                    </div>

                    {entry.notes && (
                      <p className="text-xs text-muted-foreground mt-2">{entry.notes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Ingen frø registrert ennå.</p>
            <p className="text-sm">Legg til første sådd nedenfor!</p>
          </div>
        )
      }
    >
      <div className="space-y-4 border-t pt-4">
        <p className="text-sm font-medium">Legg til ny sådd</p>

        <SelectInput
          id="plantName"
          label="Type plante"
          value={newEntry.plantName}
          onChange={(v) => setNewEntry({ ...newEntry, plantName: v })}
          options={COMMON_SEEDS.map(s => ({ value: s.value, label: s.label }))}
        />

        {newEntry.plantName === 'other' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Navn på planten</label>
            <input
              type="text"
              value={newEntry.customName}
              onChange={(e) => setNewEntry({ ...newEntry, customName: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Skriv inn navn"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Såddato</label>
            <input
              type="date"
              value={newEntry.datePlanted}
              onChange={(e) => setNewEntry({ ...newEntry, datePlanted: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <NumberInput
            id="seedsPlanted"
            label="Antall frø sådd"
            value={newEntry.seedsPlanted}
            onChange={(v) => setNewEntry({ ...newEntry, seedsPlanted: v })}
            min={1}
            max={1000}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notat (valgfritt)</label>
          <input
            type="text"
            value={newEntry.notes}
            onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Jordtype, temperatur osv."
          />
        </div>

        <Button onClick={addEntry} className="w-full">
          Legg til sådd
        </Button>
      </div>
    </CalculatorBase>
  );
}

export default SeedGerminationTracker;
