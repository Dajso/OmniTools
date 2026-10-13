'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toolRegistry, ToolDefinition } from '@/lib/constants/tool-registry';
import { getToolIcon } from '@/lib/constants/tool-icons';
import { getCategoryConfig } from '@/lib/constants/category-config';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Get all tools as array
  const allTools = useMemo(() => Object.values(toolRegistry), []);

  // Filter tools based on query
  const filteredTools = useMemo(() => {
    if (!query.trim()) return allTools.slice(0, 8);
    
    const lowerQuery = query.toLowerCase();
    return allTools
      .filter(tool => 
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery) ||
        tool.keywords.some(k => k.toLowerCase().includes(lowerQuery))
      )
      .slice(0, 8);
  }, [query, allTools]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(true);
      }
      // Close with Escape
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const handleSelect = useCallback((tool: ToolDefinition) => {
    router.push(tool.path);
    onOpenChange(false);
  }, [router, onOpenChange]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div className="fixed left-1/2 top-[15%] -translate-x-1/2 w-full max-w-md z-50 px-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center border-b px-3">
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Input
              type="text"
              placeholder="Søk i verktøy …"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 text-sm py-2.5 h-10"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="flex-shrink-0 h-7 w-7 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Lukk</span>
            </Button>
          </div>

          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto p-1.5">
            {filteredTools.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Fant ingen verktøy for «{query}»
              </div>
            ) : (
              <div className="space-y-0.5">
                {filteredTools.map((tool) => {
                  const Icon = getToolIcon(tool.id);
                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleSelect(tool)}
                      className="w-full flex items-center gap-2.5 p-2 rounded-md hover:bg-muted text-left transition-colors"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 flex-shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{tool.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {tool.description}
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">
                        {getCategoryConfig(tool.category)?.name ?? tool.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-3 py-1.5 text-[10px] text-muted-foreground flex items-center justify-between">
            <span>{allTools.length} verktøy</span>
            <span className="hidden sm:inline">
              <kbd className="px-1 py-0.5 bg-muted rounded font-mono">ESC</kbd> for å lukke
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
