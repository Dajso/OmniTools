import { Metadata } from 'next';
import { ContrastChecker } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Kontrastsjekker (WCAG) – gratis kalkulator på nett',
  description: 'Sjekk fargekontrast mot WCAG 2.1 AA/AAA for universell utforming. Gratis og uten registrering.',
  keywords: ['kontrast', 'WCAG', 'universell utforming', 'tilgjengelighet', 'fargekontrast', 'AA', 'AAA', 'UU'],
  alternates: { canonical: '/calculators/productivity/contrast-checker' },
  openGraph: {
    title: 'Kontrastsjekker (WCAG)',
    description: 'Sjekk fargekontrast mot WCAG 2.1 AA/AAA for universell utforming',
    url: '/calculators/productivity/contrast-checker',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const faqs = [
  { question: 'Hvilke krav gjelder i Norge?', answer: 'Offentlige og mange private nettløsninger skal oppfylle WCAG 2.1 nivå AA etter forskrift om universell utforming av IKT. Sjekk gjeldende regler hos Tilsynet for universell utforming av IKT (Digitaliseringsdirektoratet).' },
  { question: 'Hva er kravet til kontrast?', answer: 'AA krever 4,5:1 for normal tekst og 3:1 for stor tekst og grensesnitt. AAA krever 7:1 og 4,5:1.' },
  { question: 'Hva regnes som stor tekst?', answer: 'Minst 18 px, eller 14 px i fet skrift.' },
  { question: 'Gjelder kravet logoer?', answer: 'Nei, logoer og rent dekorativ grafikk er unntatt.' },
];

export default function ContrastCheckerPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <ToolPageHeader
                toolId="contrast-checker"
                title="Kontrastsjekker (WCAG)"
                description="Sjekk fargekontrast mot WCAG 2.1 AA og AAA for universell utforming av nettsider og apper. Gratis og uten registrering."
                colorClass="bg-violet-100 text-violet-700"
            />
            <section aria-label="Kontrastsjekker (WCAG)">
                <ContrastChecker />
            </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Kontrastkrav i WCAG 2.1</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Hva</th>
                  <th className="text-right py-2 px-3">Nivå AA</th>
                  <th className="text-right py-2 px-3">Nivå AAA</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="text-left py-2 px-3">Normal tekst (under 18 px)</td><td className="text-right py-2 px-3">4,5 : 1</td><td className="text-right py-2 px-3">7 : 1</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">Stor tekst (18 px eller 14 px fet)</td><td className="text-right py-2 px-3">3 : 1</td><td className="text-right py-2 px-3">4,5 : 1</td></tr>
                <tr><td className="text-left py-2 px-3">Grensesnitt og grafikk</td><td className="text-right py-2 px-3">3 : 1</td><td className="text-right py-2 px-3">–</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">Kontrastforholdet går fra 1:1 (ingen kontrast) til 21:1 (svart på hvitt).</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Slik bruker du kontrastsjekkeren</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Hvorfor kontrast?</h3>
              <p className="text-sm text-muted-foreground">Tydelig kontrast gjør innholdet lesbart for blant annet svaksynte, eldre og alle som bruker skjermen i sterkt lys.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Universell utforming</h3>
              <p className="text-sm text-muted-foreground">I Norge stilles det krav til universell utforming av nettløsninger. Nivå AA i WCAG 2.1 er utgangspunktet.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Ikke bare farge</h3>
              <p className="text-sm text-muted-foreground">Bruk ikke farge alene til å formidle informasjon. Legg til tekst, ikon eller mønster.</p>
            </div>
          </div>
        </section>

            <section className="mt-12" aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="text-2xl font-semibold mb-6">FAQ</h2>
                <div className="space-y-6">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border-b pb-6 last:border-b-0">
                            <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                            <p className="text-muted-foreground">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
