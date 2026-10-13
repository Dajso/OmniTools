import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Håndarbeidskalkulatorer',
  description: 'Gratis kalkulatorer for håndarbeid: stoffbehov, strikkefasthet, garnbytte, sokkestørrelse, quilt og sirkelskjørt.',
  alternates: { canonical: '/calculators/crafts' },
};

export default function CraftsCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="crafts"
      title="Håndarbeidskalkulatorer"
      description="Regn ut stoffbehov i meter, strikkeoppskrifter etter din strikkefasthet, garnbytte, sokkestørrelser og kantbånd til quilt."
    />
  );
}
