import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Kalkulatorer for studier',
  description: 'Brøkkalkulator, standardform, kildehenvisning, pomodoro-timer og timeplan. Gratis verktøy for skole og studier.',
  alternates: { canonical: '/calculators/academic' },
};

export default function AcademicCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="academic"
      title="Kalkulatorer for studier"
      description="Verktøy som gjør studiehverdagen enklere: regn med brøker og standardform, lag kildehenvisninger i APA og MLA, planlegg timeplanen og hold fokus med pomodoro-teknikken."
    />
  );
}
