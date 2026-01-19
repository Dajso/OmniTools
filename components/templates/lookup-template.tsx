'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

/**
 * Column configuration for the lookup table
 */
export interface ColumnConfig {
  id: string;
  label: string;
  accessor: string | ((item: LookupData) => string | number);
  sortable?: boolean;
  filterable?: boolean;
  filterOptions?: { value: string; label: string }[];
  width?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * Generic lookup data type
 */
export type LookupData = Record<string, unknown>;

/**
 * Props for the LookupTemplate component
 */
export interface LookupTemplateProps {
  /** Tool title */
  title: string;
  /** Tool description */
  description: string;
  /** Data to display */
  data: LookupData[];
  /** Column configurations */
  columns: ColumnConfig[];
  /** Enable search functionality */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Fields to search in */
  searchFields?: string[];
  /** Enable filtering */
  filterable?: boolean;
  /** Render visual for selected item */
  renderVisual?: (selected: LookupData | null) => React.ReactNode;
  /** Callback when item is selected */
  onSelect?: (item: LookupData) => void;
  /** Enable row selection */
  selectable?: boolean;
  /** Additional CSS classes */
  className?: string;
}


/**
 * Get value from data item using accessor
 */
function getValue(item: LookupData, accessor: string | ((item: LookupData) => string | number)): string | number {
  if (typeof accessor === 'function') {
    return accessor(item);
  }
  const value = item[accessor];
  return value !== undefined && value !== null ? String(value) : '';
}

/**
 * Sort direction type
 */
type SortDirection = 'asc' | 'desc' | null;

/**
 * Sort indicator component
 */
function SortIndicator({ direction }: { direction: SortDirection }) {
  if (!direction) return null;
  return (
    <span className="ml-1 text-xs">
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  );
}

/**
 * Lookup Template - A reusable template for searchable and filterable data tables
 * 
 * Features:
 * - Searchable data with configurable search fields
 * - Filterable columns with dropdown filters
 * - Sortable columns
 * - Row selection with visual display
 * - Responsive table layout
 * 
 * @example
 * ```tsx
 * <LookupTemplate
 *   title="Resistor Color Codes"
 *   description="Look up resistor values by color bands"
 *   data={resistorData}
 *   columns={[
 *     { id: 'color', label: 'Color', accessor: 'color' },
 *     { id: 'value', label: 'Value', accessor: 'value', sortable: true },
 *     { id: 'multiplier', label: 'Multiplier', accessor: 'multiplier' },
 *   ]}
 *   searchable
 *   searchPlaceholder="Search colors..."
 *   searchFields={['color']}
 *   selectable
 *   renderVisual={(selected) => selected && <ColorBandDisplay color={selected.color} />}
 * />
 * ```
 */
export function LookupTemplate({
  title,
  description,
  data,
  columns,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchFields,
  filterable = false,
  renderVisual,
  onSelect,
  selectable = false,
  className,
}: LookupTemplateProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState<Record<string, string>>({});
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);
  const [selectedItem, setSelectedItem] = React.useState<LookupData | null>(null);

  // Get filterable columns
  const filterableColumns = columns.filter((col) => col.filterable && col.filterOptions);

  // Filter and search data
  const filteredData = React.useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchable && searchQuery) {
      const query = searchQuery.toLowerCase();
      const fieldsToSearch = searchFields || columns.map((col) => 
        typeof col.accessor === 'string' ? col.accessor : col.id
      );
      
      result = result.filter((item) =>
        fieldsToSearch.some((field) => {
          const value = item[field];
          return value !== undefined && 
                 value !== null && 
                 String(value).toLowerCase().includes(query);
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([columnId, filterValue]) => {
      if (filterValue) {
        const column = columns.find((col) => col.id === columnId);
        if (column) {
          result = result.filter((item) => {
            const value = getValue(item, column.accessor);
            return String(value) === filterValue;
          });
        }
      }
    });

    // Apply sorting
    if (sortColumn && sortDirection) {
      const column = columns.find((col) => col.id === sortColumn);
      if (column) {
        result.sort((a, b) => {
          const aVal = getValue(a, column.accessor);
          const bVal = getValue(b, column.accessor);
          
          let comparison = 0;
          if (typeof aVal === 'number' && typeof bVal === 'number') {
            comparison = aVal - bVal;
          } else {
            comparison = String(aVal).localeCompare(String(bVal));
          }
          
          return sortDirection === 'desc' ? -comparison : comparison;
        });
      }
    }

    return result;
  }, [data, searchQuery, filters, sortColumn, sortDirection, columns, searchable, searchFields]);

  const handleSort = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column?.sortable) return;

    if (sortColumn === columnId) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (columnId: string, value: string) => {
    setFilters((prev) => ({ ...prev, [columnId]: value }));
  };

  const handleRowClick = (item: LookupData) => {
    if (selectable) {
      setSelectedItem(item);
      onSelect?.(item);
    }
  };

  return (
    <Card className={cn('w-full max-w-4xl', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search and filters */}
        <div className="flex flex-wrap gap-4">
          {searchable && (
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="search" className="sr-only">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          )}

          {filterable && filterableColumns.map((column) => (
            <div key={column.id} className="min-w-[150px]">
              <Label htmlFor={`filter-${column.id}`} className="sr-only">
                Filter by {column.label}
              </Label>
              <Select
                id={`filter-${column.id}`}
                options={[
                  { value: '', label: `All ${column.label}` },
                  ...(column.filterOptions || []),
                ]}
                value={filters[column.id] || ''}
                onChange={(e) => handleFilterChange(column.id, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Visual display for selected item */}
        {renderVisual && selectedItem && (
          <div className="border rounded-lg p-4 bg-muted/30">
            {renderVisual(selectedItem)}
          </div>
        )}

        {/* Data table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.id}
                      className={cn(
                        'px-4 py-3 text-sm font-medium text-muted-foreground',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right',
                        column.sortable && 'cursor-pointer hover:text-foreground select-none'
                      )}
                      style={{ width: column.width }}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                      {column.sortable && sortColumn === column.id && (
                        <SortIndicator direction={sortDirection} />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      No results found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr
                      key={index}
                      className={cn(
                        'transition-colors',
                        selectable && 'cursor-pointer hover:bg-muted/50',
                        selectedItem === item && 'bg-primary/10'
                      )}
                      onClick={() => handleRowClick(item)}
                    >
                      {columns.map((column) => (
                        <td
                          key={column.id}
                          className={cn(
                            'px-4 py-3 text-sm',
                            column.align === 'center' && 'text-center',
                            column.align === 'right' && 'text-right'
                          )}
                        >
                          {getValue(item, column.accessor)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-muted-foreground text-center">
          Showing {filteredData.length} of {data.length} items
        </p>
      </CardContent>
    </Card>
  );
}

export default LookupTemplate;
