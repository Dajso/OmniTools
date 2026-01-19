'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface SongSection {
  id: string;
  type: string;
  bars: number;
  color: string;
}

const SECTION_TYPES = [
  { type: 'Intro', color: 'bg-blue-500', textColor: 'text-blue-500' },
  { type: 'Verse', color: 'bg-green-500', textColor: 'text-green-500' },
  { type: 'Pre-Chorus', color: 'bg-yellow-500', textColor: 'text-yellow-500' },
  { type: 'Chorus', color: 'bg-red-500', textColor: 'text-red-500' },
  { type: 'Bridge', color: 'bg-purple-500', textColor: 'text-purple-500' },
  { type: 'Breakdown', color: 'bg-orange-500', textColor: 'text-orange-500' },
  { type: 'Solo', color: 'bg-pink-500', textColor: 'text-pink-500' },
  { type: 'Outro', color: 'bg-gray-500', textColor: 'text-gray-500' },
  { type: 'Drop', color: 'bg-cyan-500', textColor: 'text-cyan-500' },
  { type: 'Build', color: 'bg-amber-500', textColor: 'text-amber-500' },
];

const STRUCTURE_PRESETS = [
  {
    name: 'Pop Standard',
    sections: [
      { type: 'Intro', bars: 4 },
      { type: 'Verse', bars: 8 },
      { type: 'Pre-Chorus', bars: 4 },
      { type: 'Chorus', bars: 8 },
      { type: 'Verse', bars: 8 },
      { type: 'Pre-Chorus', bars: 4 },
      { type: 'Chorus', bars: 8 },
      { type: 'Bridge', bars: 8 },
      { type: 'Chorus', bars: 8 },
      { type: 'Outro', bars: 4 },
    ],
  },
  {
    name: 'EDM Drop',
    sections: [
      { type: 'Intro', bars: 8 },
      { type: 'Build', bars: 8 },
      { type: 'Drop', bars: 16 },
      { type: 'Breakdown', bars: 8 },
      { type: 'Build', bars: 8 },
      { type: 'Drop', bars: 16 },
      { type: 'Outro', bars: 8 },
    ],
  },
  {
    name: 'Rock Classic',
    sections: [
      { type: 'Intro', bars: 4 },
      { type: 'Verse', bars: 16 },
      { type: 'Chorus', bars: 8 },
      { type: 'Verse', bars: 16 },
      { type: 'Chorus', bars: 8 },
      { type: 'Solo', bars: 16 },
      { type: 'Chorus', bars: 8 },
      { type: 'Outro', bars: 8 },
    ],
  },
  {
    name: 'Verse-Chorus Simple',
    sections: [
      { type: 'Verse', bars: 8 },
      { type: 'Chorus', bars: 8 },
      { type: 'Verse', bars: 8 },
      { type: 'Chorus', bars: 8 },
      { type: 'Chorus', bars: 8 },
    ],
  },
];

