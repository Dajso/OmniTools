'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Copy, Check, RefreshCw } from 'lucide-react';
import {
  generateFantasyNames,
  FANTASY_RACES,
  GENDERS,
  type FantasyRace,
  type Gender,
  type GeneratedName,
} from '@/lib/calculations/rpg/name-generator';

const RACE_OPTIONS = FANTASY_RACES.map(race => ({
  value: race,
  label: race.charAt(0).toUpperCase() + race.slice(1),
}));

const GENDER_OPTIONS = GENDERS.map(gender => ({
  value: gender,
  label: gender.charAt(0).toUpperCase() + gender.slice(1),
}));

const COUNT_OPTIONS = [
  { value: '1', label: '1 name' },
  { value: '5', label: '5 names' },
  { value: '10', label: '10 names' },
  { value: '20', label: '20 names' },
];

const RACE_DESCRIPTIONS: Record<FantasyRace, string> = {
  elf: 'Graceful and long-lived, with melodic names',
  dwarf: 'Sturdy and proud, with strong consonant names',
  human: 'Diverse and adaptable, with varied naming traditions',
  orc: 'Fierce and powerful, with harsh guttural names',
  halfling: 'Cheerful and nimble, with homey comfortable names',
  dragonborn: 'Noble and draconic, with exotic sounding names',
};

const RACE_EMOJIS: Record<FantasyRace, string> = {
  elf: '🧝',
  dwarf: '⛏️',
  human: '👤',
  orc: '👹',
  halfling: '🍀',
  dragonborn: '🐉',
};

export function FantasyNameGenerator() {
  const [race, setRace] = React.useState<FantasyRace>('human');
  const [gender, setGender] = React.useState<Gender>('neutral');
  const [count, setCount] = React.useState(5);
  const [names, setNames] = React.useState<GeneratedName[]>([]);
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setCopiedIndex(null);
    
    // Small delay for visual feedback
    setTimeout(() => {
      const generated = generateFantasyNames({ race, gender, count });
      setNames(generated);
      setIsGenerating(false);
    }, 200);
  };

  const handleCopy = async (name: string, index: number) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  const handleCopyAll = async () => {
    try {
      const allNames = names.map(n => n.name).join('\n');
      await navigator.clipboard.writeText(allNames);
      setCopiedIndex(-1); // -1 indicates "all copied"
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  // Generate initial names on mount
  React.useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Fantasy Name Generator</CardTitle>
        <CardDescription>
          Generate culturally appropriate names for your RPG characters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="race">Race</Label>
            <Select
              id="race"
              options={RACE_OPTIONS}
              value={race}
              onChange={(e) => setRace(e.target.value as FantasyRace)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              id="gender"
              options={GENDER_OPTIONS}
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="count">Count</Label>
            <Select
              id="count"
              options={COUNT_OPTIONS}
              value={String(count)}
              onChange={(e) => setCount(parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Race Description */}
        <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
          <span className="text-2xl">{RACE_EMOJIS[race]}</span>
          <div>
            <p className="font-medium capitalize">{race}</p>
            <p className="text-sm text-muted-foreground">{RACE_DESCRIPTIONS[race]}</p>
          </div>
        </div>

        {/* Generate Button */}
        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
          <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating...' : 'Generate Names'}
        </Button>

        {/* Generated Names */}
        {names.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Generated Names</p>
              <Button variant="ghost" size="sm" onClick={handleCopyAll}>
                {copiedIndex === -1 ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied All!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy All
                  </>
                )}
              </Button>
            </div>
            
            <div className="grid gap-2">
              {names.map((name, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-3 group hover:bg-muted transition-colors"
                >
                  <div>
                    <span className="text-lg font-medium">{name.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({name.prefix} + {name.suffix})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(name.name, index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Race Buttons */}
        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Quick Generate by Race</p>
          <div className="flex flex-wrap gap-2">
            {FANTASY_RACES.map(r => (
              <Button
                key={r}
                variant={race === r ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setRace(r);
                  setTimeout(() => {
                    const generated = generateFantasyNames({ race: r, gender, count });
                    setNames(generated);
                  }, 100);
                }}
              >
                {RACE_EMOJIS[r]} {r.charAt(0).toUpperCase() + r.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Names are generated by combining race-specific prefixes and suffixes</li>
            <li>Use &quot;Neutral&quot; gender for non-binary or androgynous names</li>
            <li>Click on a name to copy it to your clipboard</li>
            <li>Generate multiple names to find the perfect fit for your character</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default FantasyNameGenerator;
