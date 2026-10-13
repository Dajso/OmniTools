import { Metadata } from 'next';
import { BMICalculator } from '@/components/calculators/health';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'KMI-kalkulator (BMI) – gratis kalkulator på nett',
  description: 'Beregn kroppsmasseindeks (KMI) i kilo og centimeter. Gratis og uten registrering.',
  keywords: ['KMI', 'BMI', 'kroppsmasseindeks', 'vektkalkulator', 'helse'],
  alternates: { canonical: '/calculators/health/bmi-calculator' },
  openGraph: {
    title: 'KMI-kalkulator (BMI)',
    description: 'Beregn kroppsmasseindeks (KMI) i kilo og centimeter',
    url: '/calculators/health/bmi-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'KMI-kalkulator (BMI)',
  description: 'Beregn kroppsmasseindeks (KMI) i kilo og centimeter',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn vekt', text: 'Oppgi vekten din i kilo.' },
  { name: 'Skriv inn høyde', text: 'Oppgi høyden din i centimeter.' },
  { name: 'Les KMI', text: 'Se KMI-verdien, kategorien og hva som regnes som normalvekt for din høyde.' },
];

const faqs = [
  { question: 'Hva er KMI (BMI)?', answer: 'KMI står for kroppsmasseindeks og regnes ut som vekt i kilo delt på høyde i meter opphøyd i andre. Det er et enkelt mål på om vekten er i forhold til høyden.' },
  { question: 'Hva er normal KMI?', answer: 'WHO regner KMI mellom 18,5 og 24,9 som normalvekt. Under 18,5 er undervekt, 25–29,9 er overvekt og 30 eller mer er fedme.' },
  { question: 'Hvor nøyaktig er KMI?', answer: 'KMI tar ikke hensyn til muskelmasse, alder eller hvor fettet sitter på kroppen. Veltrente kan få høy KMI uten overvekt. Midjemål og fastlegens vurdering gir et bedre bilde.' },
  { question: 'Gjelder KMI for barn?', answer: 'Nei. For barn og unge brukes egne vekstkurver. Snakk med helsesykepleier eller lege.' },
];

const relatedTools = [
  { href: '/calculators/health/body-fat-calculator', title: 'Kroppsfettkalkulator', description: 'Beregn fettprosent med Navy-formelen' },
  { href: '/calculators/health/tdee-calculator', title: 'Kalorikalkulator (TDEE)', description: 'Beregn hvor mange kalorier du forbruker per dag' },
];

const bmiCategories = [
  { category: 'Undervekt', range: 'Under 18,5', risk: 'Mulig mangel på næringsstoffer', color: 'bg-blue-100 text-blue-700' },
  { category: 'Normalvekt', range: '18,5 – 24,9', risk: 'Lav risiko', color: 'bg-green-100 text-green-700' },
  { category: 'Overvekt', range: '25 – 29,9', risk: 'Moderat risiko', color: 'bg-yellow-100 text-yellow-700' },
  { category: 'Fedme', range: '30 og over', risk: 'Høy risiko', color: 'bg-red-100 text-red-700' },
];

export default function BMICalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="bmi-calculator"
          title="KMI-kalkulator (BMI)"
          description="Regn ut kroppsmasseindeks (KMI/BMI) ut fra vekt i kilo og høyde i centimeter. Se normalvekt for din høyde. Gratis og uten registrering."
          colorClass="bg-red-100 text-red-600"
        />

        <section aria-label="KMI-kalkulator (BMI)">
          <BMICalculator />
        </section>

        {/* KMI-tabell */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">KMI-kategorier</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Kategori</th>
                      <th className="text-left py-3 px-4 font-medium">KMI-område</th>
                      <th className="text-left py-3 px-4 font-medium">Helserisiko</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bmiCategories.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${item.color}`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">{item.range}</td>
                        <td className="py-3 px-4 text-muted-foreground text-sm">{item.risk}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
