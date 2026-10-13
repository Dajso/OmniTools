import { Metadata } from 'next';
import { LuggageSizeChecker } from '@/components/calculators/travel/luggage-size-checker';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Luggage Size Checker - Airline Baggage Limits',
  description: 'Check if your luggage meets airline size and weight limits. Compare carry-on, checked bag, and personal item requirements across major airlines.',
  keywords: ['luggage size', 'baggage limits', 'carry-on size', 'airline luggage', 'bag dimensions', 'checked baggage'],
  alternates: { canonical: '/calculators/travel/luggage-size' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Luggage Size Checker',
  description: 'Check if your luggage meets airline size and weight limits',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select bag type', text: 'Choose whether you\'re checking a carry-on, checked bag, or personal item.' },
  { name: 'Enter dimensions', text: 'Input your bag\'s length, width, and height in centimeters.' },
  { name: 'Enter weight', text: 'Add the weight of your packed bag in kilograms.' },
  { name: 'Select airline', text: 'Choose a specific airline or check all airlines at once.' },
  { name: 'Review results', text: 'See which airlines accept your bag and any size issues.' },
];

const faqs = [
  { 
    question: 'What\'s the difference between carry-on and personal item?', 
    answer: 'A carry-on is your main cabin bag that goes in the overhead bin. A personal item is a smaller bag (like a purse, laptop bag, or small backpack) that fits under the seat in front of you. Most airlines allow both.' 
  },
  { 
    question: 'What is linear total?', 
    answer: 'Linear total is the sum of length + width + height. Many airlines use this measurement for checked bags instead of individual dimension limits. For example, a 157cm linear limit means L+W+H must not exceed 157cm.' 
  },
  { 
    question: 'Do these limits include wheels and handles?', 
    answer: 'Yes, airline limits typically include wheels, handles, and any external pockets. Measure your bag at its largest points with handles extended.' 
  },
  { 
    question: 'What happens if my bag is too big?', 
    answer: 'If your carry-on exceeds limits, you may be required to check it at the gate, often for an additional fee. For checked bags, oversized luggage typically incurs extra charges.' 
  },
  { 
    question: 'Why do limits vary by airline?', 
    answer: 'Each airline sets its own policies based on aircraft types, overhead bin sizes, and business decisions. Budget airlines often have stricter limits, while premium carriers may be more generous.' 
  },
];

const relatedTools = [
  { href: '/calculators/travel/packing-list', title: 'Packing List Generator', description: 'Generate a packing list for your trip.' },
  { href: '/calculators/travel/flight-duration', title: 'Flight Duration Calculator', description: 'Estimate flight times.' },
  { href: '/calculators/travel/currency-converter', title: 'Currency Converter', description: 'Convert currencies for your trip.' },
];

export default function LuggageSizePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="luggage-size-checker"
          title="Luggage Size Checker"
          description="Check if your luggage meets airline size and weight limits. Compare requirements across 12+ major airlines for carry-on, checked bags, and personal items."
          colorClass="bg-indigo-100 text-indigo-600"
        />

        <section aria-label="Luggage Size Checker">
          <LuggageSizeChecker />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
