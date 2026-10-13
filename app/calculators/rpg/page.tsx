import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Rollespill- og brettspillkalkulatorer',
  description: 'Gratis verktøy for rollespill: terningkast, navnegenerator, karakterer, møter og skatt.',
  alternates: { canonical: '/calculators/rpg' },
};

export default function RpgCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="rpg"
      title="Rollespill- og brettspillkalkulatorer"
      description="Verktøy for spillmestere og spillere: terningkast, navn, møtebalanse, skatt og taverner."
    />
  );
}
