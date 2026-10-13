'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Download, RefreshCw, PenTool } from 'lucide-react';

const FONT_STYLES = [
  { value: 'cursive1', label: 'Elegant skrift' },
  { value: 'cursive2', label: 'Flytende skrift' },
  { value: 'cursive3', label: 'Klassisk signatur' },
  { value: 'cursive4', label: 'Moderne skrift' },
  { value: 'cursive5', label: 'Kraftig skrift' },
];

const COLORS = [
  { value: '#000000', label: 'Svart' },
  { value: '#1a365d', label: 'Marineblå' },
  { value: '#2d3748', label: 'Mørkegrå' },
  { value: '#744210', label: 'Brun' },
  { value: '#1e40af', label: 'Kongeblå' },
  { value: '#7c3aed', label: 'Lilla' },
];

const FONT_FAMILIES: Record<string, string> = {
  cursive1: "'Brush Script MT', cursive",
  cursive2: "'Lucida Handwriting', cursive",
  cursive3: "'Segoe Script', cursive",
  cursive4: "'Comic Sans MS', cursive",
  cursive5: "'Papyrus', fantasy",
};

// SVG path generators for different signature styles
function generateSignaturePath(name: string, style: string): string {
  const baseY = 60;
  const charWidth = 25;
  const startX = 20;
  
  let path = `M ${startX} ${baseY}`;
  
  // Generate a flowing path based on the name
  for (let i = 0; i < name.length; i++) {
    const x = startX + (i + 1) * charWidth;
    const char = name[i].toLowerCase();
    
    // Add variation based on character
    const yOffset = (char.charCodeAt(0) % 10) - 5;
    const controlY = baseY + yOffset * 2;
    
    if (style === 'cursive1' || style === 'cursive3') {
      // Smooth curves
      path += ` Q ${x - charWidth/2} ${controlY - 15}, ${x} ${baseY + yOffset}`;
    } else if (style === 'cursive2' || style === 'cursive4') {
      // More dramatic curves
      path += ` C ${x - charWidth} ${controlY - 20}, ${x - charWidth/3} ${controlY + 10}, ${x} ${baseY + yOffset}`;
    } else {
      // Bold strokes
      path += ` L ${x - charWidth/2} ${controlY - 10} L ${x} ${baseY + yOffset}`;
    }
  }
  
  // Add a flourish at the end
  const endX = startX + name.length * charWidth + 30;
  path += ` Q ${endX - 20} ${baseY - 20}, ${endX} ${baseY + 10}`;
  
  return path;
}

export function SignatureGenerator() {
  const [name, setName] = React.useState('Ola Nordmann');
  const [style, setStyle] = React.useState('cursive1');
  const [color, setColor] = React.useState('#000000');
  const [strokeWidth, setStrokeWidth] = React.useState(2);
  const [key, setKey] = React.useState(0);
  const svgRef = React.useRef<SVGSVGElement>(null);

  const handleRegenerate = () => {
    setKey(prev => prev + 1);
  };

  const handleDownloadSVG = () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `signature-${name.replace(/\s+/g, '-').toLowerCase()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx?.scale(2, 2);
      ctx?.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `signature-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const svgWidth = Math.max(400, name.length * 30 + 100);
  const signaturePath = generateSignaturePath(name, style);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool className="h-5 w-5" />
          Signaturgenerator
        </CardTitle>
        <CardDescription>
          Lag signaturer i håndskriftstil til dokumenter og e-post
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Navnet ditt</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Skriv inn navnet ditt"
              maxLength={30}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">Signaturstil</Label>
            <Select
              id="style"
              options={FONT_STYLES}
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Blekkfarge</Label>
            <Select
              id="color"
              options={COLORS}
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="strokeWidth">Strektykkelse</Label>
            <input
              id="strokeWidth"
              type="range"
              min={1}
              max={5}
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Tynn</span>
              <span>Tykk</span>
            </div>
          </div>
        </div>

        {/* Signature Preview */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Forhåndsvisning</h3>
            <Button variant="outline" size="sm" onClick={handleRegenerate}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Lag på nytt
            </Button>
          </div>

          <div className="border rounded-lg p-6 bg-white flex justify-center">
            <svg
              ref={svgRef}
              key={key}
              width={svgWidth}
              height="120"
              viewBox={`0 0 ${svgWidth} 120`}
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background */}
              <rect width="100%" height="100%" fill="transparent" />
              
              {/* Signature line (optional) */}
              <line
                x1="20"
                y1="90"
                x2={svgWidth - 20}
                y2="90"
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
              
              {/* Signature path */}
              <path
                d={signaturePath}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Text fallback for better appearance */}
              <text
                x={svgWidth / 2}
                y="65"
                textAnchor="middle"
                fill={color}
                fontFamily={FONT_FAMILIES[style]}
                fontSize="36"
                style={{ fontStyle: 'italic' }}
              >
                {name}
              </text>
            </svg>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleDownloadSVG} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Last ned SVG
          </Button>
          <Button onClick={handleDownloadPNG} variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Last ned PNG
          </Button>
        </div>

        {/* Tips */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md space-y-2">
          <p className="font-medium">Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>SVG passer best til dokumenter og skalering</li>
            <li>PNG passer godt til e-post og nett</li>
            <li>Prøv ulike stiler til du finner en som passer deg</li>
            <li>Bruk en mørkere farge til formelle dokumenter</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default SignatureGenerator;
