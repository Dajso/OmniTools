import { Metadata } from 'next';
import { PaycheckCalculator } from '@/components/calculators/creator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Paycheck Calculator - Hourly to Salary Converter',
  description: 'Calculate your paycheck from hourly rate. Convert hourly wages to weekly, bi-weekly, and monthly pay with overtime.',
  keywords: ['paycheck calculator', 'hourly to salary', 'wage calculator', 'pay calculator', 'overtime calculator'],
  alternates: { canonical: '/calculators/creator/paycheck-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Paycheck Calculator',
  description: 'Calculate your paycheck from hourly rate',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter hourly rate', text: 'Input your hourly wage or pay rate.' },
  { name: 'Set hours per week', text: 'Enter your regular weekly hours (typically 40).' },
  { name: 'Add overtime', text: 'Include any overtime hours and the overtime multiplier (usually 1.5x).' },
  { name: 'Select pay frequency', text: 'Choose how often you get paid.' },
  { name: 'View results', text: 'See your paycheck amount and annual salary.' },
];

const faqs = [
  {
    question: 'What is the standard overtime multiplier?',
    answer: 'In the US, the standard overtime rate is 1.5x (time and a half) for hours worked over 40 per week. Some employers offer 2x for holidays.',
  },
  {
    question: 'Does this include taxes?',
    answer: 'This calculator shows gross pay before taxes. Your actual take-home pay will be lower after federal, state, and local taxes.',
  },
  {
    question: 'What\'s the difference between bi-weekly and semi-monthly?',
    answer: 'Bi-weekly means every two weeks (26 paychecks/year). Semi-monthly means twice a month on set dates (24 paychecks/year).',
  },
  {
    question: 'How do I calculate my annual salary from hourly rate?',
    answer: 'Multiply your hourly rate by hours per week, then by 52 weeks. For example: $25/hr × 40 hrs × 52 weeks = $52,000/year.',
  },
  {
    question: 'Should I include overtime in my budget?',
    answer: 'It\'s safer to budget based on regular hours only. Overtime can vary and isn\'t guaranteed.',
  },
];

const relatedTools = [
  { href: '/calculators/finance/hourly-salary-calculator', title: 'Hourly to Salary Calculator', description: 'Convert between hourly and annual salary.' },
  { href: '/calculators/finance/freelance-rate-calculator', title: 'Freelance Rate Calculator', description: 'Calculate your freelance hourly rate.' },
  { href: '/calculators/creator/invoice-generator', title: 'Invoice Generator', description: 'Create professional invoices.' },
];

export default function PaycheckCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="paycheck-calculator"
          title="Paycheck Calculator"
          description="Calculate your gross pay from hourly rate. See weekly, bi-weekly, and monthly amounts with overtime."
          colorClass="bg-emerald-100 text-emerald-600"
          category="Creator"
        />

        <section aria-label="Paycheck Calculator">
          <PaycheckCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
