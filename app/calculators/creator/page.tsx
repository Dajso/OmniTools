import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Kalkulatorer for innhold og nett',
  description: 'Gratis verktøy for innholdsprodusenter: QR-koder, fakturaer, sosiale medier, YouTube-inntekter og personvernerklæring.',
  alternates: { canonical: '/calculators/creator' },
};

export default function CreatorCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="creator"
      title="Kalkulatorer for innhold og nett"
      description="Verktøy for deg som lager innhold eller driver egen virksomhet: QR-koder, PDF-faktura, engasjement, inntektsanslag og tekstverktøy."
    />
  );
}
