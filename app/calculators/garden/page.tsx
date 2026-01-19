import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Garden Calculators',
  description: 'Free online gardening calculators for mulch, soil, plant spacing, hardiness zones, fertilizer, and more garden tools.',
};

export default function GardenCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="garden"
      title="Garden Calculators"
      description="Essential gardening calculation tools for green thumbs. Calculate mulch and soil volumes, plant spacing, hardiness zones, fertilizer amounts, and plan your garden effectively."
    />
  );
}
