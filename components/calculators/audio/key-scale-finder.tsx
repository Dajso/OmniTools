'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResultDisplay } from '@/components/ui/result-display';
import {
  findScales,
  findKey,
  getScaleNotes,
  getRelativeMinor,
  getRelativeMajor,
  SCALE_PATTERNS,
  type ScaleMatch,
  type ScaleType,
} from '@/lib/calculations/audio/key-scale-finder';
import { NOTE_NAMES } from '@/lib/calculations/audio/note-frequency';

export function KeyScaleFinder() {
  const [selectedNotes, setSelectedNotes] = React.useState<string[]>([]);
  const [matches, setMatches] = React.useState<ScaleMatch[]>([]);
  const [bestKey, setBestKey] = React.useState<ScaleMatch | null>(null);
  const [showAllScales, setShowAllScales] = React.useState(false);

  React.useEffect(() => {
    if (selectedNotes.length >= 3) {
      const scaleMatches = findScales(selectedNotes, undefined, 70);
      setMatches(scaleMatches.slice(0, showAllScales ? 20 : 5));
      setBestKey(findKey(selectedNotes));
    } else {
      setMatches([]);
      setBestKey(null);
    }
  }, [selectedNotes, showAllScales]);

  const toggleNote = (note: string) => {
    setSelectedNotes(prev => 
      prev.includes(note) 
        ? prev.filter(n => n !== note)
        : [...prev, note]
    );
  };

  const clearNotes = () => {
    setSelectedNotes([]);
  };

  const selectScale = (root: string, scaleType: ScaleType) => {
    const notes = getScaleNotes(root, scaleType);
    setSelectedNotes(notes);
  };

  const getMatchColor = (percentage: number) => {
    if (percentage === 100) return 'bg-green-100 border-green-300';
    if (percentage >= 85) return 'bg-blue-100 border-blue-300';
    return 'bg-muted/50';
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Key/Scale Finder</CardTitle>
        <CardDescription>
          Select notes to find matching keys and scales. Great for identifying the key of a song or finding scales to play over chords.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Note Selection */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Select Notes</p>
            <Button variant="ghost" size="sm" onClick={clearNotes}>
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {NOTE_NAMES.map(note => (
              <Button
                key={note}
                variant={selectedNotes.includes(note) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleNote(note)}
                className="w-12"
              >
                {note}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Selected: {selectedNotes.length > 0 ? selectedNotes.join(', ') : 'None'} 
            {selectedNotes.length < 3 && ' (select at least 3 notes)'}
          </p>
        </div>

        {/* Quick Scale Presets */}
        <div>
          <p className="text-sm font-medium mb-2">Quick Presets</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => selectScale('C', 'major')}>
              C Major
            </Button>
            <Button variant="outline" size="sm" onClick={() => selectScale('A', 'natural-minor')}>
              A Minor
            </Button>
            <Button variant="outline" size="sm" onClick={() => selectScale('G', 'major')}>
              G Major
            </Button>
            <Button variant="outline" size="sm" onClick={() => selectScale('E', 'natural-minor')}>
              E Minor
            </Button>
            <Button variant="outline" size="sm" onClick={() => selectScale('A', 'minor-pentatonic')}>
              A Pentatonic
            </Button>
            <Button variant="outline" size="sm" onClick={() => selectScale('E', 'blues')}>
              E Blues
            </Button>
          </div>
        </div>

        {/* Best Key Match */}
        {bestKey && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Most Likely Key</p>
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-2xl font-bold text-primary">{bestKey.displayName}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Scale notes: {bestKey.scaleNotes.join(' - ')}
                  </p>
                </div>
                <span className="text-lg font-semibold text-primary">
                  {bestKey.matchPercentage}%
                </span>
              </div>
              {bestKey.scaleType === 'major' && (
                <p className="text-sm mt-2">
                  Relative minor: <span className="font-medium">{getRelativeMinor(bestKey.root)} Minor</span>
                </p>
              )}
              {bestKey.scaleType === 'natural-minor' && (
                <p className="text-sm mt-2">
                  Relative major: <span className="font-medium">{getRelativeMajor(bestKey.root)} Major</span>
                </p>
              )}
              {bestKey.notesOutOfScale.length > 0 && (
                <p className="text-sm text-orange-600 mt-2">
                  Notes outside scale: {bestKey.notesOutOfScale.join(', ')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* All Matching Scales */}
        {matches.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-medium">Matching Scales</p>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAllScales(!showAllScales)}
              >
                {showAllScales ? 'Show Less' : 'Show More'}
              </Button>
            </div>
            <div className="space-y-2">
              {matches.map((match, index) => (
                <div 
                  key={`${match.root}-${match.scaleType}`}
                  className={`p-3 rounded-lg border ${getMatchColor(match.matchPercentage)}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{match.displayName}</p>
                      <p className="text-xs text-muted-foreground">
                        {match.scaleNotes.join(' - ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">{match.matchPercentage}%</span>
                      <p className="text-xs text-muted-foreground">
                        {match.matchingNotes}/{match.totalInputNotes} notes
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Matches */}
        {selectedNotes.length >= 3 && matches.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <p>No matching scales found with 70%+ match.</p>
            <p className="text-sm">Try selecting different notes or fewer notes.</p>
          </div>
        )}

        {/* Scale Types Reference */}
        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-2">Available Scale Types</p>
          <div className="flex flex-wrap gap-1 text-xs">
            {Object.keys(SCALE_PATTERNS).map(scale => (
              <span key={scale} className="bg-muted px-2 py-1 rounded">
                {scale.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">How to use:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Click notes to select them (at least 3 needed)</li>
            <li>The finder will show scales that contain your selected notes</li>
            <li>Higher percentage = better match</li>
            <li>Use this to find the key of a song or explore scale options</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default KeyScaleFinder;
