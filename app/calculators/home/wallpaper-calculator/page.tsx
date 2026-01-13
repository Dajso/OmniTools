import { Metadata } from 'next';
import { WallpaperCalculator } from '@/components/calculators/home';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Wallpaper Calculator - How Many Rolls Do I Need?',
  description: 'Calculate how many rolls of wallpaper you need for your room. Free wallpaper calculator accounts for doors, windows, and pattern matching.',
  keywords: ['wallpaper calculator', 'how many rolls wallpaper', 'wallpaper estimator', 'wall covering calculator'],
  alternates: { canonical: '/calculators/home/wallpaper-calculator' },
};

const structuredData = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Wallpaper Calculator', description: 'Calculate wallpaper rolls needed', applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };

const howToSteps = [
  { name: 'Measure your room', text: 'Measure the length, width, and height of your room.' },
  { name: 'Count openings', text: 'Count the number of doors and windows to subtract from the total.' },
  { name: 'Enter roll specs', text: 'Enter your wallpaper roll width, length, and pattern repeat if applicable.' },
];

const faqs = [
  { question: 'What is a standard wallpaper roll size?', answer: 'American rolls are typically 27" wide × 27 feet long. European rolls are often 21" wide × 33 feet long.' },
  { question: 'What is pattern repeat?', answer: 'Pattern repeat is the distance between where the pattern starts again. Larger repeats mean more waste.' },
  { question: 'How many extra rolls should I buy?', answer: 'Buy 1-2 extra rolls for mistakes and future repairs. More for large pattern repeats.' },
];

export default function WallpaperCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="wallpaper-calculator"
          title="Wallpaper Calculator"
          description="Calculate how many rolls of wallpaper you need for your room."
          colorClass="bg-amber-100 text-amber-700"
        />
        <section aria-label="Wallpaper Calculator"><WallpaperCalculator /></section>
        <section className="mt-12" aria-labelledby="how-to-heading"><h2 id="how-to-heading" className="text-2xl font-semibold mb-6">How to Use This Calculator</h2><ol className="space-y-4">{howToSteps.map((step, i) => (<li key={i} className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">{i + 1}</span><div><h3 className="font-medium">{step.name}</h3><p className="text-muted-foreground">{step.text}</p></div></li>))}</ol></section>
        <section className="mt-12" aria-labelledby="faq-heading"><h2 id="faq-heading" className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2><div className="space-y-6">{faqs.map((faq, i) => (<div key={i} className="border-b pb-6 last:border-b-0"><h3 className="font-medium text-lg mb-2">{faq.question}</h3><p className="text-muted-foreground">{faq.answer}</p></div>))}</div></section>
      </main>
    </>
  );
}
