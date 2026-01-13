import { Metadata } from 'next';
import { CatAgeCalculator } from '@/components/calculators/health';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Cat Age Calculator - Cat Years to Human Years',
  description: 'Convert your cat\'s age to human years. Free cat age calculator with life stage information and average lifespan.',
  keywords: ['cat age calculator', 'cat years calculator', 'cat to human years', 'kitten age calculator', 'cat life expectancy', 'cat age chart'],
  alternates: { canonical: '/calculators/health/cat-age-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Cat Age Calculator',
  description: 'Convert your cat\'s age to human years',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter your cat\'s age', text: 'Input your cat\'s age in years and months.' },
  { name: 'View human age equivalent', text: 'See your cat\'s age in human years and their current life stage.' },
  { name: 'Check life expectancy', text: 'See the average lifespan for cats to understand your cat\'s life stage.' },
];

const faqs = [
  { question: 'How do cat years work?', answer: 'Cats age rapidly in their first two years (first year = 15 human years, second year = 9 more), then about 4 human years for each cat year after that.' },
  { question: 'What is the average cat lifespan?', answer: 'Indoor cats typically live 12-18 years, with some reaching their 20s. Outdoor cats have shorter lifespans due to environmental risks.' },
  { question: 'What are the cat life stages?', answer: 'Kitten (0-6 months), Junior (6 months-2 years), Prime (2-7 years), Mature (7-11 years), Senior (11-15 years), and Geriatric (15+ years).' },
];

export default function CatAgeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="cat-age-calculator"
          title="Cat Age Calculator"
          description="Convert your cat's age to human years. Understand your cat's life stage and what to expect at each age."
          colorClass="bg-red-100 text-red-700"
        />
        <section aria-label="Cat Age Calculator"><CatAgeCalculator /></section>
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
