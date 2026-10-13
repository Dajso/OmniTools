import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Byggekalkulatorer',
  description: 'Gratis byggekalkulatorer: betong, trapp, tak, kledning, rekkverk, gulv og materialmengder i metriske mål.',
  alternates: { canonical: '/calculators/construction' },
};

export default function ConstructionCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="construction"
      title="Byggekalkulatorer"
      description="Regn ut materialmengder og mål til byggeprosjektet, i meter, kvadratmeter og kubikkmeter."
    />
  );
}
