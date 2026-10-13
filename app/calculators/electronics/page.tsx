import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Elektronikkalkulatorer',
  description: 'Gratis elektronikkalkulatorer: motstandsfarger, Ohms lov, LED-motstand, spenningsdeler, kondensatorkoder, 555-timer og kretskort.',
  alternates: { canonical: '/calculators/electronics' },
};

export default function ElectronicsCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="electronics"
      title="Elektronikkalkulatorer"
      description="Verktøy for hobbyelektronikk og kretsdesign: fargekoder, Ohms lov, spenningsdeler, LED-motstand, batterilevetid og sporbredde på kretskort."
    />
  );
}
