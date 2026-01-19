import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Betting Calculators',
  description: 'Free online betting calculators for odds conversion, parlay, arbitrage, Kelly criterion, and more sports betting tools.',
};

export default function BettingCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="betting"
      title="Betting Calculators"
      description="Essential betting calculation tools for sports bettors. Convert odds, calculate parlays, find arbitrage opportunities, apply Kelly criterion, and make smarter betting decisions."
    />
  );
}
