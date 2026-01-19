import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Statistics Calculators',
  description: 'Free online statistics calculators for standard deviation, p-value, sample size, correlation, A/B testing, and more.',
};

export default function StatsCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="stats"
      title="Statistics Calculators"
      description="Essential statistical calculation tools for researchers and analysts. Calculate standard deviation, p-values, sample sizes, correlations, run A/B tests, and analyze your data effectively."
    />
  );
}
