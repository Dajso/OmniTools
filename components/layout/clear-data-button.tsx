'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

/**
 * Sletter alt kalkulatoren har lagret i nettleseren din
 * (favoritter, sist brukte verdier og lignende).
 */
export function ClearDataButton() {
  const [cleared, setCleared] = useState(false);

  const handleClear = () => {
    try {
      localStorage.clear();
      setCleared(true);
    } catch {
      setCleared(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="button" variant="outline" onClick={handleClear}>
        Slett lagrede data
      </Button>
      {cleared && (
        <span role="status" className="text-sm text-gray-600">
          Ferdig. Alt som var lagret i nettleseren er slettet.
        </span>
      )}
    </div>
  );
}
