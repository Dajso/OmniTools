import { Metadata } from 'next';
import { ProjectileMotionCalculator } from '@/components/calculators/physics';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Projectile Motion Calculator - Trajectory, Range, Max Height',
  description: 'Calculate projectile motion trajectory, range, maximum height, and flight time. Includes visual trajectory display and support for different gravity values.',
  keywords: ['projectile motion', 'trajectory calculator', 'physics calculator', 'range calculator', 'ballistics', 'kinematics'],
  alternates: { canonical: '/calculators/physics/projectile-motion-calculator' },
};

export default function ProjectileMotionCalculatorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="projectile-motion-calculator"
        title="Projectile Motion Calculator"
        description="Calculate projectile motion trajectory, range, maximum height, and flight time."
        category="Physics"
      />
      <ProjectileMotionCalculator />
    </main>
  );
}
