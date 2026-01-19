'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  POKEMON_TYPES,
  calculateEffectiveness,
  analyzeDefensiveMatchups,
  analyzeOffensiveMatchups,
  getTypeColor,
  type PokemonType,
  type DefensiveAnalysis,
  type OffensiveAnalysis,
} from '@/lib/calculations/gaming/pokemon-types';

type Mode = 'attack' | 'defense';

function TypeButton({
  type,
  selected,
  onClick,
  disabled,
}: {
  type: PokemonType;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  const color = getTypeColor(type);
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all
        ${selected 
          ? 'ring-2 ring-offset-2 ring-primary scale-105' 
          : 'hover:scale-105'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{
        backgroundColor: color,
        color: ['electric', 'normal', 'ice', 'fairy'].includes(type) ? '#000' : '#fff',
      }}
    >
      {type}
    </button>
  );
}

function EffectivenessDisplay({
  multiplier,
  types,
  label,
}: {
  multiplier: number;
  types: { type: PokemonType; multiplier?: number }[] | PokemonType[];
  label: string;
}) {
  if (types.length === 0) return null;

  const getMultiplierColor = (mult: number) => {
    if (mult >= 4) return 'text-red-600 bg-red-100';
    if (mult >= 2) return 'text-orange-600 bg-orange-100';
    if (mult === 0) return 'text-gray-600 bg-gray-200';
    if (mult <= 0.25) return 'text-blue-600 bg-blue-100';
    if (mult <= 0.5) return 'text-cyan-600 bg-cyan-100';
    return '';
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex flex-wrap gap-2">
        {types.map((item, index) => {
          const type = typeof item === 'string' ? item : item.type;
          const mult = typeof item === 'string' ? multiplier : (item.multiplier || multiplier);
          const color = getTypeColor(type);
          
          return (
            <span
              key={index}
              className="px-2 py-1 text-xs font-medium rounded capitalize flex items-center gap-1"
              style={{
                backgroundColor: color,
                color: ['electric', 'normal', 'ice', 'fairy'].includes(type) ? '#000' : '#fff',
              }}
            >
              {type}
              {mult !== 1 && (
                <span className={`ml-1 px-1 rounded text-[10px] ${getMultiplierColor(mult)}`}>
                  ×{mult}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function PokemonTypeCalculator() {
  const [mode, setMode] = React.useState<Mode>('defense');
  const [selectedTypes, setSelectedTypes] = React.useState<PokemonType[]>([]);
  const [attackingType, setAttackingType] = React.useState<PokemonType | null>(null);
  const [defensiveAnalysis, setDefensiveAnalysis] = React.useState<DefensiveAnalysis | null>(null);
  const [offensiveAnalysis, setOffensiveAnalysis] = React.useState<OffensiveAnalysis | null>(null);

  const handleTypeClick = (type: PokemonType) => {
    if (mode === 'defense') {
      setSelectedTypes(prev => {
        if (prev.includes(type)) {
          return prev.filter(t => t !== type);
        }
        if (prev.length >= 2) {
          return [prev[1], type];
        }
        return [...prev, type];
      });
    } else {
      setAttackingType(type);
    }
  };

  React.useEffect(() => {
    if (mode === 'defense' && selectedTypes.length > 0) {
      setDefensiveAnalysis(analyzeDefensiveMatchups(selectedTypes));
    } else {
      setDefensiveAnalysis(null);
    }
  }, [mode, selectedTypes]);

  React.useEffect(() => {
    if (mode === 'attack' && attackingType) {
      setOffensiveAnalysis(analyzeOffensiveMatchups(attackingType));
    } else {
      setOffensiveAnalysis(null);
    }
  }, [mode, attackingType]);

  const reset = () => {
    setSelectedTypes([]);
    setAttackingType(null);
    setDefensiveAnalysis(null);
    setOffensiveAnalysis(null);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Pokemon Type Calculator</CardTitle>
        <CardDescription>
          Calculate type effectiveness for Pokemon battles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={mode === 'defense' ? 'default' : 'outline'}
            onClick={() => { setMode('defense'); reset(); }}
            className="flex-1"
          >
            Defensive (What beats me?)
          </Button>
          <Button
            variant={mode === 'attack' ? 'default' : 'outline'}
            onClick={() => { setMode('attack'); reset(); }}
            className="flex-1"
          >
            Offensive (What do I beat?)
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          {mode === 'defense' ? (
            <p>Select 1-2 types to see what types are super effective, not very effective, or have no effect against them.</p>
          ) : (
            <p>Select an attacking type to see what types it&apos;s super effective, not very effective, or has no effect against.</p>
          )}
        </div>

        {/* Type Selection */}
        <div>
          <p className="text-sm font-medium mb-3">
            {mode === 'defense' ? 'Select Pokemon Types (1-2)' : 'Select Attacking Type'}
          </p>
          <div className="flex flex-wrap gap-2">
            {POKEMON_TYPES.map(type => (
              <TypeButton
                key={type}
                type={type}
                selected={mode === 'defense' ? selectedTypes.includes(type) : attackingType === type}
                onClick={() => handleTypeClick(type)}
              />
            ))}
          </div>
        </div>

        {/* Selected Types Display */}
        {mode === 'defense' && selectedTypes.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Selected:</span>
            {selectedTypes.map(type => (
              <span
                key={type}
                className="px-3 py-1 text-sm font-medium rounded capitalize"
                style={{
                  backgroundColor: getTypeColor(type),
                  color: ['electric', 'normal', 'ice', 'fairy'].includes(type) ? '#000' : '#fff',
                }}
              >
                {type}
              </span>
            ))}
            <Button variant="ghost" size="sm" onClick={reset}>
              Clear
            </Button>
          </div>
        )}

        {/* Defensive Analysis Results */}
        {defensiveAnalysis && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium">Type Matchups</h3>
            
            {defensiveAnalysis.weaknesses.length > 0 && (
              <EffectivenessDisplay
                multiplier={2}
                types={defensiveAnalysis.weaknesses}
                label="⚠️ Weak to (takes more damage)"
              />
            )}
            
            {defensiveAnalysis.resistances.length > 0 && (
              <EffectivenessDisplay
                multiplier={0.5}
                types={defensiveAnalysis.resistances}
                label="🛡️ Resistant to (takes less damage)"
              />
            )}
            
            {defensiveAnalysis.immunities.length > 0 && (
              <EffectivenessDisplay
                multiplier={0}
                types={defensiveAnalysis.immunities.map(t => ({ type: t, multiplier: 0 }))}
                label="✨ Immune to (no damage)"
              />
            )}

            <div className="text-sm text-muted-foreground">
              <p>
                <strong>{defensiveAnalysis.weaknesses.length}</strong> weaknesses,{' '}
                <strong>{defensiveAnalysis.resistances.length}</strong> resistances,{' '}
                <strong>{defensiveAnalysis.immunities.length}</strong> immunities
              </p>
            </div>
          </div>
        )}

        {/* Offensive Analysis Results */}
        {offensiveAnalysis && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium">
              <span
                className="px-2 py-1 rounded capitalize mr-2"
                style={{
                  backgroundColor: getTypeColor(offensiveAnalysis.type),
                  color: ['electric', 'normal', 'ice', 'fairy'].includes(offensiveAnalysis.type) ? '#000' : '#fff',
                }}
              >
                {offensiveAnalysis.type}
              </span>
              Type Coverage
            </h3>
            
            {offensiveAnalysis.superEffective.length > 0 && (
              <EffectivenessDisplay
                multiplier={2}
                types={offensiveAnalysis.superEffective.map(t => ({ type: t, multiplier: 2 }))}
                label="💥 Super effective against (×2 damage)"
              />
            )}
            
            {offensiveAnalysis.notVeryEffective.length > 0 && (
              <EffectivenessDisplay
                multiplier={0.5}
                types={offensiveAnalysis.notVeryEffective.map(t => ({ type: t, multiplier: 0.5 }))}
                label="⬇️ Not very effective against (×0.5 damage)"
              />
            )}
            
            {offensiveAnalysis.noEffect.length > 0 && (
              <EffectivenessDisplay
                multiplier={0}
                types={offensiveAnalysis.noEffect.map(t => ({ type: t, multiplier: 0 }))}
                label="❌ No effect against (immune)"
              />
            )}

            <div className="text-sm text-muted-foreground">
              <p>
                Super effective against <strong>{offensiveAnalysis.superEffective.length}</strong> types,{' '}
                resisted by <strong>{offensiveAnalysis.notVeryEffective.length}</strong> types,{' '}
                no effect on <strong>{offensiveAnalysis.noEffect.length}</strong> types
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PokemonTypeCalculator;
