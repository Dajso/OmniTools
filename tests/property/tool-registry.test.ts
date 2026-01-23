/**
 * Property Test: Tool Registry Completeness
 * Feature: english-tools-website, Property 5: Tool Registry Completeness
 * 
 * *For any* tool defined in the requirements (all 100 tools), the tool registry 
 * SHALL contain an entry with valid id, slug, name, description, category, 
 * keywords array, and path.
 * 
 * **Validates: Requirements 1.6**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  toolRegistry,
  getAllTools,
  getToolCount,
  getToolsByCategory,
  ToolDefinition,
  ToolCategory
} from '@/lib/constants';

describe('Tool Registry Completeness - Property 5', () => {
  // Property: The registry should contain at least 100 tools (expanded from original 100)
  it('should contain at least 100 tools', () => {
    expect(getToolCount()).toBeGreaterThanOrEqual(100);
  });

  // Property: For all tools in the registry, each tool has required fields
  it('should have valid required fields for all tools', () => {
    const tools = getAllTools();

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: tools.length - 1 }),
        (index) => {
          const tool = tools[index];

          // Check id is non-empty string
          expect(typeof tool.id).toBe('string');
          expect(tool.id.length).toBeGreaterThan(0);

          // Check slug is non-empty string
          expect(typeof tool.slug).toBe('string');
          expect(tool.slug.length).toBeGreaterThan(0);

          // Check name is non-empty string
          expect(typeof tool.name).toBe('string');
          expect(tool.name.length).toBeGreaterThan(0);

          // Check description is non-empty string
          expect(typeof tool.description).toBe('string');
          expect(tool.description.length).toBeGreaterThan(0);

          // Check category is valid
          const validCategories: ToolCategory[] = [
            'finance', 'health', 'home', 'converter', 'productivity',
            // New expanded categories (Requirements 15-32)
            'academic', 'travel', 'gaming', 'creator', 'fun',
            'audio', 'rpg', 'crypto', 'photo', 'crafts',
            'garden', 'electronics', 'betting', 'auto', 'stats',
            'time', 'physics', 'construction', 'coffee'
          ];
          expect(validCategories).toContain(tool.category);

          // Check keywords is non-empty array
          expect(Array.isArray(tool.keywords)).toBe(true);
          expect(tool.keywords.length).toBeGreaterThan(0);

          // Check path is non-empty string starting with /
          expect(typeof tool.path).toBe('string');
          expect(tool.path.startsWith('/')).toBe(true);

          // Check icon is non-empty string
          expect(typeof tool.icon).toBe('string');
          expect(tool.icon.length).toBeGreaterThan(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: Tool IDs should be unique
  it('should have unique tool IDs', () => {
    const tools = getAllTools();
    const ids = tools.map(t => t.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
  });

  // Property: Tool slugs should be unique
  it('should have unique tool slugs', () => {
    const tools = getAllTools();
    const slugs = tools.map(t => t.slug);
    const uniqueSlugs = new Set(slugs);

    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  // Property: Tool paths should be unique
  it('should have unique tool paths', () => {
    const tools = getAllTools();
    const paths = tools.map(t => t.path);
    const uniquePaths = new Set(paths);

    expect(uniquePaths.size).toBe(paths.length);
  });

  // Property: Core categories should have at least their minimum expected tools
  it('should have correct distribution of tools by category', () => {
    const financeTools = getToolsByCategory('finance');
    const healthTools = getToolsByCategory('health');
    const homeTools = getToolsByCategory('home');
    const productivityTools = getToolsByCategory('productivity');

    // Core categories should have at least 20 tools each
    expect(financeTools.length).toBeGreaterThanOrEqual(20);
    expect(healthTools.length).toBeGreaterThanOrEqual(20);
    expect(homeTools.length).toBeGreaterThanOrEqual(20);
    expect(productivityTools.length).toBeGreaterThanOrEqual(20);

    // Total tools should be at least 100 (original requirement)
    const allTools = getAllTools();
    expect(allTools.length).toBeGreaterThanOrEqual(100);
  });

  // Property: For all tools, keywords should all be non-empty strings
  it('should have valid keywords for all tools', () => {
    const tools = getAllTools();

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: tools.length - 1 }),
        (index) => {
          const tool = tools[index];

          for (const keyword of tool.keywords) {
            expect(typeof keyword).toBe('string');
            expect(keyword.length).toBeGreaterThan(0);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: Related tools should reference existing tools
  it('should have valid related tool references', () => {
    const tools = getAllTools();
    const toolIds = new Set(tools.map(t => t.id));

    for (const tool of tools) {
      if (tool.relatedTools) {
        for (const relatedId of tool.relatedTools) {
          expect(toolIds.has(relatedId)).toBe(true);
        }
      }
    }
  });
});
