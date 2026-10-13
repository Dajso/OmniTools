'use client';

import { labelNo, ABILITY_NAMES_NO } from '@/lib/calculations/rpg/labels';
import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { RefreshCw, Copy, Check } from 'lucide-react';
import {
  generateStats,
  formatModifier,
  ABILITY_SCORES,
  STANDARD_ARRAY,
  POINT_BUY_BUDGET,
  POINT_BUY_COSTS,
  validatePointBuy,
  calculateModifier,
  type StatMethod,
  type CharacterStats,
  type AbilityScore,
} from '@/lib/calculations/rpg/stat-roller';

const METHOD_OPTIONS = [
  { value: '4d6-drop-lowest', label: '4d6, dropp laveste (standard)' },
  { value: '3d6-straight', label: '3d6 rett fram (klassisk)' },
  { value: 'standard-array', label: 'Standardrekke' },
  { value: 'point-buy', label: 'Poengkjøp' },
];

const METHOD_DESCRIPTIONS: Record<StatMethod, string> = {
  '4d6-drop-lowest': 'Kast 4d6 og dropp laveste terning. Vanligste metode i D&D 5e.',
  '3d6-straight': 'Kast 3d6 for hver egenskap. Klassisk og mer tilfeldig.',
  'standard-array': 'Bruk den faste rekken: 15, 14, 13, 12, 10, 8. Balansert og rettferdig.',
  'point-buy': 'Bruk 27 poeng for å tilpasse egenskapene (8–15).',
};

