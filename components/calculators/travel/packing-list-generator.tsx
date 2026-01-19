'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  generatePackingList,
  filterByCategory,
  getEssentialItems,
  estimateBagWeight,
  getTripTypes,
  getWeatherOptions,
  getActivities,
  type TripDetails,
  type PackingList,
  type PackingCategory,
  type Activity 
} from '@/lib/calculations/travel/packing-list-generator';
import { 
  Check, 
  Copy, 
  Download, 
  Luggage, 
  Shirt, 
  Footprints,
  Sparkles,
  Laptop,
  FileText,
  Heart,
  Briefcase,
  Star
} from 'lucide-react';

const CATEGORY_ICONS: Record<PackingCategory, React.ReactNode> = {
  clothing: <Shirt className="h-4 w-4" />,
  footwear: <Footprints className="h-4 w-4" />,
  toiletries: <Sparkles className="h-4 w-4" />,
  electronics: <Laptop className="h-4 w-4" />,
  documents: <FileText className="h-4 w-4" />,
  medical: <Heart className="h-4 w-4" />,
  accessories: <Briefcase className="h-4 w-4" />,
  'activity-specific': <Star className="h-4 w-4" />,
};

const CATEGORY_LABELS: Record<PackingCategory, string> = {
  clothing: 'Clothing',
  footwear: 'Footwear',
  toiletries: 'Toiletries',
  electronics: 'Electronics',
  documents: 'Documents',
  medical: 'Medical & Health',
  accessories: 'Accessories',
  'activity-specific': 'Activity Specific',
};

