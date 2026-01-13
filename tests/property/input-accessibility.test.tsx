/**
 * Property Test: Input Accessibility Association
 * Feature: english-tools-website, Property 3: Input Accessibility Association
 * 
 * *For any* rendered input element in the application, there SHALL exist an 
 * associated label element with a matching `for` attribute or the input SHALL 
 * be wrapped by a label element.
 * 
 * **Validates: Requirements 2.7, 11.1**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render, screen } from '@testing-library/react';
import { NumberInput } from '@/components/ui/number-input';

describe('Input Accessibility Association - Property 3', () => {
  // Property: For all NumberInput components with any valid props,
  // the input element SHALL have an associated label with matching htmlFor
  it('NumberInput should always have associated label with matching for attribute', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z][a-zA-Z0-9-_]*$/.test(s)),
          label: fc.string({ minLength: 1, maxLength: 50 }),
          value: fc.oneof(fc.integer({ min: -1000, max: 1000 }), fc.constant('')),
          unit: fc.option(fc.string({ minLength: 1, maxLength: 10 }), { nil: undefined }),
          error: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
          required: fc.boolean(),
          disabled: fc.boolean(),
        }),
        (props) => {
          const { unmount } = render(
            <NumberInput
              id={props.id}
              label={props.label}
              value={props.value}
              onChange={() => {}}
              unit={props.unit}
              error={props.error}
              required={props.required}
              disabled={props.disabled}
            />
          );

          // Get the input element
          const input = document.getElementById(props.id);
          expect(input).not.toBeNull();
          expect(input?.tagName.toLowerCase()).toBe('input');

          // Get the label element with matching htmlFor
          const label = document.querySelector(`label[for="${props.id}"]`);
          expect(label).not.toBeNull();
          expect(label?.textContent).toContain(props.label);

          // Verify the label's for attribute matches the input's id
          expect(label?.getAttribute('for')).toBe(props.id);

          // Clean up
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: For all NumberInput components with errors,
  // the error message SHALL be associated via aria-describedby
  it('NumberInput with error should have aria-describedby pointing to error message', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z][a-zA-Z0-9-_]*$/.test(s)),
          label: fc.string({ minLength: 1, maxLength: 50 }),
          error: fc.string({ minLength: 1, maxLength: 100 }),
        }),
        (props) => {
          const { unmount } = render(
            <NumberInput
              id={props.id}
              label={props.label}
              value={0}
              onChange={() => {}}
              error={props.error}
            />
          );

          const input = document.getElementById(props.id);
          const errorId = `${props.id}-error`;
          
          // Input should have aria-describedby pointing to error
          expect(input?.getAttribute('aria-describedby')).toBe(errorId);
          
          // Error element should exist with matching id
          const errorElement = document.getElementById(errorId);
          expect(errorElement).not.toBeNull();
          expect(errorElement?.textContent).toBe(props.error);
          
          // Error should have role="alert" for screen readers
          expect(errorElement?.getAttribute('role')).toBe('alert');

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: For all required NumberInput components,
  // the input SHALL have aria-required="true"
  it('Required NumberInput should have aria-required attribute', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z][a-zA-Z0-9-_]*$/.test(s)),
          label: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        (props) => {
          const { unmount } = render(
            <NumberInput
              id={props.id}
              label={props.label}
              value={0}
              onChange={() => {}}
              required={true}
            />
          );

          const input = document.getElementById(props.id);
          expect(input?.getAttribute('aria-required')).toBe('true');

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: For all NumberInput components with errors,
  // aria-invalid SHALL be "true"
  it('NumberInput with error should have aria-invalid="true"', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z][a-zA-Z0-9-_]*$/.test(s)),
          label: fc.string({ minLength: 1, maxLength: 50 }),
          error: fc.string({ minLength: 1, maxLength: 100 }),
        }),
        (props) => {
          const { unmount } = render(
            <NumberInput
              id={props.id}
              label={props.label}
              value={0}
              onChange={() => {}}
              error={props.error}
            />
          );

          const input = document.getElementById(props.id);
          expect(input?.getAttribute('aria-invalid')).toBe('true');

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: For all NumberInput components without errors,
  // aria-invalid SHALL be "false"
  it('NumberInput without error should have aria-invalid="false"', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z][a-zA-Z0-9-_]*$/.test(s)),
          label: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        (props) => {
          const { unmount } = render(
            <NumberInput
              id={props.id}
              label={props.label}
              value={0}
              onChange={() => {}}
            />
          );

          const input = document.getElementById(props.id);
          expect(input?.getAttribute('aria-invalid')).toBe('false');

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
