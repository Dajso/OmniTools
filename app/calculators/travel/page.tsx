import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Reisekalkulatorer',
  description: 'Gratis reisekalkulatorer: Schengen, tidssoner, valuta, flytid, bagasje og pakkeliste.',
  alternates: { canonical: '/calculators/travel' },
};

export default function TravelCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="travel"
      title="Reisekalkulatorer"
      description="Planlegg reisen: regn ut Schengen-opphold, tidsforskjeller, valutakurs, flytid og hva du bør pakke."
    />
  );
}