export function PackingListGenerator() {
  const [tripDetails, setTripDetails] = React.useState<TripDetails>({
    duration: 7,
    tripType: 'leisure',
    weather: 'warm',
    activities: [],
    includeToiletries: true,
    includeElectronics: true,
    includeMedical: true,
  });
  const [packingList, setPackingList] = React.useState<PackingList | null>(null);
  const [checkedItems, setCheckedItems] = React.useState<Set<string>>(new Set());
  const [showEssentialsOnly, setShowEssentialsOnly] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();

  const generate = React.useCallback(() => {
    try {
      setError(undefined);
      const list = generatePackingList(tripDetails);
      setPackingList(list);
      setCheckedItems(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation error');
      setPackingList(null);
    }
  }, [tripDetails]);

  const reset = () => {
    setTripDetails({
      duration: 7,
      tripType: 'leisure',
      weather: 'warm',
      activities: [],
      includeToiletries: true,
      includeElectronics: true,
      includeMedical: true,
    });
    setPackingList(null);
    setCheckedItems(new Set());
    setShowEssentialsOnly(false);
    setError(undefined);
  };

  React.useEffect(() => {
    generate();
  }, [generate]);

  const toggleActivity = (activity: Activity) => {
    setTripDetails(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity],
    }));
  };

  const toggleItem = (itemName: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return newSet;
    });
  };

  const copyList = async () => {
    if (!packingList) return;
    
    const items = showEssentialsOnly 
      ? getEssentialItems(packingList) 
      : packingList.items;
    
    const text = items
      .map(item => `${checkedItems.has(item.name) ? '✓' : '☐'} ${item.name} (${item.quantity})`)
      .join('\n');
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Failed to copy to clipboard');
    }
  };

  const downloadList = () => {
    if (!packingList) return;
    
    const items = showEssentialsOnly 
      ? getEssentialItems(packingList) 
      : packingList.items;
    
    let text = `Packing List - ${tripDetails.duration} Day ${tripDetails.tripType} Trip\n`;
    text += `Weather: ${tripDetails.weather}\n`;
    text += `=`.repeat(50) + '\n\n';
    
    packingList.categories.forEach(category => {
      const categoryItems = items.filter(item => item.category === category);
      if (categoryItems.length > 0) {
        text += `${CATEGORY_LABELS[category]}\n`;
        text += `-`.repeat(30) + '\n';
        categoryItems.forEach(item => {
          text += `☐ ${item.name} (${item.quantity})${item.notes ? ` - ${item.notes}` : ''}\n`;
        });
        text += '\n';
      }
    });
    
    text += `\nEstimated bag weight: ${estimateBagWeight(packingList)} kg`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'packing-list.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const displayItems = packingList 
    ? (showEssentialsOnly ? getEssentialItems(packingList) : packingList.items)
    : [];

  const checkedCount = checkedItems.size;
  const totalCount = displayItems.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <CalculatorBase
      title="Packing List Generator"
      description="Generate a customized packing list based on your trip details"
      onReset={reset}
      error={error}
      results={packingList && (
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Packing Progress</span>
              <span>{checkedCount} / {totalCount} items</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={showEssentialsOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowEssentialsOnly(!showEssentialsOnly)}
            >
              {showEssentialsOnly ? 'Show All' : 'Essentials Only'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyList}
            >
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={downloadList}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-muted-foreground">Total Items</p>
              <p className="text-xl font-bold">{packingList.totalItems}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-muted-foreground">Est. Weight</p>
              <p className="text-xl font-bold">{estimateBagWeight(packingList)} kg</p>
            </div>
          </div>

          {/* Items by Category */}
          <div className="space-y-4">
            {packingList.categories.map(category => {
              const categoryItems = displayItems.filter(item => item.category === category);
              if (categoryItems.length === 0) return null;
              
              return (
                <Card key={category} className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {CATEGORY_ICONS[category]}
                    <h3 className="font-medium">{CATEGORY_LABELS[category]}</h3>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {categoryItems.filter(i => checkedItems.has(i.name)).length}/{categoryItems.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {categoryItems.map(item => (
                      <label 
                        key={item.name}
                        className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                          checkedItems.has(item.name) 
                            ? 'bg-green-50 text-green-700 line-through' 
                            : 'hover:bg-muted'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checkedItems.has(item.name)}
                          onChange={() => toggleItem(item.name)}
                          className="rounded"
                        />
                        <span className="flex-1">{item.name}</span>
                        <span className="text-sm text-muted-foreground">×{item.quantity}</span>
                        {item.essential && (
                          <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                            Essential
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        {/* Trip Duration */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="duration">
            Trip Duration: {tripDetails.duration} days
          </label>
          <input
            id="duration"
            type="range"
            min="1"
            max="30"
            value={tripDetails.duration}
            onChange={(e) => setTripDetails(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 day</span>
            <span>30 days</span>
          </div>
        </div>

        {/* Trip Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="trip-type">
            Trip Type
          </label>
          <select
            id="trip-type"
            value={tripDetails.tripType}
            onChange={(e) => setTripDetails(prev => ({ ...prev, tripType: e.target.value as TripDetails['tripType'] }))}
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            {getTripTypes().map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Weather */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="weather">
            Expected Weather
          </label>
          <select
            id="weather"
            value={tripDetails.weather}
            onChange={(e) => setTripDetails(prev => ({ ...prev, weather: e.target.value as TripDetails['weather'] }))}
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            {getWeatherOptions().map(weather => (
              <option key={weather} value={weather}>
                {weather.charAt(0).toUpperCase() + weather.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Activities */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Planned Activities</p>
          <div className="flex flex-wrap gap-2">
            {getActivities().map(activity => (
              <Button
                key={activity}
                type="button"
                variant={tripDetails.activities.includes(activity) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleActivity(activity)}
              >
                {activity.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </Button>
            ))}
          </div>
        </div>

        {/* Include Options */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Include Categories</p>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={tripDetails.includeToiletries}
                onChange={(e) => setTripDetails(prev => ({ ...prev, includeToiletries: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Toiletries</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={tripDetails.includeElectronics}
                onChange={(e) => setTripDetails(prev => ({ ...prev, includeElectronics: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Electronics</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={tripDetails.includeMedical}
                onChange={(e) => setTripDetails(prev => ({ ...prev, includeMedical: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Medical</span>
            </label>
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default PackingListGenerator;
