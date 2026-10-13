import { Metadata } from 'next';
import { WeekNumberCalculator } from '@/components/calculators/time';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Week Number Calculator - ISO Week Finder',
  description: 'Find the ISO week number for any date or get the dates for a specific week number. Includes day of year, quarter, and more.',
  keywords: ['week number calculator', 'ISO week', 'week of year', 'calendar week', 'week finder'],
  alternates: { canonical: '/calculators/time/week-number-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Week Number Calculator',
  description: 'Find ISO week number for any date or dates for a specific week',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Choose mode', text: 'Select whether to find a week number from a date or find dates from a week number.' },
  { name: 'Enter your input', text: 'Either select a date or enter a year and week number.' },
  { name: 'View results', text: 'See the ISO week number, day of year, quarter, and all dates in that week.' },
];

const faqs = [
  {
    question: 'What is an ISO week number?',
    answer: 'ISO 8601 defines a standard way to number weeks. Week 1 is the week containing the first Thursday of the year. All weeks start on Monday and end on Sunday.',
  },
  {
    question: 'Why do some years have 53 weeks?',
    answer: 'Most years have 52 weeks, but years that start on Thursday (or Wednesday in leap years) have 53 weeks. This happens roughly every 5-6 years.',
  },
  {
    question: 'Why might the ISO week year differ from the calendar year?',
    answer: 'The ISO week year can differ at the start and end of the calendar year. For example, December 31 might be in Week 1 of the next year, or January 1 might be in Week 52/53 of the previous year.',
  },
  {
    question: 'How is the day of year calculated?',
    answer: 'The day of year counts from January 1 (day 1) to December 31 (day 365 or 366 in leap years). It\'s useful for tracking progress through the year.',
  },
  {
    question: 'What is a quarter?',
    answer: 'A quarter divides the year into four 3-month periods: Q1 (Jan-Mar), Q2 (Apr-Jun), Q3 (Jul-Sep), and Q4 (Oct-Dec). Quarters are commonly used in business and finance.',
  },
];

const relatedTools = [
  { href: '/calculators/time/business-days-calculator', title: 'Business Days Calculator', description: 'Calculate business days between dates.' },
  { href: '/calculators/time/precise-age-calculator', title: 'Precise Age Calculator', description: 'Calculate exact age in multiple units.' },
  { href: '/calculators/time/calendar-generator', title: 'Calendar Generator', description: 'Generate printable calendars.' },
];

export default function WeekNumberCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="week-number-calculator"
          title="Week Number Calculator"
          description="Find the ISO week number for any date, or discover which dates fall within a specific week. Includes day of year, quarter information, and more."
          colorClass="bg-green-100 text-green-600"
        />

        <section aria-label="Week Number Calculator">
          <WeekNumberCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Week Numbers Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Month</th>
                  <th className="text-center py-2 px-3">Typical Weeks</th>
                  <th className="text-center py-2 px-3">Quarter</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2 px-3">January</td><td className="text-center py-2 px-3">1-5</td><td className="text-center py-2 px-3">Q1</td></tr>
                <tr className="border-b"><td className="py-2 px-3">February</td><td className="text-center py-2 px-3">5-9</td><td className="text-center py-2 px-3">Q1</td></tr>
                <tr className="border-b"><td className="py-2 px-3">March</td><td className="text-center py-2 px-3">9-13</td><td className="text-center py-2 px-3">Q1</td></tr>
                <tr className="border-b"><td className="py-2 px-3">April</td><td className="text-center py-2 px-3">13-18</td><td className="text-center py-2 px-3">Q2</td></tr>
                <tr className="border-b"><td className="py-2 px-3">May</td><td className="text-center py-2 px-3">18-22</td><td className="text-center py-2 px-3">Q2</td></tr>
                <tr className="border-b"><td className="py-2 px-3">June</td><td className="text-center py-2 px-3">22-26</td><td className="text-center py-2 px-3">Q2</td></tr>
                <tr className="border-b"><td className="py-2 px-3">July</td><td className="text-center py-2 px-3">26-31</td><td className="text-center py-2 px-3">Q3</td></tr>
                <tr className="border-b"><td className="py-2 px-3">August</td><td className="text-center py-2 px-3">31-35</td><td className="text-center py-2 px-3">Q3</td></tr>
                <tr className="border-b"><td className="py-2 px-3">September</td><td className="text-center py-2 px-3">35-40</td><td className="text-center py-2 px-3">Q3</td></tr>
                <tr className="border-b"><td className="py-2 px-3">October</td><td className="text-center py-2 px-3">40-44</td><td className="text-center py-2 px-3">Q4</td></tr>
                <tr className="border-b"><td className="py-2 px-3">November</td><td className="text-center py-2 px-3">44-48</td><td className="text-center py-2 px-3">Q4</td></tr>
                <tr><td className="py-2 px-3">December</td><td className="text-center py-2 px-3">48-52/53</td><td className="text-center py-2 px-3">Q4</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">
              * Week numbers vary slightly each year based on how days fall
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Years with 53 Weeks</h2>
          <p className="text-sm text-muted-foreground mb-3">
            These years have 53 ISO weeks instead of the usual 52:
          </p>
          <div className="flex flex-wrap gap-2">
            {[2004, 2009, 2015, 2020, 2026, 2032, 2037, 2043, 2048].map((year) => (
              <span key={year} className="px-3 py-1 bg-muted rounded-full text-sm">
                {year}
              </span>
            ))}
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
