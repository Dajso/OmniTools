import { Metadata } from 'next';
import { CalendarGenerator } from '@/components/calculators/time';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Printable Calendar Generator - PDF Calendar Maker',
  description: 'Generate and download printable calendars in PDF format. Create monthly or yearly calendars with customizable options.',
  keywords: ['calendar generator', 'printable calendar', 'PDF calendar', 'calendar maker', 'yearly calendar', 'monthly calendar'],
  alternates: { canonical: '/calculators/time/calendar-generator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Printable Calendar Generator',
  description: 'Generate and download printable calendars in PDF format',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select year', text: 'Choose the year for your calendar.' },
  { name: 'Choose month (optional)', text: 'Select a specific month or leave empty for a full year calendar.' },
  { name: 'Configure options', text: 'Set week start day and holiday highlighting preferences.' },
  { name: 'Preview calendar', text: 'Review the generated calendar on screen.' },
  { name: 'Download PDF', text: 'Click the download button to get your printable PDF calendar.' },
];

const faqs = [
  {
    question: 'What paper size is the PDF optimized for?',
    answer: 'The PDF is optimized for A4 paper in landscape orientation. This provides the best layout for monthly calendars with clear, readable dates.',
  },
  {
    question: 'Can I print a full year on one page?',
    answer: 'When you select "Full Year", each month is placed on its own page in the PDF. This ensures each month is large enough to be useful and readable.',
  },
  {
    question: 'Why start the week on Monday?',
    answer: 'Starting the week on Monday follows the ISO 8601 international standard used in most countries. However, you can uncheck this option to start weeks on Sunday (US convention).',
  },
  {
    question: 'Which holidays are highlighted?',
    answer: 'When enabled, major US holidays are highlighted including New Year\'s Day, Independence Day, and Christmas. Hover over highlighted dates to see the holiday name.',
  },
  {
    question: 'Can I customize the calendar design?',
    answer: 'The current version generates a clean, professional calendar design. The PDF uses a simple black and white layout that prints well on any printer.',
  },
];

const relatedTools = [
  { href: '/calculators/time/week-number-calculator', title: 'Week Number Calculator', description: 'Find ISO week numbers for any date.' },
  { href: '/calculators/time/business-days-calculator', title: 'Business Days Calculator', description: 'Calculate business days between dates.' },
  { href: '/calculators/productivity/date-difference', title: 'Date Difference', description: 'Calculate days between two dates.' },
];

export default function CalendarGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="calendar-generator"
          title="Printable Calendar Generator"
          description="Generate beautiful, printable calendars in PDF format. Create monthly or full-year calendars with customizable options including week start day and holiday highlighting."
          colorClass="bg-orange-100 text-orange-600"
        />

        <section aria-label="Calendar Generator">
          <CalendarGenerator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Calendar Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">📅 Monthly View</h3>
              <p className="text-sm text-muted-foreground">
                Each month displays a full 6-week grid ensuring all days are visible, 
                even when months span across weeks.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">🖨️ Print-Ready PDF</h3>
              <p className="text-sm text-muted-foreground">
                Generated PDFs are optimized for printing with clean layouts, 
                proper margins, and readable fonts.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">🌍 ISO Standard</h3>
              <p className="text-sm text-muted-foreground">
                Option to start weeks on Monday following the international 
                ISO 8601 standard used worldwide.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">🎉 Holiday Highlights</h3>
              <p className="text-sm text-muted-foreground">
                US federal holidays are highlighted for easy reference. 
                Hover over dates to see holiday names.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Upcoming Years</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Year</th>
                  <th className="text-center py-2 px-3">Leap Year</th>
                  <th className="text-center py-2 px-3">Jan 1 Day</th>
                  <th className="text-center py-2 px-3">Weeks</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2 px-3">2024</td><td className="text-center py-2 px-3">Yes</td><td className="text-center py-2 px-3">Monday</td><td className="text-center py-2 px-3">52</td></tr>
                <tr className="border-b"><td className="py-2 px-3">2025</td><td className="text-center py-2 px-3">No</td><td className="text-center py-2 px-3">Wednesday</td><td className="text-center py-2 px-3">52</td></tr>
                <tr className="border-b"><td className="py-2 px-3">2026</td><td className="text-center py-2 px-3">No</td><td className="text-center py-2 px-3">Thursday</td><td className="text-center py-2 px-3">53</td></tr>
                <tr className="border-b"><td className="py-2 px-3">2027</td><td className="text-center py-2 px-3">No</td><td className="text-center py-2 px-3">Friday</td><td className="text-center py-2 px-3">52</td></tr>
                <tr><td className="py-2 px-3">2028</td><td className="text-center py-2 px-3">Yes</td><td className="text-center py-2 px-3">Saturday</td><td className="text-center py-2 px-3">52</td></tr>
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
