import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Finance Calculators',
  description: 'Free online financial calculators for mortgages, investments, loans, taxes, retirement planning, and more.',
};

export default function FinanceCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="finance"
      title="Finance Calculators"
      description="Essential financial calculation tools for personal finance management. Calculate mortgages, compound interest, ROI, debt payoff, retirement savings, and more."
    />
  );
}
