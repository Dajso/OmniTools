import { Metadata } from 'next';
import { BACCalculator } from '@/components/calculators/health';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'BAC Calculator - Blood Alcohol Content Calculator',
  description: 'Estimate your blood alcohol content (BAC) based on drinks consumed. Free BAC calculator with time to sober and legal driving information.',
  keywords: ['BAC calculator', 'blood alcohol calculator', 'alcohol calculator', 'drunk calculator', 'breathalyzer estimate', 'alcohol level calculator'],
  alternates: { canonical: '/calculators/health/bac-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'BAC Calculator',
  description: 'Estimate your blood alcohol content based on drinks consumed',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter your weight', text: 'Input your body weight in pounds or kilograms.' },
  { name: 'Select biological sex', text: 'Choose male or female (affects alcohol metabolism rate).' },
  { name: 'Enter drinks consumed', text: 'Input the number of standard drinks and type (beer, wine, spirits).' },
  { name: 'Enter time elapsed', text: 'Input hours since your first drink.' },
  { name: 'View your estimated BAC', text: 'See your estimated BAC, impairment level, and time to sober.' },
];

const faqs = [
  { question: 'What is a standard drink?', answer: 'A standard drink contains about 0.6 oz of pure alcohol: 12 oz beer (5%), 5 oz wine (12%), or 1.5 oz spirits (40%). Different drinks may vary.' },
  { question: 'What BAC is legal to drive?', answer: 'In most US states, the legal limit is 0.08% BAC. However, impairment begins at much lower levels. Some states have lower limits for commercial drivers (0.04%) or zero tolerance for under 21.' },
  { question: 'How accurate is this calculator?', answer: 'This provides estimates only. Actual BAC varies based on food intake, medications, metabolism, and other factors. Never rely on a calculator to determine if you\'re safe to drive.' },
];

export default function BACCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="bac-calculator"
          title="BAC Calculator"
          description="Estimate your blood alcohol content based on drinks consumed. For educational purposes only - never drink and drive."
          colorClass="bg-red-100 text-red-700"
        />
        <section aria-label="BAC Calculator"><BACCalculator /></section>
        <section className="mt-12" aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-2xl font-semibold mb-6">How to Use This Calculator</h2>
          <ol className="space-y-4">
            {howToSteps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">{i + 1}</span>
                <div><h3 className="font-medium">{step.name}</h3><p className="text-muted-foreground">{step.text}</p></div>
              </li>
            ))}
          </ol>
        </section>
        <section className="mt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
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
    </>
  );
}
