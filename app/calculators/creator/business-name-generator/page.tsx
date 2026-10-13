import { Metadata } from 'next';
import { BusinessNameGenerator } from '@/components/calculators/creator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Business Name Generator - Free Company Name Ideas',
  description: 'Generate creative business name ideas for your startup or company. Free business name generator with industry-specific suggestions.',
  keywords: ['business name generator', 'company name generator', 'startup name ideas', 'brand name generator', 'business name ideas'],
  alternates: { canonical: '/calculators/creator/business-name-generator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Business Name Generator',
  description: 'Generate creative business name ideas',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter a keyword', text: 'Optionally enter a word you want included in the name.' },
  { name: 'Select industry', text: 'Choose your business industry for relevant suggestions.' },
  { name: 'Choose style', text: 'Pick a naming style that fits your brand.' },
  { name: 'Generate names', text: 'Click Generate to create business name ideas.' },
  { name: 'Save favorites', text: 'Star your favorite names to save them.' },
];

const faqs = [
  {
    question: 'How do I know if a business name is available?',
    answer: 'After finding names you like, check domain availability, search your state\'s business registry, and search the USPTO trademark database.',
  },
  {
    question: 'What makes a good business name?',
    answer: 'A good business name is memorable, easy to spell and pronounce, relevant to your industry, and has available domain names and trademarks.',
  },
  {
    question: 'Should I include my industry in the name?',
    answer: 'It depends on your strategy. Industry-specific names are clearer but less flexible. Generic names allow for future expansion.',
  },
  {
    question: 'Can I use these names for my business?',
    answer: 'Yes, but always verify availability first. Check domain names, social media handles, and trademark databases before committing.',
  },
  {
    question: 'How many names should I consider?',
    answer: 'Generate many options, narrow down to 5-10 favorites, then research availability and get feedback before making a final decision.',
  },
];

const relatedTools = [
  { href: '/calculators/creator/signature-generator', title: 'Signature Generator', description: 'Create a digital signature.' },
  { href: '/calculators/creator/invoice-generator', title: 'Invoice Generator', description: 'Create professional invoices.' },
  { href: '/calculators/rpg/fantasy-name-generator', title: 'Fantasy Name Generator', description: 'Generate fantasy character names.' },
];

export default function BusinessNameGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="business-name-generator"
          title="Business Name Generator"
          description="Generate creative business name ideas for your startup, company, or brand."
          colorClass="bg-amber-100 text-amber-600"
        />

        <section aria-label="Business Name Generator">
          <BusinessNameGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
