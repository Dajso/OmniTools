import { Metadata } from 'next';
import { PCBTraceCalculator } from '@/components/calculators/electronics';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'PCB Trace Width Calculator - IPC-2221',
  description: 'Calculate minimum PCB trace width for a given current using IPC-2221 standard. Includes voltage drop and power loss.',
  keywords: ['pcb trace', 'trace width', 'ipc-2221', 'pcb design', 'electronics'],
  alternates: { canonical: '/calculators/electronics/pcb-trace' },
};

export default function PCBTracePage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="pcb-trace"
        title="PCB Trace Width Calculator"
        description="Calculate minimum PCB trace width for a given current using IPC-2221 standard. Includes voltage drop and power loss."
        category="Electronics"
      />
      <PCBTraceCalculator />
    </main>
  );
}
