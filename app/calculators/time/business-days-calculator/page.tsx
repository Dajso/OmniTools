import { Metadata } from 'next';
import { BusinessDaysCalculator } from '@/components/calculators/time';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Business Days Calculator - Working Days Counter',
  description: 'Calculate business days between two dates or add business days to a date. Excludes weekends and optionally US federal holidays.',
  keywords: ['business days calculator', 'working days', 'weekday calculator', 'exclude weekends', 'holiday calculator'],
  alternates: { canonical: '/calculators/time/business-days-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Business Days Calculator',
  description: 'Calculate business days between dates, excluding weekends and holidays',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select calculation mode', text: 'Choose whether to calculate days between dates or add business days to a date.' },
  { name: 'Enter start date', text: 'Select your starting date from the date picker.' },
  { name: 'Enter end date or days', text: 'Either select an end date or enter the number of business days to add.' },
  { name: 'Configure holidays', text: 'Optionally exclude US federal holidays from the calculation.' },
  { name: 'View results', text: 'See the calculated business days or resulting date.' },
];

const faqs = [
  {
    question: 'What are business days?',
    answer: 'Business days (also called working days or weekdays) are Monday through Friday, excluding weekends (Saturday and Sunday) and optionally public holidays.',
  },
  {
    question: 'Which holidays are excluded?',
    answer: 'When enabled, the calculator excludes US federal holidays including New Year\'s Day, Martin Luther King Jr. Day, Presidents\' Day, Memorial Day, Juneteenth, Independence Day, Labor Day, Columbus Day, Veterans Day, Thanksgiving, and Christmas.',
  },
  {
    question: 'How are holiday weekends handled?',
    answer: 'If a federal holiday falls on a Saturday, it\'s observed on Friday. If it falls on a Sunday, it\'s observed on Monday. The calculator uses these observed dates.',
  },
  {
    question: 'Can I calculate backwards?',
    answer: 'Yes! In "Add business days" mode, you can enter a negative number to subtract business days from your start date.',
  },
  {
    question: 'Is the start date included in the count?',
    answer: 'Yes, both the start and end dates are included in the business days count if they are business days themselves.',
  },
];

const relatedTools = [
  { href: '/calculators/productivity/date-difference', title: 'Date Difference Calculator', description: 'Calculate the difference between two dates.' },
  { href: '/calculators/time/week-number-calculator', title: 'Week Number Calculator', description: 'Find the ISO week number for any date.' },
  { href: '/calculators/time/precise-age-calculator', title: 'Precise Age Calculator', description: 'Calculate exact age in years, months, and days.' },
];

export default function BusinessDaysCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="business-days-calculator"
          title="Business Days Calculator"
          description="Calculate business days between two dates or add business days to a date. Automatically excludes weekends and optionally US federal holidays."
          colorClass="bg-blue-100 text-blue-600"
          category="Time & Date"
        />

        <section aria-label="Business Days Calculator">
          <BusinessDaysCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">US Federal Holidays</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Holiday</th>
                  <th className="text-left py-2 px-3">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2 px-3">New Year&apos;s Day</td><td className="py-2 px-3">January 1</td></tr>
                <tr className="border-b"><td className="py-2 px-3">Martin Luther King Jr. Day</td><td className="py-2 px-3">3rd Monday in January</td></tr>
                <tr className="border-b"><td className="py-2 px-3">Presidents&apos; Day</td><td className="py-2 px-3">3rd Monday in February</td></tr>
                <tr className="border-b"><td className="py-2 px-3">Memorial Day</td><td className="py-2 px-3">Last Monday in May</td></tr>
                <tr className="border-b"><td className="py-2 px-3">Juneteenth</td><td className="py-2 px-3">June 19</td></tr>
                <tr className="border-b"><td className="py-2 px-3">Independence Day</td><td className="py-2 px-3">July 4</td></tr>
                <tr className="border-b"><td className="py-2 px-3">Labor Day</td><td className="py-2 px-3">1st Monday in September</td></tr>
                <tr className="border-b"><td className="py-2 px-3">Columbus Day</td><td className="py-2 px-3">2nd Monday in October</td></tr>
                <tr className="border-b"><td className="py-2 px-3">Veterans Day</td><td className="py-2 px-3">November 11</td></tr>
                <tr className="border-b"><td className="py-2 px-3">Thanksgiving</td><td className="py-2 px-3">4th Thursday in November</td></tr>
                <tr><td className="py-2 px-3">Christmas Day</td><td className="py-2 px-3">December 25</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
