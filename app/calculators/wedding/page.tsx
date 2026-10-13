import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Bryllups- og selskapskalkulatorer',
  description: 'Gratis kalkulatorer for bryllup og selskap: gjester, budsjett, kake, bord og telt.',
  alternates: { canonical: '/calculators/wedding' },
};

export default function WeddingCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="wedding"
      title="Bryllups- og selskapskalkulatorer"
      description="Planlegg bryllup og fest: antall gjester, budsjett, kake, bord, telt og tidslinje."
    />
  );
}
