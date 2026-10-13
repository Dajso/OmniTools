import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Baking og matvitenskap',
  description: 'Gratis kalkulatorer for baking: hydrering på surdeig, bakerprosent, kakeformer, gjær og temperering av sjokolade.',
  alternates: { canonical: '/calculators/baking' },
};

export default function BakingCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="baking"
      title="Baking og matvitenskap"
      description="Regn ut hydrering, bakerprosent, kakeform, omregning mellom fersk og tørrgjær, og temperering av sjokolade – i gram, dl og °C."
    />
  );
}
