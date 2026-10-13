/**
 * JSON Formatter/Validator
 * 
 * @module lib/calculations/productivity/json-formatter
 * @see Requirements 9.19
 */

export interface JSONFormatterInputs {
  json: string;
  indentSize: number;
  sortKeys: boolean;
}

export interface JSONFormatterResults {
  formatted: string;
  minified: string;
  isValid: boolean;
  error: string | null;
  stats: {
    keys: number;
    values: number;
    depth: number;
    size: number;
    minifiedSize: number;
  };
}

function countKeysAndValues(obj: unknown, depth = 0): { keys: number; values: number; maxDepth: number } {
  let keys = 0;
  let values = 0;
  let maxDepth = depth;
  
  if (Array.isArray(obj)) {
    values += obj.length;
    for (const item of obj) {
      const result = countKeysAndValues(item, depth + 1);
      keys += result.keys;
      values += result.values;
      maxDepth = Math.max(maxDepth, result.maxDepth);
    }
  } else if (obj !== null && typeof obj === 'object') {
    const entries = Object.entries(obj);
    keys += entries.length;
    for (const [, value] of entries) {
      const result = countKeysAndValues(value, depth + 1);
      keys += result.keys;
      values += result.values;
      maxDepth = Math.max(maxDepth, result.maxDepth);
    }
  } else {
    values++;
  }
  
  return { keys, values, maxDepth };
}

function sortObjectKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  if (obj !== null && typeof obj === 'object') {
    const sorted: Record<string, unknown> = {};
    const keys = Object.keys(obj as Record<string, unknown>).sort();
    for (const key of keys) {
      sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return obj;
}

export function formatJSON(inputs: JSONFormatterInputs): JSONFormatterResults {
  const { json, indentSize, sortKeys } = inputs;
  
  if (!json.trim()) {
    return {
      formatted: '',
      minified: '',
      isValid: false,
      error: 'Ingen inndata',
      stats: { keys: 0, values: 0, depth: 0, size: 0, minifiedSize: 0 },
    };
  }

  try {
    let parsed = JSON.parse(json);
    
    if (sortKeys) {
      parsed = sortObjectKeys(parsed);
    }
    
    const formatted = JSON.stringify(parsed, null, indentSize);
    const minified = JSON.stringify(parsed);
    
    const { keys, values, maxDepth } = countKeysAndValues(parsed);
    
    return {
      formatted,
      minified,
      isValid: true,
      error: null,
      stats: {
        keys,
        values,
        depth: maxDepth,
        size: formatted.length,
        minifiedSize: minified.length,
      },
    };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Ugyldig JSON';
    return {
      formatted: json,
      minified: json,
      isValid: false,
      error,
      stats: { keys: 0, values: 0, depth: 0, size: json.length, minifiedSize: json.length },
    };
  }
}

export function validateJSON(json: string): { isValid: boolean; error: string | null } {
  try {
    JSON.parse(json);
    return { isValid: true, error: null };
  } catch (e) {
    return { isValid: false, error: e instanceof Error ? e.message : 'Ugyldig JSON' };
  }
}
