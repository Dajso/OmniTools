'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Copy, Check, Download, Wifi, Eye, EyeOff } from 'lucide-react';
import QRCode from 'react-qr-code';
import {
  generateWifiQR,
  validateWifiConfig,
  getSecurityTypeOptions,
  type WifiConfig,
  type WifiSecurityType,
} from '@/lib/calculations/creator/wifi-qr-generator';

const SECURITY_OPTIONS = getSecurityTypeOptions().map(opt => ({
  value: opt.value,
  label: opt.label,
}));

export function WifiQRGenerator() {
  const [ssid, setSsid] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [securityType, setSecurityType] = React.useState<WifiSecurityType>('WPA');
  const [hidden, setHidden] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [qrContent, setQrContent] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [copied, setCopied] = React.useState(false);
  const qrRef = React.useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    const config: WifiConfig = {
      ssid,
      password,
      securityType,
      hidden,
    };

    const validation = validateWifiConfig(config);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setQrContent(null);
      return;
    }

    setErrors([]);
    const result = generateWifiQR(config);
    setQrContent(result.qrContent);
  };

  const handleCopyContent = async () => {
    if (!qrContent) return;
    try {
      await navigator.clipboard.writeText(qrContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `wifi-qr-${ssid || 'network'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const isNoPassword = securityType === 'nopass';

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          QR-kode for wifi
        </CardTitle>
        <CardDescription>
          Lag en QR-kode som gjør det enkelt å dele wifi-nettverket
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Network Configuration */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ssid">Nettverksnavn (SSID) *</Label>
            <Input
              id="ssid"
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              placeholder="Mitt wifi-nettverk"
              maxLength={32}
            />
            <p className="text-xs text-muted-foreground">
              {ssid.length}/32 tegn
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="securityType">Sikkerhetstype</Label>
            <Select
              id="securityType"
              options={SECURITY_OPTIONS}
              value={securityType}
              onChange={(e) => setSecurityType(e.target.value as WifiSecurityType)}
            />
          </div>

          {!isNoPassword && (
            <div className="space-y-2">
              <Label htmlFor="password">Passord *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Skriv inn wifi-passordet"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Skjul passordet' : 'Vis passordet'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {securityType === 'WPA' && (
                <p className="text-xs text-muted-foreground">
                  WPA-passord må ha 8–63 tegn
                </p>
              )}
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hidden}
              onChange={(e) => setHidden(e.target.checked)}
              className="h-4 w-4 rounded"
            />
            <span className="text-sm">Skjult nettverk (SSID kringkastes ikke)</span>
          </label>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md">
            <ul className="list-disc list-inside text-sm space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Generate Button */}
        <Button onClick={handleGenerate} className="w-full">
          Lag QR-kode
        </Button>

        {/* QR Code Display */}
        {qrContent && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Din wifi-QR-kode</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyContent}>
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? 'Kopiert!' : 'Kopier'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-1" />
                  Last ned
                </Button>
              </div>
            </div>

            <div 
              ref={qrRef}
              className="flex justify-center p-6 bg-white rounded-lg border"
            >
              <QRCode
                value={qrContent}
                size={200}
                level="M"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">Nettverksdetaljer:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Nettverk:</span>
                <span className="font-mono">{ssid}</span>
                <span className="text-muted-foreground">Sikkerhet:</span>
                <span>{securityType === 'nopass' ? 'Åpent' : securityType}</span>
                {hidden && (
                  <>
                    <span className="text-muted-foreground">Skjult:</span>
                    <span>Ja</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-2">Slik bruker du den:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Skriv inn navn og passord for wifi-nettverket</li>
            <li>Trykk på «Lag QR-kode»</li>
            <li>Skriv ut QR-koden eller vis den på skjerm</li>
            <li>Gjester kan skanne den med mobilkameraet for å koble til</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}

export default WifiQRGenerator;
