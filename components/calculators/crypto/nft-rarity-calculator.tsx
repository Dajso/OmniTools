'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Trait {
  id: string;
  name: string;
  occurrences: number;
}

interface RarityResult {
  traits: Array<{
    name: string;
    occurrences: number;
    percentage: number;
    rarityScore: number;
  }>;
  totalRarityScore: number;
  averageRarity: number;
  rank: string;
}

function calculateRarity(traits: Trait[], collectionSize: number): RarityResult {
  const traitResults = traits.map(trait => {
    const percentage = (trait.occurrences / collectionSize) * 100;
    // Rarity score = 1 / (occurrence percentage)
    const rarityScore = 100 / percentage;
    return {
      name: trait.name,
      occurrences: trait.occurrences,
      percentage,
      rarityScore,
    };
  });

  const totalRarityScore = traitResults.reduce((sum, t) => sum + t.rarityScore, 0);
  const averageRarity = totalRarityScore / traits.length;

  // Determine rank based on average rarity
  let rank: string;
  if (averageRarity >= 100) rank = 'Legendary';
  else if (averageRarity >= 50) rank = 'Epic';
  else if (averageRarity >= 20) rank = 'Rare';
  else if (averageRarity >= 10) rank = 'Uncommon';
  else rank = 'Common';

  return {
    traits: traitResults,
    totalRarityScore,
    averageRarity,
    rank,
  };
}

const getRankColor = (rank: string) => {
  switch (rank) {
    case 'Legendary': return 'text-yellow-500';
    case 'Epic': return 'text-purple-500';
    case 'Rare': return 'text-blue-500';
    case 'Uncommon': return 'text-green-500';
    default: return 'text-gray-500';
  }
};

export function NFTRarityCalculator() {
  const [collectionSize, setCollectionSize] = React.useState(10000);
  const [traits, setTraits] = React.useState<Trait[]>([
    { id: '1', name: 'Background', occurrences: 500 },
    { id: '2', name: 'Body', occurrences: 1000 },
    { id: '3', name: 'Eyes', occurrences: 250 },
  ]);
  const [result, setResult] = React.useState<RarityResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      if (collectionSize <= 0) {
        setError('Collection size must be positive');
        setResult(null);
        return;
      }
      if (traits.length === 0) {
        setError('Add at least one trait');
        setResult(null);
        return;
      }
      const invalidTrait = traits.find(t => t.occurrences > collectionSize || t.occurrences <= 0);
      if (invalidTrait) {
        setError(`Trait "${invalidTrait.name}" has invalid occurrences`);
        setResult(null);
        return;
      }
      const rarityResult = calculateRarity(traits, collectionSize);
      setResult(rarityResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [traits, collectionSize]);

  const reset = () => {
    setCollectionSize(10000);
    setTraits([
      { id: '1', name: 'Background', occurrences: 500 },
      { id: '2', name: 'Body', occurrences: 1000 },
      { id: '3', name: 'Eyes', occurrences: 250 },
    ]);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const addTrait = () => {
    setTraits([...traits, { id: Date.now().toString(), name: '', occurrences: 100 }]);
  };

  const removeTrait = (id: string) => {
    setTraits(traits.filter(t => t.id !== id));
  };

  const updateTrait = (id: string, field: 'name' | 'occurrences', value: string | number) => {
    setTraits(traits.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  return (
    <CalculatorBase
      title="NFT Rarity Calculator"
      description="Calculate the rarity score of an NFT based on its traits"
      formula="Rarity Score = 1 / (Trait Occurrence %)"
      formulaExplanation="Lower occurrence percentage = higher rarity score"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Rarity Rank</p>
            <p className={`text-3xl font-bold ${getRankColor(result.rank)}`}>
              {result.rank}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Total Rarity Score"
              value={result.totalRarityScore.toFixed(2)}
              copyable
            />
            <ResultDisplay
              label="Average Rarity"
              value={result.averageRarity.toFixed(2)}
              copyable
            />
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Trait Breakdown</p>
            <div className="space-y-2">
              {result.traits.map((trait, index) => (
                <Card key={index} className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{trait.name || `Trait ${index + 1}`}</span>
                      <span className="text-muted-foreground text-sm ml-2">
                        ({trait.occurrences.toLocaleString()} / {collectionSize.toLocaleString()})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm">{trait.percentage.toFixed(2)}%</span>
                      <span className="text-muted-foreground text-xs ml-2">
                        Score: {trait.rarityScore.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${Math.min(trait.percentage, 100)}%` }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Rarity Tiers</p>
            <div className="grid grid-cols-5 gap-2 text-xs text-center">
              <div><span className="text-gray-500">●</span> Common</div>
              <div><span className="text-green-500">●</span> Uncommon</div>
              <div><span className="text-blue-500">●</span> Rare</div>
              <div><span className="text-purple-500">●</span> Epic</div>
              <div><span className="text-yellow-500">●</span> Legendary</div>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <NumberInput
          id="collection-size"
          label="Collection Size"
          value={collectionSize}
          onChange={setCollectionSize}
          min={1}
          step={100}
          unit="NFTs"
        />

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <Label>Traits</Label>
            <Button type="button" variant="outline" size="sm" onClick={addTrait}>
              + Add Trait
            </Button>
          </div>

          <div className="space-y-3">
            {traits.map((trait, index) => (
              <div key={trait.id} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label htmlFor={`trait-name-${trait.id}`} className="text-xs">
                    Trait {index + 1} Name
                  </Label>
                  <Input
                    id={`trait-name-${trait.id}`}
                    value={trait.name}
                    onChange={(e) => updateTrait(trait.id, 'name', e.target.value)}
                    placeholder="e.g., Background"
                  />
                </div>
                <div className="w-32">
                  <Label htmlFor={`trait-occ-${trait.id}`} className="text-xs">
                    Occurrences
                  </Label>
                  <Input
                    id={`trait-occ-${trait.id}`}
                    type="number"
                    value={trait.occurrences}
                    onChange={(e) => updateTrait(trait.id, 'occurrences', parseInt(e.target.value) || 0)}
                    min={1}
                    max={collectionSize}
                  />
                </div>
                {traits.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTrait(trait.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
          💡 Enter the number of NFTs in the collection that have each trait. 
          Rarer traits (fewer occurrences) contribute more to the overall rarity score.
        </p>
      </div>
    </CalculatorBase>
  );
}

export default NFTRarityCalculator;