export function SongStructureBuilder() {
  const [sections, setSections] = React.useState<SongSection[]>([]);
  const [bpm, setBpm] = React.useState<number>(120);
  const [beatsPerBar, setBeatsPerBar] = React.useState<number>(4);
  const [songTitle, setSongTitle] = React.useState<string>('');
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const getSectionColor = (type: string) => {
    return SECTION_TYPES.find(s => s.type === type)?.color || 'bg-gray-500';
  };

  const addSection = (type: string, bars: number = 8) => {
    const newSection: SongSection = {
      id: generateId(),
      type,
      bars,
      color: getSectionColor(type),
    };
    setSections(prev => [...prev, newSection]);
  };

  const removeSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
  };

  const updateSectionBars = (id: string, bars: number) => {
    setSections(prev => prev.map(s => 
      s.id === id ? { ...s, bars } : s
    ));
  };

  const clearAll = () => {
    setSections([]);
  };

  const applyPreset = (preset: typeof STRUCTURE_PRESETS[0]) => {
    const newSections = preset.sections.map(s => ({
      id: generateId(),
      type: s.type,
      bars: s.bars,
      color: getSectionColor(s.type),
    }));
    setSections(newSections);
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSections = [...sections];
    const draggedSection = newSections[draggedIndex];
    newSections.splice(draggedIndex, 1);
    newSections.splice(index, 0, draggedSection);
    setSections(newSections);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Calculations
  const totalBars = sections.reduce((sum, s) => sum + s.bars, 0);
  const totalBeats = totalBars * beatsPerBar;
  const secondsPerBeat = 60 / bpm;
  const totalSeconds = totalBeats * secondsPerBeat;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = Math.floor(totalSeconds % 60);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate section timestamps
  const getSectionTimestamp = (index: number) => {
    let bars = 0;
    for (let i = 0; i < index; i++) {
      bars += sections[i].bars;
    }
    const beats = bars * beatsPerBar;
    const seconds = beats * secondsPerBeat;
    return formatTime(seconds);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Song Structure Builder</CardTitle>
        <CardDescription>
          Plan your song arrangement by adding and arranging sections. Drag to reorder.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Song Info */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="song-title">Song Title</Label>
            <Input
              id="song-title"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              placeholder="Untitled"
            />
          </div>
          <NumberInput
            id="bpm"
            label="BPM"
            value={bpm}
            onChange={setBpm}
            min={40}
            max={300}
            step={1}
          />
          <NumberInput
            id="beats-per-bar"
            label="Beats per Bar"
            value={beatsPerBar}
            onChange={setBeatsPerBar}
            min={2}
            max={12}
            step={1}
          />
        </div>

        {/* Presets */}
        <div>
          <p className="text-sm font-medium mb-2">Structure Presets</p>
          <div className="flex flex-wrap gap-2">
            {STRUCTURE_PRESETS.map(preset => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset)}
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Add Section Buttons */}
        <div>
          <p className="text-sm font-medium mb-2">Add Section</p>
          <div className="flex flex-wrap gap-2">
            {SECTION_TYPES.map(section => (
              <Button
                key={section.type}
                variant="outline"
                size="sm"
                onClick={() => addSection(section.type)}
                className="gap-2"
              >
                <span className={`w-3 h-3 rounded-full ${section.color}`} />
                {section.type}
              </Button>
            ))}
          </div>
        </div>

        {/* Song Structure Timeline */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium">Song Structure</p>
            {sections.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            )}
          </div>

          {sections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No sections added yet.</p>
              <p className="text-sm">Click a section type above to add it to your song.</p>
            </div>
          ) : (
            <>
              {/* Visual Timeline */}
              <div className="flex h-8 rounded-lg overflow-hidden mb-4">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className={`${section.color} flex items-center justify-center text-white text-xs font-medium`}
                    style={{ flex: section.bars }}
                    title={`${section.type} - ${section.bars} bars`}
                  >
                    {section.bars >= 4 && section.type.substring(0, 3)}
                  </div>
                ))}
              </div>

              {/* Section List */}
              <div className="space-y-2">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`
                      flex items-center gap-3 p-2 rounded-lg border bg-muted/30 cursor-move
                      ${draggedIndex === index ? 'opacity-50' : ''}
                    `}
                  >
                    <span className="text-muted-foreground text-sm w-12">
                      {getSectionTimestamp(index)}
                    </span>
                    <span className={`w-4 h-4 rounded-full ${section.color}`} />
                    <span className="font-medium flex-1">{section.type}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateSectionBars(section.id, Math.max(1, section.bars - 4))}
                      >
                        -4
                      </Button>
                      <span className="w-12 text-center text-sm">{section.bars} bars</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateSectionBars(section.id, section.bars + 4)}
                      >
                        +4
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSection(section.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Statistics */}
        {sections.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ResultDisplay
              label="Total Duration"
              value={`${totalMinutes}:${remainingSeconds.toString().padStart(2, '0')}`}
              highlight
            />
            <ResultDisplay
              label="Total Bars"
              value={totalBars}
            />
            <ResultDisplay
              label="Total Beats"
              value={totalBeats}
            />
            <ResultDisplay
              label="Sections"
              value={sections.length}
            />
          </div>
        )}

        {/* Section Summary */}
        {sections.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Section Summary</p>
            <div className="flex flex-wrap gap-2">
              {SECTION_TYPES.map(sectionType => {
                const count = sections.filter(s => s.type === sectionType.type).length;
                const bars = sections.filter(s => s.type === sectionType.type).reduce((sum, s) => sum + s.bars, 0);
                if (count === 0) return null;
                return (
                  <div key={sectionType.type} className="bg-muted/50 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${sectionType.color}`} />
                    <span>{sectionType.type}: {count}× ({bars} bars)</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Drag sections to reorder them</li>
            <li>Use +4/-4 buttons to adjust section length</li>
            <li>Try presets for common song structures</li>
            <li>Most pop songs are 3-4 minutes (around 64-80 bars at 120 BPM)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default SongStructureBuilder;
