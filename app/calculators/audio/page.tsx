import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Lyd- og musikkalkulatorer',
  description: 'Gratis verktøy for lyd og musikk: BPM, stemming, frekvens, delay, reverb og toneartfinner.',
  alternates: { canonical: '/calculators/audio' },
};

export default function AudioCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="audio"
      title="Lyd- og musikkalkulatorer"
      description="Verktøy for musikere og lydfolk: BPM og tempo, gitarstemming, notefrekvenser, delay og reverb, og toneart og skala."
    />
  );
}
