import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Akvarium- og terrariekalkulatorer',
  description: 'Gratis kalkulatorer for akvarium og terrarium: volum, besetning, CO₂, saltblanding, varmeelement og gjødsling.',
  alternates: { canonical: '/calculators/aquarium' },
};

export default function AquariumCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="aquarium"
      title="Akvarium- og terrariekalkulatorer"
      description="Regn ut volum i liter, hvor mange fisk karet tåler, CO₂, saltblanding, effekt på varmeelement og dosering av gjødsel."
    />
  );
}
