import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Statistikkalkulatorer',
  description: 'Gratis statistikkalkulatorer: standardavvik, p-verdi, utvalgsstørrelse, korrelasjon og A/B-test.',
  alternates: { canonical: '/calculators/stats' },
};

export default function StatsCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="stats"
      title="Statistikkalkulatorer"
      description="Regn ut standardavvik, p-verdi, korrelasjon, utvalgsstørrelse og A/B-tester, og simuler terninger og myntkast."
    />
  );
}
