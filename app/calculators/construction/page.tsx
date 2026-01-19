import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Construction Calculators',
  description: 'Free online construction calculators for board foot, crown molding, concrete slabs, roof framing, and more building tools.',
};

export default function ConstructionCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="construction"
      title="Construction Calculators"
      description="Essential construction calculation tools for builders and contractors. Calculate board feet, crown molding angles, concrete volumes, roof framing, and plan your building projects."
    />
  );
}
