import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Hjem og oppussing',
  description: 'Gratis kalkulatorer for oppussing: maling, flis, gulv, betong, tapet og tak, i metriske mål.',
  alternates: { canonical: '/calculators/home' },
};

export default function HomeCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="home"
      title="Hjem og oppussing"
      description="Regn ut hvor mye maling, flis, gulv, tapet og betong du trenger til prosjektet, i m², liter og kilo."
    />
  );
}
