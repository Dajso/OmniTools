import { Metadata } from 'next';
import { MortgageCalculator } from '@/components/calculators/finance';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Mortgage Calculator with PMI - Free Online Calculator',
  description: 'Calculate your monthly mortgage payment including PMI, property taxes, and insurance. Free mortgage calculator with amortization schedule.',
  keywords: ['mortgage calculator', 'home loan calculator', 'PMI calculator', 'mortgage payment calculator'],
  alternates: { canonical: '/calculators/finance/mortgage-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Mortgage Calculator with PMI',
  description: 'Calculate your monthly mortgage payment including PMI, property taxes, and insurance',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter home price', text: 'Input the purchase price of the home you\'re considering.' },
  { name: 'Set down payment', text: 'Enter your down payment. 20% avoids PMI.' },
  { name: 'Choose loan term', text: 'Select 15 or 30 years for your mortgage.' },
  { name: 'Enter interest rate', text: 'Input the annual interest rate from your lender.' },
  { name: 'Add taxes & insurance', text: 'Enter annual property tax and insurance amounts.' },
  { name: 'Review results', text: 'See your monthly payment breakdown and amortization schedule.' },
];

const faqs = [
  { question: 'What is PMI and when is it required?', answer: 'Private Mortgage Insurance (PMI) protects the lender if you default. It\'s required when your down payment is less than 20%. PMI typically costs 0.5-1% of the loan annually.' },
  { question: 'How is the monthly payment calculated?', answer: 'Monthly payment = P × [r(1+r)^n] / [(1+r)^n - 1], where P is principal, r is monthly rate, and n is total payments. Taxes, insurance, and PMI are added separately.' },
  { question: 'Should I choose 15 or 30 years?', answer: '15-year mortgages have higher payments but lower total interest. 30-year mortgages have lower payments but higher total interest. Choose based on your budget.' },
  { question: 'How can I remove PMI?', answer: 'Request PMI removal at 20% equity. Lenders must cancel it at 22% equity. You can reach this through payments or home value appreciation.' },
];

const relatedTools = [
  { href: '/calculators/finance/refinance-calculator', title: 'Refinance Calculator', description: 'See if refinancing could save you money.' },
  { href: '/calculators/finance/compound-interest-calculator', title: 'Compound Interest Calculator', description: 'Calculate investment growth over time.' },
];

export default function MortgageCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="mortgage-calculator"
          title="Mortgage Calculator"
          description="Calculate your monthly mortgage payment including principal, interest, PMI, taxes, and insurance. See your complete amortization schedule."
          colorClass="bg-green-100 text-green-600"
          category="Finance"
        />

        <section aria-label="Mortgage Calculator">
          <MortgageCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
