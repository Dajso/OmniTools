'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import {
  calculateEncounter,
  formatDifficulty,
  CR_XP_VALUES,
  type PartyMember,
  type Monster,
  type EncounterResult,
} from '@/lib/calculations/rpg/encounter-calculator';

const CR_OPTIONS = Object.keys(CR_XP_VALUES).map(cr => ({
  value: cr,
  label: `CR ${cr} (${CR_XP_VALUES[cr].toLocaleString()} XP)`,
}));

const LEVEL_OPTIONS = Array.from({ length: 20 }, (_, i) => ({
  value: String(i + 1),
  label: `Level ${i + 1}`,
}));

interface PartyEntry {
  id: number;
  level: number;
  count: number;
}

interface MonsterEntry {
  id: number;
  cr: string;
  count: number;
  name: string;
}

export function EncounterDifficultyCalculator() {
  const [party, setParty] = React.useState<PartyEntry[]>([
    { id: 1, level: 5, count: 4 },
  ]);
  const [monsters, setMonsters] = React.useState<MonsterEntry[]>([
    { id: 1, cr: '1', count: 1, name: '' },
  ]);
  const [result, setResult] = React.useState<EncounterResult | null>(null);
  const partyIdRef = React.useRef(1);
  const monsterIdRef = React.useRef(1);

  const calculateResult = React.useCallback(() => {
    if (party.length === 0 || monsters.length === 0) {
      setResult(null);
      return;
    }

    const partyMembers: PartyMember[] = party.map(p => ({
      level: p.level,
      count: p.count,
    }));

    const monsterList: Monster[] = monsters.map(m => ({
      cr: m.cr,
      count: m.count,
      name: m.name || undefined,
    }));

    try {
      const encounterResult = calculateEncounter(partyMembers, monsterList);
      setResult(encounterResult);
    } catch {
      setResult(null);
    }
  }, [party, monsters]);

  // Recalculate when party or monsters change
  React.useEffect(() => {
    calculateResult();
  }, [calculateResult]);

  const addPartyMember = () => {
    partyIdRef.current += 1;
    setParty(prev => [...prev, { id: partyIdRef.current, level: 5, count: 1 }]);
  };

  const removePartyMember = (id: number) => {
    setParty(prev => prev.filter(p => p.id !== id));
  };

  const updatePartyMember = (id: number, field: 'level' | 'count', value: number) => {
    setParty(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const addMonster = () => {
    monsterIdRef.current += 1;
    setMonsters(prev => [...prev, { id: monsterIdRef.current, cr: '1', count: 1, name: '' }]);
  };

  const removeMonster = (id: number) => {
    setMonsters(prev => prev.filter(m => m.id !== id));
  };

  const updateMonster = (id: number, field: 'cr' | 'count' | 'name', value: string | number) => {
    setMonsters(prev => prev.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'trivial': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'easy': return 'bg-green-100 text-green-700 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'hard': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'deadly': return 'bg-red-100 text-red-700 border-red-300';
      default: return '';
    }
  };

  const totalPartySize = party.reduce((sum, p) => sum + p.count, 0);
  const totalMonsters = monsters.reduce((sum, m) => sum + m.count, 0);

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Encounter Difficulty Calculator</CardTitle>
        <CardDescription>
          Calculate encounter difficulty based on party level and monster CR (D&D 5e rules)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Party Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-base font-medium">Party ({totalPartySize} members)</Label>
            <Button variant="outline" size="sm" onClick={addPartyMember}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="space-y-2">
            {party.map(member => (
              <div key={member.id} className="flex items-center gap-2 bg-blue-50 rounded-lg p-2">
                <Select
                  options={LEVEL_OPTIONS}
                  value={String(member.level)}
                  onChange={(e) => updatePartyMember(member.id, 'level', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">×</span>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={member.count}
                  onChange={(e) => updatePartyMember(member.id, 'count', parseInt(e.target.value) || 1)}
                  className="w-16"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePartyMember(member.id)}
                  disabled={party.length === 1}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Monsters Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-base font-medium">Monsters ({totalMonsters} total)</Label>
            <Button variant="outline" size="sm" onClick={addMonster}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="space-y-2">
            {monsters.map(monster => (
              <div key={monster.id} className="flex items-center gap-2 bg-red-50 rounded-lg p-2">
                <Input
                  placeholder="Name (optional)"
                  value={monster.name}
                  onChange={(e) => updateMonster(monster.id, 'name', e.target.value)}
                  className="flex-1"
                />
                <Select
                  options={CR_OPTIONS}
                  value={monster.cr}
                  onChange={(e) => updateMonster(monster.id, 'cr', e.target.value)}
                  className="w-48"
                />
                <span className="text-sm text-muted-foreground">×</span>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={monster.count}
                  onChange={(e) => updateMonster(monster.id, 'count', parseInt(e.target.value) || 1)}
                  className="w-16"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMonster(monster.id)}
                  disabled={monsters.length === 1}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4 border-t pt-4">
            {/* Difficulty Badge */}
            <div className={`
              text-center p-4 rounded-lg border-2
              ${getDifficultyColor(result.difficulty)}
            `}>
              <p className="text-sm uppercase tracking-wide mb-1">Encounter Difficulty</p>
              <p className="text-3xl font-bold">
                {formatDifficulty(result.difficulty).label}
              </p>
            </div>

            {/* XP Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Base XP</p>
                <p className="text-lg font-bold">{result.totalXP.toLocaleString()}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Multiplier</p>
                <p className="text-lg font-bold">×{result.multiplier}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Adjusted XP</p>
                <p className="text-lg font-bold">{result.adjustedXP.toLocaleString()}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">XP per Player</p>
                <p className="text-lg font-bold">{result.xpPerPlayer.toLocaleString()}</p>
              </div>
            </div>

            {/* Party Thresholds */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Party XP Thresholds</p>
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div className={`p-2 rounded ${result.adjustedXP >= result.partyThresholds.easy ? 'bg-green-100' : 'bg-muted/30'}`}>
                  <p className="text-xs text-muted-foreground">Easy</p>
                  <p className="font-medium">{result.partyThresholds.easy.toLocaleString()}</p>
                </div>
                <div className={`p-2 rounded ${result.adjustedXP >= result.partyThresholds.medium ? 'bg-yellow-100' : 'bg-muted/30'}`}>
                  <p className="text-xs text-muted-foreground">Medium</p>
                  <p className="font-medium">{result.partyThresholds.medium.toLocaleString()}</p>
                </div>
                <div className={`p-2 rounded ${result.adjustedXP >= result.partyThresholds.hard ? 'bg-orange-100' : 'bg-muted/30'}`}>
                  <p className="text-xs text-muted-foreground">Hard</p>
                  <p className="font-medium">{result.partyThresholds.hard.toLocaleString()}</p>
                </div>
                <div className={`p-2 rounded ${result.adjustedXP >= result.partyThresholds.deadly ? 'bg-red-100' : 'bg-muted/30'}`}>
                  <p className="text-xs text-muted-foreground">Deadly</p>
                  <p className="font-medium">{result.partyThresholds.deadly.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Monster Breakdown */}
            {result.monsters.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Monster XP Breakdown</p>
                <div className="space-y-1">
                  {result.monsters.map((m, i) => (
                    <div key={i} className="flex justify-between text-sm bg-muted/30 rounded px-3 py-1">
                      <span>CR {m.cr} × {m.count}</span>
                      <span>{m.xp.toLocaleString()} × {m.count} = {m.totalXP.toLocaleString()} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">Difficulty Guide:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><span className="text-green-600 font-medium">Easy:</span> Little risk, resources barely taxed</li>
            <li><span className="text-yellow-600 font-medium">Medium:</span> Some risk, may need to use resources</li>
            <li><span className="text-orange-600 font-medium">Hard:</span> Significant risk, could go badly</li>
            <li><span className="text-red-600 font-medium">Deadly:</span> Could kill one or more characters</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default EncounterDifficultyCalculator;
