import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Moro og livsstil',
  description: 'Gratis verktøy for moro: kjærlighetstest, månefaser, stjernetegn, biorytme og numerologi.',
  alternates: { canonical: '/calculators/fun' },
};

export default function FunCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="fun"
      title="Moro og livsstil"
      description="Lette og morsomme verktøy for tidsfordriv. Merk at astrologi, numerologi og biorytme er underholdning og ikke vitenskap."
    />
  );
}
