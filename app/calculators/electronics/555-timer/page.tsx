import { Metadata } from 'next';
import { Timer555Calculator } from '@/components/calculators/electronics';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: '555 Timer Calculator - Astable & Monostable',
  description: 'Calculate frequency and timing for 555 timer circuits. Supports astable (oscillator) and monostable (one-shot) modes.',
  keywords: ['555 timer', 'astable', 'monostable', 'oscillator', 'electronics', 'frequency'],
  alternates: { canonical: '/calculators/electronics/555-timer' },
};

export default function Timer555Page() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="555-timer"
        title="555 Timer Calculator"
        description="Calculate frequency and timing for 555 timer circuits. Supports astable (oscillator) and monostable (one-shot) modes."
        category="Electronics"
      />
      <Timer555Calculator />
    </main>
  );
}
