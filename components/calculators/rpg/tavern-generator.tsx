'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  generateTavern,
  type Tavern,
  type TavernQuality,
} from '@/lib/calculations/rpg/tavern-generator';

const QUALITY_OPTIONS: { value: TavernQuality; label: string; description: string }[] = [
  { value: 'squalid', label: 'Squalid', description: 'Run-down, dangerous' },
  { value: 'poor', label: 'Poor', description: 'Basic, functional' },
  { value: 'modest', label: 'Modest', description: 'Respectable, decent' },
  { value: 'comfortable', label: 'Comfortable', description: 'Well-appointed' },
  { value: 'wealthy', label: 'Wealthy', description: 'Upscale, fine' },
  { value: 'aristocratic', label: 'Aristocratic', description: 'Fit for royalty' },
];

export function TavernGenerator() {
  const [quality, setQuality] = React.useState<TavernQuality | 'random'>('random');
  const [tavern, setTavern] = React.useState<Tavern | null>(null);
  const [history, setHistory] = React.useState<Tavern[]>([]);

  const handleGenerate = () => {
    const newTavern = generateTavern(quality === 'random' ? undefined : quality);
    setTavern(newTavern);
    setHistory(prev => [newTavern, ...prev.slice(0, 4)]);
  };

  const loadFromHistory = (t: Tavern) => {
    setTavern(t);
  };

  const formatPrice = (copper: number): string => {
    if (copper >= 100) {
      return `${Math.floor(copper / 100)} gp`;
    } else if (copper >= 10) {
      return `${Math.floor(copper / 10)} sp`;
    }
    return `${copper} cp`;
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Tavern Generator</CardTitle>
        <CardDescription>
          Generate random taverns with names, staff, menus, and rumors for your RPG
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="quality">Quality Level</Label>
            <select
              id="quality"
              value={quality}
              onChange={(e) => setQuality(e.target.value as TavernQuality | 'random')}
              className="w-48 h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="random">Random</option>
              {QUALITY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} - {opt.description}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleGenerate}>Generate Tavern</Button>
        </div>

        {tavern && (
          <div className="space-y-6 border rounded-lg p-4 bg-muted/20">
            <div className="border-b pb-4">
              <h3 className="text-2xl font-bold text-primary">{tavern.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {tavern.quality} Quality Establishment
              </p>
              <p className="mt-2">{tavern.description}</p>
              <p className="mt-1 italic text-muted-foreground">{tavern.atmosphere}</p>
              {tavern.specialFeature && (
                <p className="mt-2 text-sm bg-primary/10 text-primary px-2 py-1 rounded inline-block">
                  ✨ {tavern.specialFeature}
                </p>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-2">Staff & Patrons</h4>
              <div className="grid gap-2">
                {tavern.npcs.map((npc, i) => (
                  <div key={i} className="bg-background rounded p-2 text-sm">
                    <span className="font-medium">{npc.name}</span>
                    <span className="text-muted-foreground"> ({npc.race} {npc.role})</span>
                    <p className="text-muted-foreground">{npc.description}</p>
                    {npc.quirk && (
                      <p className="text-xs italic text-primary">Quirk: {npc.quirk}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Menu</h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {tavern.menu.map((item, i) => (
                  <div key={i} className="flex justify-between items-start bg-background rounded p-2 text-sm">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs ml-1 text-muted-foreground capitalize">({item.category})</span>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <span className="text-primary font-mono whitespace-nowrap ml-2">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Rumors Heard</h4>
              <ul className="space-y-1">
                {tavern.rumors.map((rumor, i) => (
                  <li key={i} className="text-sm italic bg-background rounded p-2">
                    &ldquo;{rumor}&rdquo;
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {history.length > 1 && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Recent Taverns</p>
            <div className="flex flex-wrap gap-2">
              {history.slice(1).map((t, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => loadFromHistory(t)}
                  className="text-xs"
                >
                  {t.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">Quality Levels:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><strong>Squalid:</strong> 1 sp/day - Dangerous, minimal amenities</li>
            <li><strong>Poor:</strong> 2 sp/day - Basic but functional</li>
            <li><strong>Modest:</strong> 1 gp/day - Decent food and beds</li>
            <li><strong>Comfortable:</strong> 2 gp/day - Good service and quality</li>
            <li><strong>Wealthy:</strong> 4 gp/day - Fine dining and lodging</li>
            <li><strong>Aristocratic:</strong> 10+ gp/day - Luxury accommodations</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default TavernGenerator;
