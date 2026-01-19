import { Metadata } from 'next';
import { PackingListGenerator } from '@/components/calculators/travel/packing-list-generator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Packing List Generator - Travel Checklist Creator',
  description: 'Generate a customized packing list based on your trip type, duration, weather, and activities. Never forget essential items again.',
  keywords: ['packing list', 'travel checklist', 'packing generator', 'travel essentials', 'trip planner', 'what to pack'],
  alternates: { canonical: '/calculators/travel/packing-list' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Packing List Generator',
  description: 'Generate customized packing lists for any trip',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Set trip duration', text: 'Use the slider to select how many days your trip will be.' },
  { name: 'Choose trip type', text: 'Select the type of trip: business, leisure, adventure, beach, city, or winter.' },
  { name: 'Select weather', text: 'Choose the expected weather conditions at your destination.' },
  { name: 'Add activities', text: 'Select any special activities you plan to do (hiking, swimming, etc.).' },
  { name: 'Generate and customize', text: 'Review your list, check off items as you pack, and download or copy the list.' },
];

const faqs = [
  { 
    question: 'How does the packing list adjust for trip length?', 
    answer: 'The generator scales quantities based on your trip duration. Items like underwear and shirts increase with longer trips (up to a week\'s worth), while single items like jackets stay at one.' 
  },
  { 
    question: 'What\'s the difference between essential and non-essential items?', 
    answer: 'Essential items are must-haves for your trip type and conditions. Non-essential items are nice-to-have but optional. Use the "Essentials Only" filter to focus on what you really need.' 
  },
  { 
    question: 'How accurate is the weight estimate?', 
    answer: 'The weight estimate is approximate, based on average item weights. Actual weight will vary based on specific items you pack. Use it as a rough guide for airline weight limits.' 
  },
  { 
    question: 'Can I save my packing list?', 
    answer: 'Yes! You can download your list as a text file or copy it to your clipboard. Your checked items are saved in your browser session.' 
  },
  { 
    question: 'Why are some items missing from my list?', 
    answer: 'Items are included based on your trip type, weather, and activities. If you need something specific, you can always add it manually to your downloaded list.' 
  },
];

const relatedTools = [
  { href: '/calculators/travel/schengen-calculator', title: 'Schengen Visa Calculator', description: 'Calculate your Schengen visa days.' },
  { href: '/calculators/travel/luggage-size', title: 'Luggage Size Checker', description: 'Check airline luggage requirements.' },
  { href: '/calculators/travel/currency-converter', title: 'Currency Converter', description: 'Convert currencies for your trip.' },
];

export default function PackingListPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="packing-list-generator"
          title="Packing List Generator"
          description="Generate a customized packing list based on your trip details. Select your trip type, duration, weather, and activities to get a comprehensive checklist."
          colorClass="bg-orange-100 text-orange-600"
          category="Travel"
        />

        <section aria-label="Packing List Generator">
          <PackingListGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
