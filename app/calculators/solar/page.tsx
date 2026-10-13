import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Solenergi og off-grid',
  description: 'Gratis solcellekalkulatorer: panelvinkel, batteribank, vekselretter og ledningstverrsnitt, tilpasset norske forhold.',
  alternates: { canonical: '/calculators/solar' },
};

export default function SolarCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="solar"
      title="Solenergi og off-grid"
      description="Dimensjoner solcelleanlegg for hytte og bolig: panelvinkel, batteribank, vekselretter, kabeltverrsnitt og lønnsomhet."
    />
  );
}
