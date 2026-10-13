import { Metadata } from 'next';
import { SchemaMarkupGenerator } from '@/components/calculators/creator';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Schema markup-generator – gratis kalkulator på nett',
  description: 'Lag JSON-LD strukturerte data for SEO, som FAQ, artikkel og produkt. Gratis og uten registrering.',
  keywords: ['schema markup', 'JSON-LD', 'strukturerte data', 'SEO', 'rich snippets'],
  alternates: { canonical: '/calculators/creator/schema-markup-generator' },
  openGraph: {
    title: 'Schema markup-generator',
    description: 'Lag JSON-LD strukturerte data for SEO, som FAQ, artikkel og produkt',
    url: '/calculators/creator/schema-markup-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const faqs = [
  { question: 'Hva er strukturerte data?', answer: 'Maskinlesbar informasjon på siden som hjelper søkemotorer å forstå innholdet og vise rike søkeresultater.' },
  { question: 'Hva er JSON-LD?', answer: 'Formatet Google anbefaler for strukturerte data. Det limes inn som en script-kode og påvirker ikke utseendet.' },
  { question: 'Garanterer det rike resultater?', answer: 'Nei. Det gjør siden kvalifisert, men Google avgjør om resultatet vises.' },
  { question: 'Hvilken valuta bruker produkt-schema?', answer: 'Standard er NOK. Bruk gjerne ISO-koden til valutaen du selger i.' },
];

export default function SchemaMarkupGeneratorPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-5xl">
            <ToolPageHeader
                toolId="schema-markup-generator"
                title="Schema markup-generator"
                description="Lag strukturerte data (JSON-LD) for SEO, som FAQ, artikkel, produkt, lokal virksomhet og arrangement. Gratis og uten registrering."
                colorClass="bg-indigo-100 text-indigo-700"
            />
            <section aria-label="Schema markup-generator">
                <SchemaMarkupGenerator />
            </section>

            <section className="mt-12" aria-labelledby="about-heading">
                <h2 id="about-heading" className="text-2xl font-semibold mb-4">Om schema markup</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p>
                        Schema markup hjelper søkemotorer å forstå innholdet ditt bedre, og kan gi utvidede
                        søkeresultater, såkalte «rike resultater». Det kan for eksempel være stjerner,
                        FAQ-lister, produktpriser og datoer for arrangementer.
                    </p>
                    <h3 className="text-lg font-medium mt-4 mb-2 text-foreground">Støttede schema-typer</h3>
                    <ul className="list-disc list-inside space-y-1">
                        <li><strong>Article</strong> – blogginnlegg, nyhetsartikler og fortellinger</li>
                        <li><strong>FAQ</strong> – sider med ofte stilte spørsmål</li>
                        <li><strong>Product</strong> – produkter i nettbutikk</li>
                        <li><strong>LocalBusiness</strong> – butikk eller sted med tjenester</li>
                        <li><strong>HowTo</strong> – veiledninger steg for steg</li>
                        <li><strong>Event</strong> – arrangementer, konserter og konferanser</li>
                        <li><strong>Organization</strong> – informasjon om firma eller merke</li>
                        <li><strong>Person</strong> – personprofil eller forfatterinfo</li>
                    </ul>
                </div>
            </section>

            <section className="mt-12" aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="text-2xl font-semibold mb-6">Ofte stilte spørsmål</h2>
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
