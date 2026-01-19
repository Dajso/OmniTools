'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { Button } from '@/components/ui/button';
import { ResultDisplay } from '@/components/ui/result-display';
import { Label } from '@/components/ui/label';

const SEAM_ALLOWANCES = [
  { value: 0.25, label: '1/4" (6.35mm)', description: 'Standard quilting seam' },
  { value: 0.375, label: '3/8" (9.5mm)', description: 'Common garment seam' },
  { value: 0.5, label: '1/2" (12.7mm)', description: 'Standard garment seam' },
  { value: 0.625, label: '5/8" (15.9mm)', description: 'Pattern standard seam' },
];

export function QuarterInchSeamTester() {
  const [selectedSeam, setSelectedSeam] = React.useState(0.25);
  const [isPrinting, setIsPrinting] = React.useState(false);
  const printRef = React.useRef<HTMLDivElement>(null);

  const selectedSeamInfo = SEAM_ALLOWANCES.find(s => s.value === selectedSeam);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  // Convert inches to pixels (96 DPI standard for web)
  const inchesToPx = (inches: number) => inches * 96;

  return (
    <CalculatorBase
      title="Quarter Inch Seam Tester"
      description="Test and calibrate your sewing machine's seam allowance with a printable guide"
      formula="Print at 100% scale for accurate measurements"
      formulaExplanation="Ensure your printer is set to 'Actual Size' or '100%' scale"
      results={
        <div className="space-y-4">
          <ResultDisplay
            label="Selected Seam Allowance"
            value={selectedSeamInfo?.label || ''}
            highlight
          />
          <ResultDisplay
            label="Description"
            value={selectedSeamInfo?.description || ''}
          />
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">How to Use</p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Print the guide at 100% scale (no scaling)</li>
              <li>Verify the 1-inch test square measures exactly 1 inch</li>
              <li>Place fabric edge along the seam guide line</li>
              <li>Sew along the needle line</li>
              <li>Measure your seam to verify accuracy</li>
            </ol>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Seam Allowance</Label>
          <div className="grid grid-cols-2 gap-2">
            {SEAM_ALLOWANCES.map((seam) => (
              <button
                key={seam.value}
                onClick={() => setSelectedSeam(seam.value)}
                className={`p-3 text-left rounded-lg border transition-colors ${
                  selectedSeam === seam.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <p className="font-medium text-sm">{seam.label}</p>
                <p className="text-xs text-muted-foreground">{seam.description}</p>
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handlePrint} className="w-full" disabled={isPrinting}>
          {isPrinting ? 'Preparing...' : 'Print Seam Guide'}
        </Button>
      </div>

      {/* Printable Guide - Hidden on screen, visible when printing */}
      <div 
        ref={printRef}
        className="hidden print:block print:fixed print:inset-0 print:bg-white print:p-8"
        style={{ pageBreakAfter: 'always' }}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Seam Allowance Test Guide</h1>
          <p className="text-gray-600">Selected: {selectedSeamInfo?.label} - {selectedSeamInfo?.description}</p>
        </div>

        {/* Calibration Square */}
        <div className="mb-8">
          <p className="text-sm mb-2 font-medium">Step 1: Verify Print Scale</p>
          <p className="text-xs text-gray-600 mb-2">This square should measure exactly 1 inch × 1 inch</p>
          <div 
            className="border-2 border-black"
            style={{ 
              width: `${inchesToPx(1)}px`, 
              height: `${inchesToPx(1)}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span className="text-xs">1" × 1"</span>
          </div>
        </div>

        {/* Seam Guide */}
        <div className="mb-8">
          <p className="text-sm mb-2 font-medium">Step 2: Seam Allowance Guide</p>
          <p className="text-xs text-gray-600 mb-4">
            Align fabric edge with the solid line. Sew along the dashed needle line.
          </p>
          
          <svg 
            width={inchesToPx(6)} 
            height={inchesToPx(3)}
            className="border border-gray-300"
          >
            {/* Background grid */}
            {Array.from({ length: 25 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={inchesToPx(i * 0.25)}
                y1={0}
                x2={inchesToPx(i * 0.25)}
                y2={inchesToPx(3)}
                stroke="#e5e5e5"
                strokeWidth={i % 4 === 0 ? 1 : 0.5}
              />
            ))}
            {Array.from({ length: 13 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1={0}
                y1={inchesToPx(i * 0.25)}
                x2={inchesToPx(6)}
                y2={inchesToPx(i * 0.25)}
                stroke="#e5e5e5"
                strokeWidth={i % 4 === 0 ? 1 : 0.5}
              />
            ))}

            {/* Fabric edge line (solid) */}
            <line
              x1={inchesToPx(0.5)}
              y1={0}
              x2={inchesToPx(0.5)}
              y2={inchesToPx(3)}
              stroke="black"
              strokeWidth={2}
            />
            <text x={inchesToPx(0.55)} y={inchesToPx(0.3)} fontSize="10" fill="black">
              Fabric Edge
            </text>

            {/* Needle line (dashed) */}
            <line
              x1={inchesToPx(0.5 + selectedSeam)}
              y1={0}
              x2={inchesToPx(0.5 + selectedSeam)}
              y2={inchesToPx(3)}
              stroke="black"
              strokeWidth={2}
              strokeDasharray="8,4"
            />
            <text x={inchesToPx(0.5 + selectedSeam + 0.05)} y={inchesToPx(0.3)} fontSize="10" fill="black">
              Needle Line ({selectedSeamInfo?.label})
            </text>

            {/* Seam allowance measurement */}
            <line
              x1={inchesToPx(0.5)}
              y1={inchesToPx(2.5)}
              x2={inchesToPx(0.5 + selectedSeam)}
              y2={inchesToPx(2.5)}
              stroke="black"
              strokeWidth={1}
            />
            <line
              x1={inchesToPx(0.5)}
              y1={inchesToPx(2.4)}
              x2={inchesToPx(0.5)}
              y2={inchesToPx(2.6)}
              stroke="black"
              strokeWidth={1}
            />
            <line
              x1={inchesToPx(0.5 + selectedSeam)}
              y1={inchesToPx(2.4)}
              x2={inchesToPx(0.5 + selectedSeam)}
              y2={inchesToPx(2.6)}
              stroke="black"
              strokeWidth={1}
            />
            <text 
              x={inchesToPx(0.5 + selectedSeam / 2)} 
              y={inchesToPx(2.75)} 
              fontSize="10" 
              fill="black"
              textAnchor="middle"
            >
              {selectedSeamInfo?.label}
            </text>

            {/* Ruler markings */}
            {Array.from({ length: 7 }).map((_, i) => (
              <React.Fragment key={`ruler-${i}`}>
                <line
                  x1={inchesToPx(i)}
                  y1={inchesToPx(2.85)}
                  x2={inchesToPx(i)}
                  y2={inchesToPx(3)}
                  stroke="black"
                  strokeWidth={1}
                />
                <text x={inchesToPx(i)} y={inchesToPx(2.8)} fontSize="8" fill="black" textAnchor="middle">
                  {i}"
                </text>
              </React.Fragment>
            ))}
          </svg>
        </div>

        {/* Multiple test strips */}
        <div>
          <p className="text-sm mb-2 font-medium">Step 3: Practice Strips</p>
          <p className="text-xs text-gray-600 mb-4">
            Cut along the solid lines to create test strips. Practice sewing along the dashed lines.
          </p>
          
          <svg 
            width={inchesToPx(6)} 
            height={inchesToPx(4)}
            className="border border-gray-300"
          >
            {/* Three test strips */}
            {[0, 1.25, 2.5].map((yOffset, stripIndex) => (
              <React.Fragment key={`strip-${stripIndex}`}>
                {/* Cut line (solid) */}
                <line
                  x1={0}
                  y1={inchesToPx(yOffset + 0.25)}
                  x2={inchesToPx(6)}
                  y2={inchesToPx(yOffset + 0.25)}
                  stroke="black"
                  strokeWidth={1}
                />
                {/* Sew line (dashed) */}
                <line
                  x1={0}
                  y1={inchesToPx(yOffset + 0.25 + selectedSeam)}
                  x2={inchesToPx(6)}
                  y2={inchesToPx(yOffset + 0.25 + selectedSeam)}
                  stroke="black"
                  strokeWidth={1}
                  strokeDasharray="4,2"
                />
                {/* Label */}
                <text x={inchesToPx(0.1)} y={inchesToPx(yOffset + 0.5)} fontSize="8" fill="gray">
                  Strip {stripIndex + 1}: Sew {selectedSeamInfo?.label} from edge
                </text>
              </React.Fragment>
            ))}
          </svg>
        </div>

        <div className="mt-8 text-xs text-gray-500 text-center">
          <p>Generated by OmniTools Seam Tester</p>
          <p>Print at 100% scale for accurate measurements</p>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block,
          .print\\:block * {
            visibility: visible;
          }
          .print\\:fixed {
            position: fixed;
          }
          .print\\:inset-0 {
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
          }
          @page {
            size: letter;
            margin: 0.5in;
          }
        }
      `}</style>
    </CalculatorBase>
  );
}

export default QuarterInchSeamTester;