export function RPGStatRoller() {
  const [method, setMethod] = React.useState<StatMethod>('4d6-drop-lowest');
  const [stats, setStats] = React.useState<CharacterStats | null>(null);
  const [pointBuyScores, setPointBuyScores] = React.useState<Record<AbilityScore, number>>({
    Strength: 8,
    Dexterity: 8,
    Constitution: 8,
    Intelligence: 8,
    Wisdom: 8,
    Charisma: 8,
  });
  const [isRolling, setIsRolling] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleRoll = () => {
    if (method === 'point-buy') {
      // Point buy doesn't roll, just validate
      return;
    }

    setIsRolling(true);
    
    // Animate rolling
    setTimeout(() => {
      const result = generateStats(method);
      setStats(result);
      setIsRolling(false);
    }, 300);
  };

  const handlePointBuyChange = (ability: AbilityScore, value: number) => {
    const newScores = { ...pointBuyScores, [ability]: value };
    setPointBuyScores(newScores);
    
    // Update stats display for point buy
    const scores = Object.values(newScores);
    const validation = validatePointBuy(scores);
    
    const totals: Record<string, number> = {};
    const modifier: Record<string, number> = {};
    
    ABILITY_SCORES.forEach((ab, i) => {
      totals[ab] = newScores[ab];
      modifier[ab] = calculateModifier(newScores[ab]);
    });
    
    setStats({
      rolls: ABILITY_SCORES.map(ab => ({
        ability: ab,
        allRolls: [newScores[ab]],
        dropped: 0,
        kept: [newScores[ab]],
        total: newScores[ab],
      })),
      totals: totals as Record<AbilityScore, number>,
      totalPoints: Object.values(newScores).reduce((a, b) => a + b, 0),
      modifier: modifier as Record<AbilityScore, number>,
    });
  };

  const handleCopy = async () => {
    if (!stats) return;
    
    const text = ABILITY_SCORES.map(ab => 
      `${ab}: ${stats.totals[ab]} (${formatModifier(stats.modifier[ab])})`
    ).join('\n');
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  // Generate initial stats
  React.useEffect(() => {
    handleRoll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recalculate when method changes
  React.useEffect(() => {
    if (method === 'point-buy') {
      handlePointBuyChange('Strength', pointBuyScores.Strength);
    } else {
      handleRoll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method]);

  const pointBuyValidation = method === 'point-buy' 
    ? validatePointBuy(Object.values(pointBuyScores))
    : null;

  const getScoreColor = (score: number): string => {
    if (score >= 16) return 'text-green-600';
    if (score >= 14) return 'text-blue-600';
    if (score >= 12) return 'text-primary';
    if (score >= 10) return '';
    if (score >= 8) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Egenskapskast</CardTitle>
        <CardDescription>
          Lag egenskapsverdier til D&D- eller rollespillkarakteren din
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Method Selection */}
        <div className="space-y-2">
          <Label htmlFor="method">Kastemetode</Label>
          <Select
            id="method"
            options={METHOD_OPTIONS}
            value={method}
            onChange={(e) => setMethod(e.target.value as StatMethod)}
          />
          <p className="text-sm text-muted-foreground">
            {METHOD_DESCRIPTIONS[method]}
          </p>
        </div>

        {/* Roll Button (not for point buy) */}
        {method !== 'point-buy' && (
          <Button onClick={handleRoll} disabled={isRolling} className="w-full">
            <RefreshCw className={`h-4 w-4 mr-2 ${isRolling ? 'animate-spin' : ''}`} />
            {isRolling ? 'Kaster …' : 'Kast egenskaper'}
          </Button>
        )}

        {/* Point Buy Interface */}
        {method === 'point-buy' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-muted/50 rounded-lg p-3">
              <span className="font-medium">Poeng igjen</span>
              <span className={`text-2xl font-bold ${
                pointBuyValidation?.remaining === 0 ? 'text-green-600' :
                pointBuyValidation?.remaining && pointBuyValidation.remaining < 0 ? 'text-red-600' : ''
              }`}>
                {pointBuyValidation?.remaining ?? POINT_BUY_BUDGET} / {POINT_BUY_BUDGET}
              </span>
            </div>
            
            <div className="grid gap-3">
              {ABILITY_SCORES.map(ability => (
                <div key={ability} className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                  <span className="font-medium w-28">{labelNo(ABILITY_NAMES_NO, ability)}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePointBuyChange(ability, Math.max(8, pointBuyScores[ability] - 1))}
                      disabled={pointBuyScores[ability] <= 8}
                    >
                      -
                    </Button>
                    <span className={`w-8 text-center text-lg font-bold ${getScoreColor(pointBuyScores[ability])}`}>
                      {pointBuyScores[ability]}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePointBuyChange(ability, Math.min(15, pointBuyScores[ability] + 1))}
                      disabled={pointBuyScores[ability] >= 15 || (pointBuyValidation?.remaining ?? 0) < (POINT_BUY_COSTS[pointBuyScores[ability] + 1] - POINT_BUY_COSTS[pointBuyScores[ability]])}
                    >
                      +
                    </Button>
                    <span className="w-12 text-center text-muted-foreground">
                      ({formatModifier(calculateModifier(pointBuyScores[ability]))})
                    </span>
                    <span className="w-16 text-xs text-muted-foreground">
                      Kostnad: {POINT_BUY_COSTS[pointBuyScores[ability]]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Display (for non-point-buy methods) */}
        {stats && method !== 'point-buy' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Egenskapene dine</p>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Kopiert!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Kopier
                  </>
                )}
              </Button>
            </div>

            <div className="grid gap-3">
              {stats.rolls.map((roll) => (
                <div
                  key={roll.ability}
                  className="flex items-center justify-between bg-muted/50 rounded-lg p-3"
                >
                  <span className="font-medium w-28">{labelNo(ABILITY_NAMES_NO, roll.ability)}</span>
                  
                  {/* Dice breakdown (for rolled methods) */}
                  {method !== 'standard-array' && (
                    <div className="flex gap-1">
                      {roll.allRolls.map((die, i) => (
                        <span
                          key={i}
                          className={`
                            w-6 h-6 rounded text-xs flex items-center justify-center
                            ${die === roll.dropped ? 'bg-red-100 text-red-600 line-through' : 'bg-muted'}
                          `}
                        >
                          {die}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold ${getScoreColor(roll.total)}`}>
                      {roll.total}
                    </span>
                    <span className="text-muted-foreground w-10">
                      ({formatModifier(stats.modifier[roll.ability])})
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Points */}
            <div className="flex justify-between items-center bg-primary/10 rounded-lg p-3">
              <span className="font-medium">Poeng totalt</span>
              <span className="text-xl font-bold">{stats.totalPoints}</span>
            </div>
          </div>
        )}

        {/* Standard Array Reference */}
        {method === 'standard-array' && (
          <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
            <p className="font-medium mb-1">Verdier i standardrekken:</p>
            <p>{STANDARD_ARRAY.join(', ')}</p>
            <p className="mt-2">Fordel verdiene på egenskapene slik du vil.</p>
          </div>
        )}

        {/* Point Buy Cost Reference */}
        {method === 'point-buy' && (
          <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
            <p className="font-medium mb-1">Poengkostnader:</p>
            <div className="grid grid-cols-4 gap-1 text-xs">
              {Object.entries(POINT_BUY_COSTS).map(([score, cost]) => (
                <span key={score}>
                  {score}: {cost} p
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>4d6 med laveste droppet gir vanligvis høyere verdier (snitt ca. 12,2)</li>
            <li>3d6 rett fram er mer tilfeldig og utfordrende (snitt ca. 10,5)</li>
            <li>Standardrekken gir jevne grupper</li>
            <li>Poengkjøp gir full kontroll over karakteren</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default RPGStatRoller;
