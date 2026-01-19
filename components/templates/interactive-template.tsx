'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';

/**
 * Interaction event data
 */
export interface InteractionEvent {
  type: string;
  timestamp: number;
  data?: Record<string, unknown>;
  position?: { x: number; y: number };
}

/**
 * Interaction result data
 */
export interface InteractionResult {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

/**
 * Props for the InteractiveTemplate component
 */
export interface InteractiveTemplateProps {
  /** Tool title */
  title: string;
  /** Tool description */
  description: string;
  /** Render the interactive area */
  renderInteractive: (props: {
    onInteraction: (event: InteractionEvent) => void;
    interactions: InteractionEvent[];
    isActive: boolean;
  }) => React.ReactNode;
  /** Process interactions and return results */
  processInteractions?: (interactions: InteractionEvent[]) => InteractionResult[];
  /** Show results panel */
  showResults?: boolean;
  /** Custom results renderer */
  renderResults?: (results: InteractionResult[]) => React.ReactNode;
  /** Instructions text */
  instructions?: string;
  /** Allow reset */
  allowReset?: boolean;
  /** Callback when interactions change */
  onInteractionsChange?: (interactions: InteractionEvent[]) => void;
  /** Additional CSS classes */
  className?: string;
}


/**
 * Default results renderer
 */
function DefaultResultsRenderer({ results }: { results: InteractionResult[] }) {
  if (results.length === 0) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {results.map((result, index) => (
        <div
          key={index}
          className={cn(
            'rounded-lg p-3',
            result.highlight ? 'bg-primary/10' : 'bg-muted/50'
          )}
        >
          <p className="text-xs text-muted-foreground">{result.label}</p>
          <p className={cn('text-lg font-semibold', result.highlight && 'text-primary')}>
            {result.value}
            {result.unit && (
              <span className="text-sm font-normal text-muted-foreground ml-1">
                {result.unit}
              </span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * Interactive Template - A reusable template for tools with real-time visual feedback
 * 
 * Features:
 * - Custom interactive area rendering
 * - Interaction event tracking
 * - Real-time results processing
 * - Reset functionality
 * - Flexible results display
 * 
 * @example
 * ```tsx
 * <InteractiveTemplate
 *   title="Reaction Time Test"
 *   description="Test your reaction speed"
 *   instructions="Click the target as fast as you can when it appears"
 *   renderInteractive={({ onInteraction, isActive }) => (
 *     <ReactionTarget onHit={(time) => onInteraction({ type: 'hit', timestamp: time })} />
 *   )}
 *   processInteractions={(interactions) => [
 *     { label: 'Average Time', value: calculateAverage(interactions), unit: 'ms', highlight: true }
 *   ]}
 *   showResults
 *   allowReset
 * />
 * ```
 */
export function InteractiveTemplate({
  title,
  description,
  renderInteractive,
  processInteractions,
  showResults = true,
  renderResults,
  instructions,
  allowReset = true,
  onInteractionsChange,
  className,
}: InteractiveTemplateProps) {
  const [interactions, setInteractions] = React.useState<InteractionEvent[]>([]);
  const [isActive, setIsActive] = React.useState(true);
  const [results, setResults] = React.useState<InteractionResult[]>([]);

  // Process interactions when they change
  React.useEffect(() => {
    if (processInteractions && interactions.length > 0) {
      const newResults = processInteractions(interactions);
      setResults(newResults);
    }
    onInteractionsChange?.(interactions);
  }, [interactions, processInteractions, onInteractionsChange]);

  const handleInteraction = React.useCallback((event: InteractionEvent) => {
    setInteractions((prev) => [...prev, event]);
  }, []);

  const handleReset = () => {
    setInteractions([]);
    setResults([]);
    setIsActive(true);
  };

  const handleStart = () => {
    setIsActive(true);
  };

  const handleStop = () => {
    setIsActive(false);
  };

  const ResultsRenderer = renderResults 
    ? ({ results }: { results: InteractionResult[] }) => <>{renderResults(results)}</>
    : DefaultResultsRenderer;

  return (
    <Card className={cn('w-full max-w-2xl', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Instructions */}
        {instructions && (
          <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
            {instructions}
          </div>
        )}

        {/* Interactive area */}
        <div className="relative min-h-[200px] border rounded-lg overflow-hidden">
          {renderInteractive({
            onInteraction: handleInteraction,
            interactions,
            isActive,
          })}
        </div>

        {/* Results section */}
        {showResults && results.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">Results</p>
            <ResultsRenderer results={results} />
          </div>
        )}

        {/* Interaction count */}
        {interactions.length > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            {interactions.length} interaction{interactions.length !== 1 ? 's' : ''} recorded
          </p>
        )}
      </CardContent>

      <CardFooter className="flex justify-center gap-2">
        {!isActive ? (
          <Button onClick={handleStart}>
            Start
          </Button>
        ) : (
          <Button variant="outline" onClick={handleStop}>
            Stop
          </Button>
        )}
        
        {allowReset && (
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default InteractiveTemplate;
