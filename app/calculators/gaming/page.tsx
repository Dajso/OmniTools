import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Gaming Calculators',
  description: 'Free online gaming calculators for mouse sensitivity, eDPI, reaction time, K/D ratio, and more gaming tools.',
};

export default function GamingCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="gaming"
      title="Gaming Calculators"
      description="Essential gaming calculation tools for competitive players. Convert mouse sensitivity, calculate eDPI, test reaction time, track K/D ratios, and optimize your gaming performance."
    />
  );
}
