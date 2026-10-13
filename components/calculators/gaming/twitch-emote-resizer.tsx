'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResultDisplay } from '@/components/ui/result-display';
import { Upload, Download, Image as ImageIcon } from 'lucide-react';

interface EmoteSize {
  name: string;
  width: number;
  height: number;
  description: string;
}

const TWITCH_EMOTE_SIZES: EmoteSize[] = [
  { name: '1x', width: 28, height: 28, description: 'Liten (chat)' },
  { name: '2x', width: 56, height: 56, description: 'Middels' },
  { name: '3x', width: 112, height: 112, description: 'Stor (emote-velger)' },
];

const BTTV_EMOTE_SIZES: EmoteSize[] = [
  { name: '1x', width: 28, height: 28, description: 'Liten' },
  { name: '2x', width: 56, height: 56, description: 'Middels' },
  { name: '3x', width: 112, height: 112, description: 'Stor' },
];

const FFZ_EMOTE_SIZES: EmoteSize[] = [
  { name: '1x', width: 32, height: 32, description: 'Liten' },
  { name: '2x', width: 64, height: 64, description: 'Middels' },
  { name: '4x', width: 128, height: 128, description: 'Stor' },
];

type Platform = 'twitch' | 'bttv' | 'ffz';

export function TwitchEmoteResizer() {
  const [platform, setPlatform] = React.useState<Platform>('twitch');
  const [originalImage, setOriginalImage] = React.useState<string | null>(null);
  const [originalSize, setOriginalSize] = React.useState<{ width: number; height: number } | null>(null);
  const [resizedImages, setResizedImages] = React.useState<Map<string, string>>(new Map());
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const sizes = platform === 'twitch' ? TWITCH_EMOTE_SIZES : platform === 'bttv' ? BTTV_EMOTE_SIZES : FFZ_EMOTE_SIZES;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Velg en bildefil');
      return;
    }

    // Validate file size (max 1MB for emotes)
    if (file.size > 1024 * 1024) {
      setError('Filen må være mindre enn 1 MB');
      return;
    }

    setError(undefined);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(e.target?.result as string);
        setOriginalSize({ width: img.width, height: img.height });
        resizeImage(img);
      };
      img.onerror = () => {
        setError('Kunne ikke laste inn bildet');
        setIsProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const resizeImage = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newResizedImages = new Map<string, string>();

    sizes.forEach((size) => {
      canvas.width = size.width;
      canvas.height = size.height;

      // Clear canvas
      ctx.clearRect(0, 0, size.width, size.height);

      // Calculate scaling to maintain aspect ratio
      const scale = Math.min(size.width / img.width, size.height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (size.width - scaledWidth) / 2;
      const y = (size.height - scaledHeight) / 2;

      // Enable image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw image
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

      // Get data URL
      const dataUrl = canvas.toDataURL('image/png');
      newResizedImages.set(size.name, dataUrl);
    });

    setResizedImages(newResizedImages);
    setIsProcessing(false);
  };

  const downloadImage = (sizeName: string) => {
    const dataUrl = resizedImages.get(sizeName);
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `emote_${sizeName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    sizes.forEach((size) => {
      setTimeout(() => downloadImage(size.name), 100 * sizes.indexOf(size));
    });
  };

  const reset = () => {
    setOriginalImage(null);
    setOriginalSize(null);
    setResizedImages(new Map());
    setError(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Størrelse på Twitch-emotes</CardTitle>
        <CardDescription>
          Endre størrelsen på bilder til standard emote-størrelser for Twitch, BTTV og FFZ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Platform Selection */}
        <div className="flex gap-2">
          <Button
            variant={platform === 'twitch' ? 'default' : 'outline'}
            onClick={() => setPlatform('twitch')}
            className="flex-1"
          >
            Twitch
          </Button>
          <Button
            variant={platform === 'bttv' ? 'default' : 'outline'}
            onClick={() => setPlatform('bttv')}
            className="flex-1"
          >
            BTTV
          </Button>
          <Button
            variant={platform === 'ffz' ? 'default' : 'outline'}
            onClick={() => setPlatform('ffz')}
            className="flex-1"
          >
            FFZ
          </Button>
        </div>

        {/* Size Requirements */}
        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">{platform.toUpperCase()} Emote-størrelser</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {sizes.map((size) => (
              <div key={size.name} className="text-center">
                <p className="font-mono">{size.width}×{size.height}</p>
                <p className="text-muted-foreground">{size.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="emote-upload"
          />
          <label
            htmlFor="emote-upload"
            className={`
              flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg
              cursor-pointer transition-colors
              ${originalImage ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
            `}
          >
            {originalImage ? (
              <div className="flex items-center gap-4">
                <img
                  src={originalImage}
                  alt="Original"
                  className="max-h-32 max-w-32 object-contain"
                />
                <div className="text-sm">
                  <p className="font-medium">Originalbilde</p>
                  {originalSize && (
                    <p className="text-muted-foreground">
                      {originalSize.width} × {originalSize.height}
                    </p>
                  )}
                  <p className="text-primary text-xs mt-1">Klikk for å bytte</p>
                </div>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Klikk for å laste opp, eller dra og slipp
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF opptil 1 MB
                </p>
              </>
            )}
          </label>
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Behandler …</p>
          </div>
        )}

        {/* Resized Images */}
        {resizedImages.size > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Emotes med ny størrelse</p>
              <Button onClick={downloadAll} size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Last ned alle
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {sizes.map((size) => {
                const dataUrl = resizedImages.get(size.name);
                return (
                  <div key={size.name} className="text-center space-y-2">
                    <div 
                      className="bg-muted rounded-lg p-4 flex items-center justify-center"
                      style={{ minHeight: 120 }}
                    >
                      {dataUrl ? (
                        <img
                          src={dataUrl}
                          alt={`Emote ${size.name}`}
                          style={{ width: size.width, height: size.height }}
                          className="pixelated"
                        />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{size.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {size.width}×{size.height}
                      </p>
                    </div>
                    <Button
                      onClick={() => downloadImage(size.name)}
                      size="sm"
                      variant="outline"
                      className="w-full"
                      disabled={!dataUrl}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Last ned
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reset Button */}
        {originalImage && (
          <Button onClick={reset} variant="outline" className="w-full">
            Last opp nytt bilde
          </Button>
        )}

        {/* Instructions */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">Tips for best resultat:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Bruk kvadratiske bilder for best resultat</li>
            <li>Start med et bilde i høy oppløsning</li>
            <li>PNG med gjennomsiktighet fungerer best</li>
            <li>Hold designet enkelt for små størrelser</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default TwitchEmoteResizer;
