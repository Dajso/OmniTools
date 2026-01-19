'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Copy, Download, RefreshCw, Check } from 'lucide-react';

/**
 * Configuration for a generator option
 */
export interface GeneratorOption {
  id: string;
  label: string;
  type: 'select' | 'number' | 'checkbox' | 'text';
  options?: { value: string; label: string }[];
  defaultValue?: string | number | boolean;
  min?: number;
  max?: number;
  placeholder?: string;
}

/**
 * Generated content structure
 */
export interface GeneratedContent {
  text?: string;
  items?: string[];
  structured?: Record<string, unknown>;
}

/**
 * Export format types
 */
export type ExportFormat = 'pdf' | 'image' | 'text' | 'json';

/**
 * Props for the GeneratorTemplate component
 */
export interface GeneratorTemplateProps {
  /** Generator title */
  title: string;
  /** Generator description */
  description: string;
  /** Generator options/configuration */
  options: GeneratorOption[];
  /** Generation function */
  generate: (config: Record<string, string | number | boolean>) => GeneratedContent;
  /** Custom content renderer */
  renderContent?: (content: GeneratedContent) => React.ReactNode;
  /** Enable copy to clipboard */
  allowCopy?: boolean;
  /** Enable export functionality */
  allowExport?: ExportFormat;
  /** Additional CSS classes */
  className?: string;
}


/**
 * Renders a single option field based on its configuration
 */
function OptionField({
  config,
  value,
  onChange,
}: {
  config: GeneratorOption;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
}) {
  const inputId = `option-${config.id}`;

  if (config.type === 'checkbox') {
    return (
      <div className="flex items-center space-x-2">
        <input
          id={inputId}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
        />
        <Label htmlFor={inputId}>{config.label}</Label>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>{config.label}</Label>
      
      {config.type === 'select' && config.options ? (
        <Select
          id={inputId}
          options={config.options}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : config.type === 'number' ? (
        <Input
          id={inputId}
          type="number"
          value={value as number}
          onChange={(e) => onChange(e.target.valueAsNumber || 0)}
          min={config.min}
          max={config.max}
          placeholder={config.placeholder}
        />
      ) : (
        <Input
          id={inputId}
          type="text"
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={config.placeholder}
        />
      )}
    </div>
  );
}

/**
 * Default content renderer
 */
function DefaultContentRenderer({ content }: { content: GeneratedContent }) {
  if (content.text) {
    return (
      <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap break-all">
        {content.text}
      </div>
    );
  }

  if (content.items && content.items.length > 0) {
    return (
      <ul className="space-y-2">
        {content.items.map((item, index) => (
          <li
            key={index}
            className="bg-muted/50 rounded-lg p-3 text-sm"
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (content.structured) {
    return (
      <pre className="bg-muted/50 rounded-lg p-4 text-sm overflow-auto">
        {JSON.stringify(content.structured, null, 2)}
      </pre>
    );
  }

  return null;
}


/**
 * Generator Template - A reusable template for content generation tools
 * 
 * Features:
 * - Dynamic option field generation
 * - Copy to clipboard functionality
 * - Export to various formats (text, JSON, PDF, image)
 * - Custom content rendering support
 * - Generate and regenerate functionality
 * 
 * @example
 * ```tsx
 * <GeneratorTemplate
 *   title="Password Generator"
 *   description="Generate secure random passwords"
 *   options={[
 *     { id: 'length', label: 'Length', type: 'number', defaultValue: 16, min: 8, max: 128 },
 *     { id: 'includeSymbols', label: 'Include Symbols', type: 'checkbox', defaultValue: true },
 *   ]}
 *   generate={(config) => ({ text: generatePassword(config) })}
 *   allowCopy
 *   allowExport="text"
 * />
 * ```
 */
export function GeneratorTemplate({
  title,
  description,
  options,
  generate,
  renderContent,
  allowCopy = true,
  allowExport,
  className,
}: GeneratorTemplateProps) {
  // Initialize state with default values from option configs
  const getInitialConfig = React.useCallback(() => {
    const initial: Record<string, string | number | boolean> = {};
    options.forEach((option) => {
      if (option.defaultValue !== undefined) {
        initial[option.id] = option.defaultValue;
      } else if (option.type === 'number') {
        initial[option.id] = 0;
      } else if (option.type === 'checkbox') {
        initial[option.id] = false;
      } else {
        initial[option.id] = '';
      }
    });
    return initial;
  }, [options]);

  const [config, setConfig] = React.useState<Record<string, string | number | boolean>>(getInitialConfig);
  const [content, setContent] = React.useState<GeneratedContent | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleConfigChange = (id: string, value: string | number | boolean) => {
    setConfig((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setError(null);
    setCopied(false);
    
    try {
      const generatedContent = generate(config);
      setContent(generatedContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
      setContent(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!content) return;

    let textToCopy = '';
    if (content.text) {
      textToCopy = content.text;
    } else if (content.items) {
      textToCopy = content.items.join('\n');
    } else if (content.structured) {
      textToCopy = JSON.stringify(content.structured, null, 2);
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Failed to copy to clipboard');
    }
  };

  const handleExport = () => {
    if (!content || !allowExport) return;

    let data = '';
    let mimeType = 'text/plain';
    let extension = 'txt';

    if (allowExport === 'json') {
      data = JSON.stringify(content.structured || { text: content.text, items: content.items }, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    } else if (allowExport === 'text') {
      if (content.text) {
        data = content.text;
      } else if (content.items) {
        data = content.items.join('\n');
      }
    }

    // Create and trigger download
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const ContentRenderer = renderContent || DefaultContentRenderer;

  return (
    <Card className={cn('w-full max-w-2xl', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Option fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          {options.map((option) => (
            <OptionField
              key={option.id}
              config={option}
              value={config[option.id]}
              onChange={(value) => handleConfigChange(option.id, value)}
            />
          ))}
        </div>

        {/* Error display */}
        {error && (
          <div 
            className="text-sm text-destructive bg-destructive/10 p-3 rounded-md"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        {/* Generated content */}
        {content && (
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">Generated Content</p>
              <div className="flex gap-2">
                {allowCopy && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                )}
                {allowExport && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExport}
                    className="h-8"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                )}
              </div>
            </div>
            <ContentRenderer content={content} />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button onClick={handleGenerate} loading={isGenerating}>
          {content ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </>
          ) : (
            'Generate'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default GeneratorTemplate;
