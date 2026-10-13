import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Hagekalkulatorer',
  description: 'Gratis hagekalkulatorer: jord og bark, plantavstand, gjødsel, pottejord, vanning, kompost og avling – i metriske mål.',
  alternates: { canonical: '/calculators/garden' },
};

export default function GardenCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="garden"
      title="Hagekalkulatorer"
      description="Regn ut hvor mye jord, bark og gjødsel du trenger, hvor tett du bør plante og hvor mye du kan høste, i m², liter og kilo."
    />
  );
}
