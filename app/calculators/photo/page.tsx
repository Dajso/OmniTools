import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Foto- og videokalkulatorer',
  description: 'Gratis fotokalkulatorer: dybdeskarphet, gylden time, bildeformat, timelapse og ND-filter.',
  alternates: { canonical: '/calculators/photo' },
};

export default function PhotoCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="photo"
      title="Foto- og videokalkulatorer"
      description="Verktøy for fotografer: dybdeskarphet, gylden time (med midnattssol og mørketid), bildeformat, intervallfoto og ND-filter."
    />
  );
}
