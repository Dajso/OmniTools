import { Metadata } from 'next';
import { ZeroSixtyEstimator } from '@/components/calculators/auto';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: '0-60 Time Estimator - Acceleration Calculator',
  description: 'Estimate 0-60 mph and quarter mile times based on horsepower, weight, drivetrain, and transmission. Calculate your car\'s acceleration potential.',
  keywords: ['0-60 calculator', 'acceleration estimator', 'quarter mile calculator', 'power to weight', 'car performance'],
  alternates: { canonical: '/calculators/auto/zero-sixty-estimator' },
};

export default function ZeroSixtyEstimatorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="zero-sixty-estimator"
        title="0-60 Time Estimator"
        description="Estimate 0-60 mph and quarter mile times based on horsepower, weight, drivetrain, and transmission."
      />
      <ZeroSixtyEstimator />
    </main>
  );
}
