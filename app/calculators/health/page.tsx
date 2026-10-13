import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Helse- og treningskalkulatorer',
  description: 'Gratis helsekalkulatorer: KMI, kalorier, makroer, kroppsfett, søvnsykluser og mer.',
  alternates: { canonical: '/calculators/health' },
};

export default function HealthCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="health"
      title="Helse- og treningskalkulatorer"
      description="Regn ut KMI, energibehov, makronæringsstoffer, kroppsfett og søvnsykluser. Tallene er veiledende og erstatter ikke råd fra helsepersonell."
    />
  );
}
