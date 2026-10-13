import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Økonomikalkulatorer',
  description: 'Gratis økonomikalkulatorer: boliglån, sparing, lønn, skatt, rente og hverdagsøkonomi, i norske kroner.',
  alternates: { canonical: '/calculators/finance' },
};

export default function FinanceCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="finance"
      title="Økonomikalkulatorer"
      description="Regn på lån, sparing, rentes rente, lønn og skatt – tilpasset norske regler og i kroner."
    />
  );
}
