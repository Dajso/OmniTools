import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Spillkalkulatorer',
  description: 'Gratis spillkalkulatorer: musefølsomhet, eDPI, reaksjonstid, K/D-forhold og mer.',
  alternates: { canonical: '/calculators/gaming' },
};

export default function GamingCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="gaming"
      title="Spillkalkulatorer"
      description="Verktøy for gamere: finn riktig musefølsomhet, regn ut eDPI og test reaksjonstiden din."
    />
  );
}
