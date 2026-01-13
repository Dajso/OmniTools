import { Metadata } from 'next';
import { BraSizeCalculator } from '@/components/calculators/health';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Bra Size Calculator - Find Your Perfect Fit',
  description: 'Calculate your bra size based on band and bust measurements. Free bra size calculator with US, UK, and EU size conversions.',
  keywords: ['bra size calculator', 'bra fitting calculator', 'cup size calculator', 'bra measurement calculator', 'bra size chart', 'bra size converter'],
  alternates: { canonical: '/calculators/health/bra-size-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Bra Size Calculator',
  description: 'Find your bra size based on band and bust measurements',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select your unit', text: 'Choose inches or centimeters for measurements.' },
  { name: 'Measure your band', text: 'Measure around your ribcage, just under your bust. Keep the tape snug but not tight.' },
  { name: 'Measure your bust', text: 'Measure around the fullest part of your bust, keeping the tape level.' },
  { name: 'View your size', text: 'See your bra size in US, UK, and EU sizing systems.' },
];

const faqs = [
  { question: 'How do I measure correctly?', answer: 'Wear an unpadded bra or no bra. Keep the measuring tape level and parallel to the floor. The tape should be snug but not tight. Measure in front of a mirror to ensure accuracy.' },
  { question: 'What if I\'m between sizes?', answer: 'If your band measurement is odd, round to the nearest even number. If you\'re between cup sizes, try both and see which fits better. Sister sizes (e.g., 34C = 32D = 36B) can also help.' },
  { question: 'Why do bra sizes vary by brand?', answer: 'Sizing isn\'t standardized across brands. Use this calculator as a starting point, then try on bras to find your best fit. The band should be snug and the cups should fully contain breast tissue.' },
];

export default function BraSizeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="bra-size-calculator"
          title="Bra Size Calculator"
          description="Find your perfect bra size based on your measurements. Get sizes in US, UK, and EU systems."
          colorClass="bg-red-100 text-red-700"
        />
        <section aria-label="Bra Size Calculator"><BraSizeCalculator /></section>
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
