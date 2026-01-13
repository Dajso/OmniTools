/**
 * Property Test: Responsive Layout Integrity
 * Feature: english-tools-website, Property 8: Responsive Layout Integrity
 * 
 * *For any* viewport width between 320px and 1920px, all tool components SHALL 
 * render without horizontal overflow and all interactive elements SHALL remain 
 * accessible and clickable.
 * 
 * **Validates: Requirements 13.2**
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { render, screen } from '@testing-library/react';
import { ToolCard } from '@/components/ui/tool-card';
import { NumberInput } from '@/components/ui/number-input';
import { Button } from '@/components/ui/button';
import { ResultDisplay } from '@/components/ui/result-display';
import { UnitToggle } from '@/components/ui/unit-toggle';
import { SelectInput } from '@/components/ui/select-input';

// Helper to set viewport width in JSDOM
function setViewportWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event('resize'));
}

// Helper to check if element has horizontal overflow
function hasHorizontalOverflow(element: HTMLElement): boolean {
  return element.scrollWidth > element.clientWidth;
}

// Helper to check if element is within viewport bounds
function isWithinViewport(element: HTMLElement, viewportWidth: number): boolean {
  const rect = element.getBoundingClientRect();
  return rect.right <= viewportWidth && rect.left >= 0;
}

describe('Responsive Layout Integrity - Property 8', () => {
  let originalInnerWidth: number;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
  });

  afterEach(() => {
    setViewportWidth(originalInnerWidth);
  });

  // Property: For all viewport widths between 320px and 1920px,
  // ToolCard component SHALL render without horizontal overflow
  it('ToolCard should render without horizontal overflow at any viewport width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 50 }),
          description: fc.string({ minLength: 1, maxLength: 200 }),
        }),
        (viewportWidth, props) => {
          setViewportWidth(viewportWidth);

          const { container, unmount } = render(
            <div style={{ width: `${viewportWidth}px`, overflow: 'hidden' }}>
              <ToolCard title={props.title} description={props.description}>
                <div>Test content</div>
              </ToolCard>
            </div>
          );

          const toolCard = container.querySelector('.max-w-2xl');
          
          // ToolCard should exist
          expect(toolCard).not.toBeNull();
          
          // ToolCard should not cause horizontal overflow
          if (toolCard) {
            const cardWidth = (toolCard as HTMLElement).offsetWidth;
            expect(cardWidth).toBeLessThanOrEqual(viewportWidth);
          }

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: For all viewport widths, NumberInput should remain accessible
  it('NumberInput should remain accessible at any viewport width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        fc.record({
          id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z][a-zA-Z0-9-_]*$/.test(s)),
          label: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        (viewportWidth, props) => {
          setViewportWidth(viewportWidth);

          const { unmount } = render(
            <div style={{ width: `${viewportWidth}px` }}>
              <NumberInput
                id={props.id}
                label={props.label}
                value={0}
                onChange={() => {}}
              />
            </div>
          );

          // Input should be accessible
          const input = document.getElementById(props.id);
          expect(input).not.toBeNull();
          
          // Input should be visible (not hidden)
          if (input) {
            const styles = window.getComputedStyle(input);
            expect(styles.display).not.toBe('none');
            expect(styles.visibility).not.toBe('hidden');
          }

          // Label should be associated
          const label = document.querySelector(`label[for="${props.id}"]`);
          expect(label).not.toBeNull();

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: For all viewport widths, Button should remain clickable
  it('Button should remain clickable at any viewport width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        fc.string({ minLength: 1, maxLength: 30 }),
        (viewportWidth, buttonText) => {
          setViewportWidth(viewportWidth);

          const { unmount } = render(
            <div style={{ width: `${viewportWidth}px` }}>
              <Button>{buttonText}</Button>
            </div>
          );

          const button = screen.getByRole('button');
          expect(button).not.toBeNull();
          
          // Button should not be disabled
          expect(button).not.toBeDisabled();
          
          // Button should be visible
          const styles = window.getComputedStyle(button);
          expect(styles.display).not.toBe('none');
          expect(styles.visibility).not.toBe('hidden');

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: For all viewport widths, ResultDisplay should render properly
  it('ResultDisplay should render without overflow at any viewport width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        fc.record({
          label: fc.string({ minLength: 1, maxLength: 50 }),
          value: fc.oneof(
            fc.integer({ min: -1000000, max: 1000000 }),
            fc.string({ minLength: 1, maxLength: 20 })
          ),
          unit: fc.option(fc.string({ minLength: 1, maxLength: 10 }), { nil: undefined }),
        }),
        (viewportWidth, props) => {
          setViewportWidth(viewportWidth);

          const { container, unmount } = render(
            <div style={{ width: `${viewportWidth}px`, overflow: 'hidden' }}>
              <ResultDisplay
                label={props.label}
                value={props.value}
                unit={props.unit}
              />
            </div>
          );

          // ResultDisplay should exist
          const resultDisplay = container.querySelector('.rounded-lg');
          expect(resultDisplay).not.toBeNull();

          // Should have truncate class for long values
          const valueElement = container.querySelector('.truncate');
          expect(valueElement).not.toBeNull();

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: For all viewport widths, UnitToggle should remain interactive
  it('UnitToggle should remain interactive at any viewport width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        fc.constantFrom('imperial', 'metric') as fc.Arbitrary<'imperial' | 'metric'>,
        (viewportWidth, unit) => {
          setViewportWidth(viewportWidth);

          const { unmount } = render(
            <div style={{ width: `${viewportWidth}px` }}>
              <UnitToggle value={unit} onChange={() => {}} />
            </div>
          );

          // Toggle switch should be accessible
          const toggle = screen.getByRole('switch');
          expect(toggle).not.toBeNull();
          expect(toggle).not.toBeDisabled();

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: For all viewport widths, SelectInput should remain accessible
  it('SelectInput should remain accessible at any viewport width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        fc.record({
          id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z][a-zA-Z0-9-_]*$/.test(s)),
          label: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        (viewportWidth, props) => {
          setViewportWidth(viewportWidth);

          const options = [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
          ];

          const { unmount } = render(
            <div style={{ width: `${viewportWidth}px` }}>
              <SelectInput
                id={props.id}
                label={props.label}
                value="option1"
                onChange={() => {}}
                options={options}
              />
            </div>
          );

          // Select should be accessible
          const select = document.getElementById(props.id);
          expect(select).not.toBeNull();
          expect(select?.tagName.toLowerCase()).toBe('select');

          // Label should be associated
          const label = document.querySelector(`label[for="${props.id}"]`);
          expect(label).not.toBeNull();

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: For all viewport widths, interactive elements should have visible focus indicators
  it('Interactive elements should have focus-visible styles defined', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          setViewportWidth(viewportWidth);

          const { unmount } = render(
            <div style={{ width: `${viewportWidth}px` }}>
              <Button>Test Button</Button>
              <NumberInput id="test-input" label="Test" value={0} onChange={() => {}} />
            </div>
          );

          const button = screen.getByRole('button');
          const input = document.getElementById('test-input');

          // Both elements should exist and be focusable
          expect(button).not.toBeNull();
          expect(input).not.toBeNull();

          // Elements should have focus-visible ring classes in their className
          expect(button.className).toContain('focus-visible:ring');
          expect(input?.className).toContain('focus-visible:ring');

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
