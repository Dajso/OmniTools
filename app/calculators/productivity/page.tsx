import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Tekst og verktøy',
  description: 'Gratis nettverktøy: tekstverktøy, passordgenerator, UUID, JSON-formatering og mer.',
  alternates: { canonical: '/calculators/productivity' },
};

export default function ProductivityCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="productivity"
      title="Tekst og verktøy"
      description="Praktiske verktøy for tekst, kode og hverdag: tegnteller, passord, UUID, JSON, regulære uttrykk, kontrast og dato."
    />
  );
}
