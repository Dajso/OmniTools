import { Metadata } from 'next';
import { DogAgeCalculator } from '@/components/calculators/health';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Dog Age Calculator - Dog Years to Human Years',
  description: 'Convert your dog\'s age to human years based on size. Free dog age calculator with life stage information and average lifespan.',
  keywords: ['dog age calculator', 'dog years calculator', 'dog to human years', 'puppy age calculator', 'dog life expectancy', 'dog age chart'],
  alternates: { canonical: '/calculators/health/dog-age-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Dog Age Calculator',
  description: 'Convert your dog\'s age to human years based on size',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter your dog\'s age', text: 'Input your dog\'s age in years and months.' },
  { name: 'Select dog size', text: 'Choose small (under 20 lbs), medium (20-50 lbs), large (50-100 lbs), or giant (over 100 lbs).' },
  { name: 'View human age equivalent', text: 'See your dog\'s age in human years, life stage, and average lifespan for their size.' },
];

const faqs = [
  { question: 'Is 1 dog year really 7 human years?', answer: 'No, this is a myth. Dogs age faster in their first two years, then slow down. Size also matters - larger dogs age faster than smaller ones. Our calculator uses more accurate formulas.' },
  { question: 'Why does size affect dog aging?', answer: 'Larger dogs have shorter lifespans and age faster. A Great Dane is considered senior at 6-7 years, while a Chihuahua might not be senior until 10-11 years.' },
  { question: 'What are the dog life stages?', answer: 'Puppy (0-6 months), Junior (6 months-2 years), Adult (2-7 years), Mature (7-10 years), and Senior (10+ years). These vary by size.' },
];

export default function DogAgeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="dog-age-calculator"
          title="Dog Age Calculator"
          description="Convert your dog's age to human years. Our calculator accounts for size, which significantly affects how dogs age."
          colorClass="bg-red-100 text-red-700"
        />
        <section aria-label="Dog Age Calculator"><DogAgeCalculator /></section>
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
