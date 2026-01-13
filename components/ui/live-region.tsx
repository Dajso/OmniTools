'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive';
  className?: string;
}

/**
 * Live Region Component
 * Invisible region for screen reader announcements.
 * Use 'assertive' for important/urgent messages (errors).
 * Use 'polite' for status updates that can wait.
 * 
 * **Validates: Requirements 11.6**
 */
const LiveRegion = React.forwardRef<HTMLDivElement, LiveRegionProps>(
  ({ message, priority = 'polite', className }, ref) => {
    const [announcement, setAnnouncement] = React.useState('');

    // Update announcement with a slight delay to ensure screen readers pick it up
    React.useEffect(() => {
      if (message) {
        // Clear first, then set - ensures screen readers announce repeated messages
        setAnnouncement('');
        const timeoutId = setTimeout(() => {
          setAnnouncement(message);
        }, 100);
        return () => clearTimeout(timeoutId);
      }
    }, [message]);

    return (
      <div
        ref={ref}
        role="status"
        aria-live={priority}
        aria-atomic="true"
        className={cn('sr-only', className)}
      >
        {announcement}
      </div>
    );
  }
);
LiveRegion.displayName = 'LiveRegion';

/**
 * Hook for announcing dynamic content to screen readers
 * Returns an announce function that can be called with a message
 * 
 * **Validates: Requirements 11.6**
 */
export function useAnnounce() {
  const [message, setMessage] = React.useState('');
  const [priority, setPriority] = React.useState<'polite' | 'assertive'>('polite');

  const announce = React.useCallback(
    (newMessage: string, newPriority: 'polite' | 'assertive' = 'polite') => {
      setPriority(newPriority);
      setMessage(newMessage);
    },
    []
  );

  const clear = React.useCallback(() => {
    setMessage('');
  }, []);

  return { message, priority, announce, clear };
}

export { LiveRegion };
