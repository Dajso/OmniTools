'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Copy, Check, RefreshCw, Building2 } from 'lucide-react';

const INDUSTRIES = [
  { value: 'tech', label: 'Technology' },
  { value: 'creative', label: 'Creative/Design' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'retail', label: 'Retail/E-commerce' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'general', label: 'General' },
];

const STYLES = [
  { value: 'modern', label: 'Modern & Trendy' },
  { value: 'professional', label: 'Professional' },
  { value: 'creative', label: 'Creative & Fun' },
  { value: 'classic', label: 'Classic & Traditional' },
];

const PREFIXES: Record<string, string[]> = {
  tech: ['Cyber', 'Tech', 'Digital', 'Cloud', 'Data', 'Net', 'Code', 'Pixel', 'Byte', 'Logic'],
  creative: ['Artisan', 'Creative', 'Design', 'Studio', 'Craft', 'Vision', 'Canvas', 'Palette', 'Muse', 'Spark'],
  consulting: ['Prime', 'Elite', 'Strategic', 'Global', 'Summit', 'Apex', 'Pinnacle', 'Vanguard', 'Catalyst', 'Nexus'],
  retail: ['Shop', 'Market', 'Store', 'Boutique', 'Emporium', 'Bazaar', 'Mart', 'Hub', 'Corner', 'Place'],
  food: ['Fresh', 'Tasty', 'Savory', 'Golden', 'Sweet', 'Harvest', 'Kitchen', 'Bistro', 'Gourmet', 'Artisan'],
  health: ['Vital', 'Pure', 'Wellness', 'Life', 'Zen', 'Balance', 'Harmony', 'Thrive', 'Glow', 'Radiant'],
  finance: ['Capital', 'Wealth', 'Trust', 'Secure', 'Premier', 'Sterling', 'Equity', 'Asset', 'Fortune', 'Legacy'],
  education: ['Academy', 'Learning', 'Scholar', 'Bright', 'Mind', 'Knowledge', 'Wisdom', 'Mentor', 'Insight', 'Quest'],
  general: ['Nova', 'Apex', 'Prime', 'Core', 'Edge', 'Peak', 'Rise', 'Spark', 'Flux', 'Sync'],
};

const SUFFIXES: Record<string, string[]> = {
  modern: ['Labs', 'Hub', 'HQ', 'Co', 'io', 'ly', 'ify', 'Stack', 'Base', 'Works'],
  professional: ['Group', 'Partners', 'Associates', 'Solutions', 'Services', 'Consulting', 'Advisors', 'International', 'Global', 'Corp'],
  creative: ['Studio', 'Collective', 'Workshop', 'House', 'Space', 'Lab', 'Den', 'Nest', 'Hive', 'Forge'],
  classic: ['& Co', '& Sons', 'Brothers', 'Industries', 'Enterprises', 'Company', 'Limited', 'Inc', 'LLC', 'Trust'],
};

const CONNECTORS = ['', ' ', '&', 'and', '+'];

function generateBusinessNames(
  keyword: string,
  industry: string,
  style: string,
  count: number
): string[] {
  const names: Set<string> = new Set();
  const prefixes = PREFIXES[industry] || PREFIXES.general;
  const suffixes = SUFFIXES[style] || SUFFIXES.modern;
  
  // Generate various combinations
  while (names.size < count) {
    const random = Math.random();
    
    if (random < 0.25 && keyword) {
      // Keyword + Suffix
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const capitalizedKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase();
      names.add(`${capitalizedKeyword} ${suffix}`);
    } else if (random < 0.5) {
      // Prefix + Keyword
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      if (keyword) {
        const capitalizedKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase();
        names.add(`${prefix}${capitalizedKeyword}`);
      } else {
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        names.add(`${prefix} ${suffix}`);
      }
    } else if (random < 0.75) {
      // Prefix + Suffix
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      names.add(`${prefix}${suffix}`);
    } else {
      // Two Prefixes combined
      const prefix1 = prefixes[Math.floor(Math.random() * prefixes.length)];
      const prefix2 = prefixes[Math.floor(Math.random() * prefixes.length)];
      if (prefix1 !== prefix2) {
        const connector = CONNECTORS[Math.floor(Math.random() * CONNECTORS.length)];
        names.add(`${prefix1}${connector}${prefix2}`);
      }
    }
    
    // Prevent infinite loop
    if (names.size >= Math.min(count, 50)) break;
  }
  
  return Array.from(names).slice(0, count);
}

export function BusinessNameGenerator() {
  const [keyword, setKeyword] = React.useState('');
  const [industry, setIndustry] = React.useState('general');
  const [style, setStyle] = React.useState('modern');
  const [count, setCount] = React.useState(10);
  const [names, setNames] = React.useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());

  const handleGenerate = () => {
    const generated = generateBusinessNames(keyword, industry, style, count);
    setNames(generated);
    setCopiedIndex(null);
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

  const toggleFavorite = (name: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(name)) {
        newFavorites.delete(name);
      } else {
        newFavorites.add(name);
      }
      return newFavorites;
    });
  };

  // Generate initial names on mount
  React.useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Business Name Generator
        </CardTitle>
        <CardDescription>
          Generate creative business name ideas for your startup or company
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="keyword">Keyword (Optional)</Label>
            <Input
              id="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., cloud, green, swift"
              maxLength={20}
            />
            <p className="text-xs text-muted-foreground">
              Enter a word to include in generated names
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select
              id="industry"
              options={INDUSTRIES}
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">Name Style</Label>
            <Select
              id="style"
              options={STYLES}
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            />
          </div>
        </div>

        {/* Generate Button */}
        <Button onClick={handleGenerate} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate Names
        </Button>

        {/* Generated Names */}
        {names.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Generated Names</h3>
              <span className="text-sm text-muted-foreground">
                {favorites.size} favorited
              </span>
            </div>

            <div className="grid gap-2">
              {names.map((name, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 group transition-colors ${
                    favorites.has(name) ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  <span className="font-medium">{name}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(name)}
                      className={`h-8 w-8 p-0 ${favorites.has(name) ? 'text-yellow-500' : 'opacity-0 group-hover:opacity-100'}`}
                    >
                      {favorites.has(name) ? '★' : '☆'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(name, index)}
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copiedIndex === index ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favorites Section */}
        {favorites.size > 0 && (
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Your Favorites</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(favorites).map((name, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md space-y-2">
          <p className="font-medium">Tips for choosing a business name:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Check domain availability for your favorite names</li>
            <li>Search trademark databases to avoid conflicts</li>
            <li>Consider how the name sounds when spoken</li>
            <li>Make sure it&apos;s easy to spell and remember</li>
            <li>Test the name with potential customers</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default BusinessNameGenerator;
