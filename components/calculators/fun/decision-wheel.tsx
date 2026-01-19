'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Color palette for wheel segments
 */
const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8B500', '#00CED1', '#FF69B4', '#32CD32', '#FF7F50',
];

interface WheelSegment {
  id: string;
  text: string;
  color: string;
}

/**
 * Decision Maker Wheel Component
 * 
 * An interactive spinning wheel for making random decisions.
 * 
 * Features:
 * - Customizable options
 * - Smooth spin animation
 * - Random selection
 * - Visual feedback
 * 
 * @see Requirements 19.8
 */
export function DecisionWheel() {
  const [options, setOptions] = React.useState<string[]>(['Option 1', 'Option 2', 'Option 3']);
  const [newOption, setNewOption] = React.useState('');
  const [isSpinning, setIsSpinning] = React.useState(false);
  const [rotation, setRotation] = React.useState(0);
  const [result, setResult] = React.useState<string | null>(null);
  const [showResult, setShowResult] = React.useState(false);

  const segments: WheelSegment[] = options.map((text, index) => ({
    id: `segment-${index}`,
    text,
    color: COLORS[index % COLORS.length],
  }));

  const addOption = () => {
    if (newOption.trim() && options.length < 15) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const spin = () => {
    if (isSpinning || options.length < 2) return;

    setIsSpinning(true);
    setShowResult(false);
    setResult(null);

    // Random number of full rotations (5-10) plus random final position
    const fullRotations = 5 + Math.random() * 5;
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + (fullRotations * 360) + randomAngle;

    setRotation(totalRotation);

    // Calculate which segment the pointer lands on
    setTimeout(() => {
      const normalizedAngle = (360 - (totalRotation % 360) + 90) % 360;
      const segmentAngle = 360 / options.length;
      const selectedIndex = Math.floor(normalizedAngle / segmentAngle) % options.length;
      
      setResult(options[selectedIndex]);
      setShowResult(true);
      setIsSpinning(false);
    }, 4000);
  };

  const reset = () => {
    setRotation(0);
    setResult(null);
    setShowResult(false);
  };

  // Generate SVG path for a wheel segment
  const getSegmentPath = (index: number, total: number, radius: number) => {
    const angle = 360 / total;
    const startAngle = index * angle - 90;
    const endAngle = startAngle + angle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = radius + radius * Math.cos(startRad);
    const y1 = radius + radius * Math.sin(startRad);
    const x2 = radius + radius * Math.cos(endRad);
    const y2 = radius + radius * Math.sin(endRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    return `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  // Get text position for a segment
  const getTextPosition = (index: number, total: number, radius: number) => {
    const angle = 360 / total;
    const midAngle = index * angle + angle / 2 - 90;
    const rad = (midAngle * Math.PI) / 180;
    const textRadius = radius * 0.65;
    
    return {
      x: radius + textRadius * Math.cos(rad),
      y: radius + textRadius * Math.sin(rad),
      rotation: midAngle + 90,
    };
  };

  const wheelSize = 300;
  const radius = wheelSize / 2;

  return (
    <div className="space-y-6">
      {/* Wheel container */}
      <div className="flex flex-col items-center">
        {/* Pointer */}
        <div className="relative z-10 -mb-4">
          <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-primary" />
        </div>
        
        {/* Wheel */}
        <div className="relative">
          <svg
            width={wheelSize}
            height={wheelSize}
            className="drop-shadow-lg"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            }}
          >
            {/* Segments */}
            {segments.map((segment, index) => {
              const textPos = getTextPosition(index, segments.length, radius);
              return (
                <g key={segment.id}>
                  <path
                    d={getSegmentPath(index, segments.length, radius)}
                    fill={segment.color}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    fill="#fff"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textPos.rotation}, ${textPos.x}, ${textPos.y})`}
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                  >
                    {segment.text.length > 12 ? segment.text.slice(0, 12) + '...' : segment.text}
                  </text>
                </g>
              );
            })}
            {/* Center circle */}
            <circle cx={radius} cy={radius} r="20" fill="#fff" stroke="#ddd" strokeWidth="2" />
          </svg>
        </div>

        {/* Spin button */}
        <Button
          onClick={spin}
          disabled={isSpinning || options.length < 2}
          size="lg"
          className="mt-6 px-8"
        >
          {isSpinning ? '🎰 Spinning...' : '🎯 Spin the Wheel!'}
        </Button>
      </div>

      {/* Result display */}
      {showResult && result && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6 rounded-lg text-center animate-in fade-in zoom-in duration-300">
          <p className="text-sm text-green-600 mb-2">🎉 The wheel has spoken!</p>
          <p className="text-2xl font-bold text-green-700">{result}</p>
          <Button variant="outline" size="sm" onClick={reset} className="mt-4">
            Spin Again
          </Button>
        </div>
      )}

      {/* Options management */}
      <div className="bg-muted/30 p-4 rounded-lg space-y-4">
        <h3 className="font-medium">Customize Your Options</h3>
        
        {/* Add new option */}
        <div className="flex gap-2">
          <Input
            placeholder="Add an option..."
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addOption()}
            maxLength={30}
          />
          <Button onClick={addOption} disabled={!newOption.trim() || options.length >= 15}>
            Add
          </Button>
        </div>
        
        {/* Current options */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Current options ({options.length}/15):
          </Label>
          <div className="flex flex-wrap gap-2">
            {options.map((option, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                style={{ backgroundColor: COLORS[index % COLORS.length] + '30' }}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{option}</span>
                {options.length > 2 && (
                  <button
                    onClick={() => removeOption(index)}
                    className="ml-1 text-muted-foreground hover:text-destructive"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Preset options */}
        <div className="pt-2 border-t">
          <Label className="text-sm text-muted-foreground mb-2 block">Quick presets:</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOptions(['Yes', 'No'])}
            >
              Yes/No
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOptions(['Pizza', 'Burger', 'Sushi', 'Tacos', 'Salad'])}
            >
              Food
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOptions(['Movie', 'Game Night', 'Go Out', 'Stay In', 'Exercise'])}
            >
              Activities
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOptions(['1', '2', '3', '4', '5', '6'])}
            >
              Numbers
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DecisionWheel;
