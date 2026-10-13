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
  clothing: 'Klær',
  footwear: 'Sko',
  toiletries: 'Toalettsaker',
  electronics: 'Elektronikk',
  documents: 'Dokumenter',
  medical: 'Helse og medisin',
  accessories: 'Tilbehør',
  'activity-specific': 'Til aktivitetene',
};

const TRIP_TYPE_LABELS: Record<TripDetails['tripType'], string> = {
  business: 'Jobbreise',
  leisure: 'Ferie',
  adventure: 'Friluftsliv og eventyr',
  beach: 'Strandferie',
  city: 'Byferie',
  winter: 'Vinterferie',
};

const WEATHER_LABELS: Record<TripDetails['weather'], string> = {
  hot: 'Het',
  warm: 'Varmt',
  mild: 'Mildt',
  cold: 'Kaldt',
  rainy: 'Regn',
  mixed: 'Skiftende',
};

const ACTIVITY_LABELS: Record<Activity, string> = {
  hiking: 'Fotturer',
  swimming: 'Bading',
  skiing: 'Ski',
  'formal-events': 'Fest og middag',
  sightseeing: 'Sightseeing',
  photography: 'Fotografering',
};

export function PackingListGenerator() {
  const [tripDetails, setTripDetails] = React.useState<TripDetails>({
    duration: 7,
    tripType: 'leisure',
    weather: 'mixed',
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
      setError(err instanceof Error ? err.message : 'Kunne ikke lage listen');
      setPackingList(null);
    }
  }, [tripDetails]);

  const reset = () => {
    setTripDetails({
      duration: 7,
      tripType: 'leisure',
      weather: 'mixed',
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
      setError('Kunne ikke kopiere til utklippstavlen');
    }
  };

  const downloadList = () => {
    if (!packingList) return;
    
    const items = showEssentialsOnly 
      ? getEssentialItems(packingList) 
      : packingList.items;
    
    let text = `Pakkeliste – ${tripDetails.duration} dager, ${TRIP_TYPE_LABELS[tripDetails.tripType].toLowerCase()}\n`;
    text += `Vær: ${WEATHER_LABELS[tripDetails.weather].toLowerCase()}\n`;
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
    
    text += `\nAnslått vekt på bagasjen: ${estimateBagWeight(packingList)} kg`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pakkeliste.txt';
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
      title="Pakkeliste"
      description="Lag en pakkeliste som passer reisen din, ut fra varighet, vær og aktiviteter"
      onReset={reset}
      error={error}
      results={packingList && (
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Fremdrift i pakkingen</span>
              <span>{checkedCount} / {totalCount} ting</span>
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
              {showEssentialsOnly ? 'Vis alt' : 'Bare det viktigste'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyList}
            >
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              {copied ? 'Kopiert!' : 'Kopier'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={downloadList}
            >
              <Download className="h-4 w-4 mr-1" />
              Last ned
            </Button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-muted-foreground">Antall ting</p>
              <p className="text-xl font-bold">{packingList.totalItems}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-muted-foreground">Anslått vekt</p>
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
                            Viktig
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
            Reisens lengde: {tripDetails.duration} {tripDetails.duration === 1 ? 'dag' : 'dager'}
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
            <span>1 dag</span>
            <span>30 dager</span>
          </div>
        </div>

        {/* Trip Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="trip-type">
            Type reise
          </label>
          <select
            id="trip-type"
            value={tripDetails.tripType}
            onChange={(e) => setTripDetails(prev => ({ ...prev, tripType: e.target.value as TripDetails['tripType'] }))}
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            {getTripTypes().map(type => (
              <option key={type} value={type}>
                {TRIP_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>

        {/* Weather */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="weather">
            Forventet vær
          </label>
          <select
            id="weather"
            value={tripDetails.weather}
            onChange={(e) => setTripDetails(prev => ({ ...prev, weather: e.target.value as TripDetails['weather'] }))}
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            {getWeatherOptions().map(weather => (
              <option key={weather} value={weather}>
                {WEATHER_LABELS[weather]}
              </option>
            ))}
          </select>
        </div>

        {/* Activities */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Planlagte aktiviteter</p>
          <div className="flex flex-wrap gap-2">
            {getActivities().map(activity => (
              <Button
                key={activity}
                type="button"
                variant={tripDetails.activities.includes(activity) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleActivity(activity)}
              >
                {ACTIVITY_LABELS[activity]}
              </Button>
            ))}
          </div>
        </div>

        {/* Include Options */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Ta med</p>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={tripDetails.includeToiletries}
                onChange={(e) => setTripDetails(prev => ({ ...prev, includeToiletries: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Toalettsaker</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={tripDetails.includeElectronics}
                onChange={(e) => setTripDetails(prev => ({ ...prev, includeElectronics: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Elektronikk</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={tripDetails.includeMedical}
                onChange={(e) => setTripDetails(prev => ({ ...prev, includeMedical: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Medisin og førstehjelp</span>
            </label>
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default PackingListGenerator;
