import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Tid og dato',
  description: 'Gratis kalkulatorer for tid og dato: virkedager, alder, ukenummer, tidssoner og kalender med norske helligdager.',
  alternates: { canonical: '/calculators/time' },
};

export default function TimeCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="time"
      title="Tid og dato"
      description="Regn ut virkedager (med norske helligdager), alder, ukenummer, tidsforskjeller og lag kalender."
    />
  );
}
