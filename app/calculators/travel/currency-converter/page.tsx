import { Metadata } from 'next';
import { CurrencyConverter } from '@/components/calculators/travel/currency-converter';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Currency Converter - Exchange Rate Calculator',
  description: 'Convert between 30+ world currencies with offline support. Get exchange rates and quick reference tables for travel planning.',
  keywords: ['currency converter', 'exchange rate', 'money converter', 'forex', 'travel currency', 'USD EUR GBP'],
  alternates: { canonical: '/calculators/travel/currency-converter' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Currency Converter',
  description: 'Convert between world currencies with offline support',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter amount', text: 'Type the amount you want to convert or use quick amount buttons.' },
  { name: 'Select currencies', text: 'Choose the source and target currencies from the dropdowns.' },
  { name: 'View conversion', text: 'See the converted amount and exchange rate instantly.' },
  { name: 'Use quick reference', text: 'Check the reference table for common amounts.' },
  { name: 'Swap currencies', text: 'Click the swap button to reverse the conversion direction.' },
];

const faqs = [
  { 
    question: 'How accurate are the exchange rates?', 
    answer: 'Exchange rates are cached and updated periodically. For large transactions, always verify rates with your bank or financial institution as actual rates may vary.' 
  },
  { 
    question: 'Does this work offline?', 
    answer: 'Yes! The converter caches exchange rates locally, so you can use it even without an internet connection. Offline rates may be slightly outdated.' 
  },
  { 
    question: 'Which currencies are supported?', 
    answer: 'We support 30+ major world currencies including USD, EUR, GBP, JPY, CHF, CAD, AUD, and many more popular travel currencies.' 
  },
  { 
    question: 'Why might my bank rate be different?', 
    answer: 'Banks and exchange services add their own margins and fees. The rates shown here are mid-market rates, which are the midpoint between buy and sell rates.' 
  },
  { 
    question: 'How often are rates updated?', 
    answer: 'Rates are cached for 24 hours. The rate date shown indicates when the rates were last updated.' 
  },
];

const relatedTools = [
  { href: '/calculators/travel/timezone-planner', title: 'Time Zone Planner', description: 'Plan meetings across time zones.' },
  { href: '/calculators/finance/tip-calculator', title: 'Tip Calculator', description: 'Calculate tips in any currency.' },
];

export default function CurrencyConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="currency-converter"
          title="Currency Converter"
          description="Convert between 30+ world currencies instantly. Features offline support with cached exchange rates, perfect for travel planning."
          colorClass="bg-green-100 text-green-600"
        />

        <section aria-label="Currency Converter">
          <CurrencyConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
