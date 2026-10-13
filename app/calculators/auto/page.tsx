import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Bilkalkulatorer',
  description: 'Gratis bilkalkulatorer: dekkstørrelse, drivstofforbruk, elbillading, hestekrefter og billån.',
  alternates: { canonical: '/calculators/auto' },
};

export default function AutoCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="auto"
      title="Bilkalkulatorer"
      description="Sammenlign dekkdimensjoner, regn ut forbruk i liter per mil, lade-tid for elbil og kostnader ved å eie bil."
    />
  );
}
