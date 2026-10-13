'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { SerializableUnit, UnitCategory } from '@/lib/constants/types';
import { convert, generateFormula } from '@/lib/conversions';
import { getUnit } from '@/lib/constants/units';
import Link from 'next/link';
import { ArrowRightLeft, Copy, Check, ChevronRight } from 'lucide-react';

export interface ConversionLink {
  from: string;
  to: string;
  fromName: string;
  toName: string;
  href: string;
}

export interface ConverterBaseProps {
  fromUnit: SerializableUnit;
  toUnit: SerializableUnit;
  category: UnitCategory;
  relatedConversions?: ConversionLink[];
  className?: string;
  presetValues?: number[];
}

/**
 * Format a number for display with appropriate precision
 */
function formatDisplayValue(value: number): string {
  if (!Number.isFinite(value)) return '0';
  if (value === 0) return '0';
  
  const absValue = Math.abs(value);
  
  if (absValue < 0.0001 || absValue >= 1000000000) {
    return value.toExponential(6);
  }
  
  if (absValue >= 1000) {
    return value.toLocaleString('nb-NO', { maximumFractionDigits: 2 });
  }
  if (absValue >= 1) {
    return value.toLocaleString('nb-NO', { maximumFractionDigits: 4 });
  }
  return value.toLocaleString('nb-NO', { maximumFractionDigits: 6 });
}

export function ConverterBase({
  fromUnit,
  toUnit,
  category,
  relatedConversions = [],
  className,
  presetValues = [1, 10, 100, 1000],
}: ConverterBaseProps) {
  const [fromValue, setFromValue] = React.useState<string>('1');
  const [toValue, setToValue] = React.useState<string>(() => {
    const result = convert(1, fromUnit.id, toUnit.id, category);
    return formatDisplayValue(result);
  });
  const [swapped, setSwapped] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  
  const currentFromUnit = swapped ? toUnit : fromUnit;
  const currentToUnit = swapped ? fromUnit : toUnit;
  
  const fullFromUnit = getUnit(category, currentFromUnit.id);
  const fullToUnit = getUnit(category, currentToUnit.id);
  
  const formula = React.useMemo(() => {
    if (fullFromUnit && fullToUnit) {
      return generateFormula(fullFromUnit, fullToUnit, category);
    }
    return `1 ${currentFromUnit.symbol} = ? ${currentToUnit.symbol}`;
  }, [fullFromUnit, fullToUnit, currentFromUnit.symbol, currentToUnit.symbol, category]);

  const handleFromChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setFromValue(inputValue);
    
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      try {
        const converted = convert(numValue, currentFromUnit.id, currentToUnit.id, category);
        setToValue(formatDisplayValue(converted));
      } catch {
        setToValue('0');
      }
    } else {
      setToValue('0');
    }
  }, [currentFromUnit.id, currentToUnit.id, category]);

  const handleToChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setToValue(inputValue);
    
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      try {
        const converted = convert(numValue, currentToUnit.id, currentFromUnit.id, category);
        setFromValue(formatDisplayValue(converted));
      } catch {
        setFromValue('0');
      }
    } else {
      setFromValue('0');
    }
  }, [currentFromUnit.id, currentToUnit.id, category]);

  const handleSwap = React.useCallback(() => {
    setSwapped(prev => !prev);
    const tempFrom = fromValue;
    setFromValue(toValue);
    setToValue(tempFrom);
  }, [fromValue, toValue]);

  const handlePresetClick = React.useCallback((value: number) => {
    setFromValue(value.toString());
    try {
      const converted = convert(value, currentFromUnit.id, currentToUnit.id, category);
      setToValue(formatDisplayValue(converted));
    } catch {
      setToValue('0');
    }
  }, [currentFromUnit.id, currentToUnit.id, category]);

  const handleCopyResult = React.useCallback(async () => {
    const resultText = `${fromValue} ${currentFromUnit.symbol} = ${toValue} ${currentToUnit.symbol}`;
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = resultText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [fromValue, toValue, currentFromUnit.symbol, currentToUnit.symbol]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Main Converter Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Conversion Input Area */}
          <div className="grid md:grid-cols-[1fr,auto,1fr] divide-y md:divide-y-0 md:divide-x">
            {/* From Input */}
            <div className="p-6 space-y-3">
              <Label htmlFor="from-value" className="text-sm font-medium text-muted-foreground">
                From
              </Label>
              <div className="relative">
                <Input
                  id="from-value"
                  type="text"
                  inputMode="decimal"
                  value={fromValue}
                  onChange={handleFromChange}
                  className="text-2xl h-14 pr-16 font-semibold"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  {currentFromUnit.symbol}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{currentFromUnit.name}</p>
            </div>
            
            {/* Swap Button */}
            <div className="flex items-center justify-center p-4 bg-muted/30">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSwap}
                className="rounded-full h-12 w-12 bg-background shadow-sm hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="Swap units"
              >
                <ArrowRightLeft className="h-5 w-5" />
              </Button>
            </div>
            
            {/* To Input */}
            <div className="p-6 space-y-3">
              <Label htmlFor="to-value" className="text-sm font-medium text-muted-foreground">
                To
              </Label>
              <div className="relative">
                <Input
                  id="to-value"
                  type="text"
                  inputMode="decimal"
                  value={toValue}
                  onChange={handleToChange}
                  className="text-2xl h-14 pr-16 font-semibold"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  {currentToUnit.symbol}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{currentToUnit.name}</p>
            </div>
          </div>

          {/* Result Banner */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-6 border-t">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-1">Result</p>
                <p className="text-xl md:text-2xl font-bold truncate">
                  {fromValue} {currentFromUnit.symbol} = {toValue} {currentToUnit.symbol}
                </p>
              </div>
              <Button
                type="button"
                variant={copied ? "default" : "outline"}
                size="sm"
                onClick={handleCopyResult}
                className={cn(
                  "shrink-0 transition-all",
                  copied && "bg-green-600 hover:bg-green-600"
                )}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Convert */}
      {presetValues.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">Quick Convert</p>
            <div className="flex flex-wrap gap-2">
              {presetValues.map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePresetClick(value)}
                  className="font-mono"
                >
                  {value.toLocaleString('nb-NO')} {currentFromUnit.symbol}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formula Card */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-medium text-muted-foreground mb-2">Conversion Formula</p>
          <p className="font-mono text-lg bg-muted px-4 py-3 rounded-lg">{formula}</p>
        </CardContent>
      </Card>

      {/* Related Conversions */}
      {relatedConversions.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">Related Conversions</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {relatedConversions.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 hover:border-primary/50 transition-colors group"
                >
                  <span className="text-sm font-medium">
                    {link.fromName} → {link.toName}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
