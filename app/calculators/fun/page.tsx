import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Fun & Lifestyle Calculators',
  description: 'Free online fun calculators for love compatibility, moon phases, zodiac signs, biorhythms, numerology, and more lifestyle tools.',
};

export default function FunCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="fun"
      title="Fun & Lifestyle Calculators"
      description="Entertaining and lifestyle calculation tools for fun exploration. Test love compatibility, track moon phases, discover zodiac signs, calculate biorhythms, and explore numerology."
    />
  );
}
