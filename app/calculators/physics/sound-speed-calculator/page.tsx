import { Metadata } from 'next';
import { SoundSpeedCalculator } from '@/components/calculators/physics';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Sound Speed Calculator - Speed of Sound in Different Media',
  description: 'Calculate the speed of sound in air, water, steel, and other media based on temperature. Includes lightning distance calculator.',
  keywords: ['speed of sound', 'sound calculator', 'physics calculator', 'mach number', 'lightning distance', 'acoustics'],
  alternates: { canonical: '/calculators/physics/sound-speed-calculator' },
};

export default function SoundSpeedCalculatorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="sound-speed-calculator"
        title="Sound Speed Calculator"
        description="Calculate the speed of sound in air, water, steel, and other media based on temperature."
      />
      <SoundSpeedCalculator />
    </main>
  );
}
