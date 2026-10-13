import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Eiendomskalkulatorer',
  description: 'Gratis eiendomskalkulatorer: yield, egenkapitalavkastning, utleie, kjøpskostnader og dokumentavgift.',
  alternates: { canonical: '/calculators/realestate' },
};

export default function RealEstateCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="realestate"
      title="Eiendomskalkulatorer"
      description="Verktøy for boligkjøpere og utleiere: vurder avkastning og utleie og beregn kostnader ved kjøp i Norge."
    />
  );
}
