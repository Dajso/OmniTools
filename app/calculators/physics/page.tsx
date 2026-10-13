import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Fysikkalkulatorer',
  description: 'Gratis fysikkalkulatorer: kastbane, bevegelsesenergi, tetthet, trykk og dreiemoment, i SI-enheter.',
  alternates: { canonical: '/calculators/physics' },
};

export default function PhysicsCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="physics"
      title="Fysikkalkulatorer"
      description="Regn på kastbane, energi, tetthet, trykk og dreiemoment med SI-enheter."
    />
  );
}
