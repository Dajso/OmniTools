import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Home & DIY Calculators',
  description: 'Free online home improvement calculators for paint, concrete, tile, flooring, roofing, and more DIY project tools.',
};

export default function HomeCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="home"
      title="Home & DIY Calculators"
      description="Essential home improvement calculation tools. Calculate paint coverage, concrete volume, tile quantities, flooring materials, and plan your DIY projects effectively."
    />
  );
}
