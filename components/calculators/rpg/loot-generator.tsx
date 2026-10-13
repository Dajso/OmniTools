'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { RefreshCw, Copy, Check, Coins, Gem, Palette, Sparkles, Package } from 'lucide-react';
import {
  generateLoot,
  type TreasureTier,
  type LootResult,
  type LootItem,
} from '@/lib/calculations/rpg/loot-generator';

const TIER_OPTIONS = [
  { value: 'minor', label: 'Minor (CR 0-4)' },
  { value: 'moderate', label: 'Moderate (CR 5-10)' },
  { value: 'major', label: 'Major (CR 11-16)' },
  { value: 'legendary', label: 'Legendary (CR 17+)' },
];

const TIER_DESCRIPTIONS: Record<TreasureTier, string> = {
  minor: 'Small treasures suitable for low-level encounters. Common magic items possible.',
  moderate: 'Decent hauls for mid-level parties. Uncommon magic items available.',
  major: 'Significant treasure for high-level encounters. Rare magic items possible.',
  legendary: 'Epic treasures for the mightiest heroes. Very rare and legendary items.',
};

const getItemIcon = (type: string) => {
  switch (type) {
    case 'coins': return <Coins className="h-4 w-4 text-yellow-600" />;
    case 'gems': return <Gem className="h-4 w-4 text-cyan-600" />;
    case 'art': return <Palette className="h-4 w-4 text-purple-600" />;
    case 'magic-item': return <Sparkles className="h-4 w-4 text-pink-600" />;
    case 'mundane': return <Package className="h-4 w-4 text-gray-600" />;
    default: return null;
  }
};

const getRarityColor = (rarity?: string): string => {
  switch (rarity) {
    case 'common': return 'text-gray-600 bg-gray-100';
    case 'uncommon': return 'text-green-600 bg-green-100';
    case 'rare': return 'text-blue-600 bg-blue-100';
    case 'very-rare': return 'text-purple-600 bg-purple-100';
    case 'legendary': return 'text-orange-600 bg-orange-100';
    default: return '';
  }
};

export function LootGenerator() {
  const [tier, setTier] = React.useState<TreasureTier>('moderate');
  const [includeMagic, setIncludeMagic] = React.useState(true);
  const [includeGems, setIncludeGems] = React.useState(true);
  const [includeArt, setIncludeArt] = React.useState(true);
  const [includeMundane, setIncludeMundane] = React.useState(true);
  const [loot, setLoot] = React.useState<LootResult | null>(null);
  const [history, setHistory] = React.useState<LootResult[]>([]);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setCopied(false);

    setTimeout(() => {
      const result = generateLoot(tier, {
        includeMagicItem: includeMagic,
        includeGems,
        includeArt,
        includeMundane,
      });
      setLoot(result);
      setHistory(prev => [result, ...prev.slice(0, 9)]);
      setIsGenerating(false);
    }, 300);
  };

  const handleCopy = async () => {
    if (!loot) return;

    const text = loot.items.map(item => {
      let line = item.name;
      if (item.value) line += ` (${item.value} gp)`;
      if (item.rarity) line += ` [${item.rarity}]`;
      if (item.description) line += ` - ${item.description}`;
      return line;
    }).join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  // Generate initial loot
  React.useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groupedItems = loot?.items.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, LootItem[]>) || {};

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Loot Generator</CardTitle>
        <CardDescription>
          Generate random treasure and loot for your RPG encounters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tier">Treasure Tier</Label>
            <Select
              id="tier"
              options={TIER_OPTIONS}
              value={tier}
              onChange={(e) => setTier(e.target.value as TreasureTier)}
            />
            <p className="text-sm text-muted-foreground">
              {TIER_DESCRIPTIONS[tier]}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeMagic}
                onChange={(e) => setIncludeMagic(e.target.checked)}
                className="rounded"
              />
              <Sparkles className="h-4 w-4 text-pink-600" />
              Magic Items
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeGems}
                onChange={(e) => setIncludeGems(e.target.checked)}
                className="rounded"
              />
              <Gem className="h-4 w-4 text-cyan-600" />
              Gems
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeArt}
                onChange={(e) => setIncludeArt(e.target.checked)}
                className="rounded"
              />
              <Palette className="h-4 w-4 text-purple-600" />
              Art Objects
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeMundane}
                onChange={(e) => setIncludeMundane(e.target.checked)}
                className="rounded"
              />
              <Package className="h-4 w-4 text-gray-600" />
              Mundane Items
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
          <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating...' : 'Generate Loot'}
        </Button>

        {/* Loot Display */}
        {loot && (
          <div className="space-y-4">
            {/* Total Value */}
            <div className="flex justify-between items-center bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Coins className="h-6 w-6 text-yellow-600" />
                <span className="font-medium">Total Value</span>
              </div>
              <span className="text-2xl font-bold text-yellow-700">
                {loot.totalValue.toLocaleString('nb-NO')} gp
              </span>
            </div>

            {/* Copy Button */}
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Loot
                  </>
                )}
              </Button>
            </div>

            {/* Grouped Items */}
            <div className="space-y-4">
              {/* Coins */}
              {groupedItems.coins && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Coins className="h-4 w-4 text-yellow-600" />
                    Currency
                  </div>
                  {groupedItems.coins.map((item, i) => (
                    <div key={i} className="bg-yellow-50 rounded-lg px-4 py-2">
                      {item.name}
                    </div>
                  ))}
                </div>
              )}

              {/* Gems */}
              {groupedItems.gems && groupedItems.gems.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Gem className="h-4 w-4 text-cyan-600" />
                    Gems
                  </div>
                  <div className="grid gap-2">
                    {groupedItems.gems.map((item, i) => (
                      <div key={i} className="flex justify-between items-center bg-cyan-50 rounded-lg px-4 py-2">
                        <span>{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.value} gp</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Art Objects */}
              {groupedItems.art && groupedItems.art.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Palette className="h-4 w-4 text-purple-600" />
                    Art Objects
                  </div>
                  <div className="grid gap-2">
                    {groupedItems.art.map((item, i) => (
                      <div key={i} className="flex justify-between items-center bg-purple-50 rounded-lg px-4 py-2">
                        <span>{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.value} gp</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Magic Items */}
              {groupedItems['magic-item'] && groupedItems['magic-item'].length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4 text-pink-600" />
                    Magic Items
                  </div>
                  <div className="grid gap-2">
                    {groupedItems['magic-item'].map((item, i) => (
                      <div key={i} className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.name}</span>
                          {item.rarity && (
                            <span className={`text-xs px-2 py-0.5 rounded ${getRarityColor(item.rarity)}`}>
                              {item.rarity}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mundane Items */}
              {groupedItems.mundane && groupedItems.mundane.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Package className="h-4 w-4 text-gray-600" />
                    Mundane Items
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {groupedItems.mundane.map((item, i) => (
                      <span key={i} className="bg-gray-100 rounded px-3 py-1 text-sm">
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Recent Generations</p>
            <div className="flex flex-wrap gap-2">
              {history.slice(1).map((h, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => setLoot(h)}
                  className="text-xs"
                >
                  {h.tier} - {h.totalValue} gp
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Tier should match the CR of defeated monsters</li>
            <li>Magic items are randomly included based on tier</li>
            <li>Mundane items add flavor but little value</li>
            <li>Click on history items to view previous loot</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default LootGenerator;
