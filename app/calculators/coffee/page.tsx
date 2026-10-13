import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Kaffekalkulatorer',
  description: 'Gratis verktøy for kaffe og brygging: ekstraksjon, bryggforhold, espresso, vannoppskrift og tidtakere.',
  alternates: { canonical: '/calculators/coffee' },
};

export default function CoffeeCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="coffee"
      title="Kaffekalkulatorer"
      description="Presise verktøy for kaffeentusiaster og baristaer: analyse av ekstraksjon, bryggforhold, espresso-innstilling og vannsammensetning."
    />
  );
}
