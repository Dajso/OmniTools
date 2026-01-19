import { Metadata } from 'next';
import { TimeZoneDifferenceMap } from '@/components/calculators/time';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Time Zone Difference Map - World Clock Comparison',
  description: 'Compare times across different time zones with visual display. See the time difference between cities and convert times easily.',
  keywords: ['time zone difference', 'world clock', 'time zone converter', 'time zone map', 'international time'],
  alternates: { canonical: '/calculators/time/timezone-difference-map' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Time Zone Difference Map',
  description: 'Compare times across different time zones with visual display',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select first time zone', text: 'Choose your reference time zone from the dropdown.' },
  { name: 'Select second time zone', text: 'Choose the time zone you want to compare with.' },
  { name: 'View current times', text: 'See the current time in both locations with visual indicators.' },
  { name: 'Convert specific times', text: 'Enter a specific time to see what it will be in the other zone.' },
  { name: 'Use the timeline', text: 'View the 24-hour comparison to find overlapping business hours.' },
];

const faqs = [
  {
    question: 'What do the colors mean?',
    answer: 'Colors indicate time of day: Gray for night (9pm-6am), Yellow for morning (6am-9am), Green for business hours (9am-5pm), and Orange for evening (5pm-9pm). This helps identify good times for calls or meetings.',
  },
  {
    question: 'Does this account for Daylight Saving Time?',
    answer: 'The displayed offsets are standard time offsets. During DST periods, some zones may be one hour different. Check local DST schedules for the most accurate times.',
  },
  {
    question: 'How do I find overlapping business hours?',
    answer: 'Look at the 24-hour timeline at the bottom. Green sections indicate business hours (9am-5pm). Where both zones show green at the same position, those are overlapping business hours.',
  },
  {
    question: 'Why are some offsets like +5:30?',
    answer: 'Some countries use half-hour or quarter-hour offsets from UTC. India (IST) uses UTC+5:30, Nepal uses UTC+5:45, and some Australian zones use UTC+9:30.',
  },
  {
    question: 'How often does the time update?',
    answer: 'The current time display updates automatically every minute. The time difference calculation is always accurate based on the selected zones.',
  },
];

const relatedTools = [
  { href: '/calculators/travel/timezone-planner', title: 'Time Zone Meeting Planner', description: 'Plan meetings across multiple time zones.' },
  { href: '/calculators/time/business-days-calculator', title: 'Business Days Calculator', description: 'Calculate business days between dates.' },
  { href: '/calculators/productivity/timestamp-converter', title: 'Timestamp Converter', description: 'Convert Unix timestamps to dates.' },
];

export default function TimeZoneDifferenceMapPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="timezone-difference-map"
          title="Time Zone Difference Map"
          description="Compare times across different time zones with visual display. See current times, calculate differences, and find overlapping business hours for international collaboration."
          colorClass="bg-indigo-100 text-indigo-600"
          category="Time & Date"
        />

        <section aria-label="Time Zone Difference Map">
          <TimeZoneDifferenceMap />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Common Time Zone Offsets</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">City</th>
                  <th className="text-left py-2 px-3">Time Zone</th>
                  <th className="text-center py-2 px-3">UTC Offset</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2 px-3">Honolulu</td><td className="py-2 px-3">HST</td><td className="text-center py-2 px-3">-10:00</td></tr>
                <tr className="border-b"><td className="py-2 px-3">Los Angeles</td><td className="py-2 px-3">PST/PDT</td><td className="text-center py-2 px-3">-8:00/-7:00</td></tr>
                <tr className="border-b"><td className="py-2 px-3">New York</td><td className="py-2 px-3">EST/EDT</td><td className="text-center py-2 px-3">-5:00/-4:00</td></tr>
                <tr className="border-b"><td className="py-2 px-3">London</td><td className="py-2 px-3">GMT/BST</td><td className="text-center py-2 px-3">0:00/+1:00</td></tr>
                <tr className="border-b"><td className="py-2 px-3">Paris</td><td className="py-2 px-3">CET/CEST</td><td className="text-center py-2 px-3">+1:00/+2:00</td></tr>
                <tr className="border-b"><td className="py-2 px-3">Dubai</td><td className="py-2 px-3">GST</td><td className="text-center py-2 px-3">+4:00</td></tr>
                <tr className="border-b"><td className="py-2 px-3">Mumbai</td><td className="py-2 px-3">IST</td><td className="text-center py-2 px-3">+5:30</td></tr>
                <tr className="border-b"><td className="py-2 px-3">Singapore</td><td className="py-2 px-3">SGT</td><td className="text-center py-2 px-3">+8:00</td></tr>
                <tr className="border-b"><td className="py-2 px-3">Tokyo</td><td className="py-2 px-3">JST</td><td className="text-center py-2 px-3">+9:00</td></tr>
                <tr><td className="py-2 px-3">Sydney</td><td className="py-2 px-3">AEST/AEDT</td><td className="text-center py-2 px-3">+10:00/+11:00</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">
              * Two offsets shown indicate Standard/Daylight Saving Time
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Tips for International Collaboration</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">🌍 Finding Overlap</h3>
              <p className="text-sm text-muted-foreground">
                For US-Europe calls, try 8-10am EST (1-3pm GMT). 
                For US-Asia calls, early morning US or late evening Asia often works best.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">📅 Scheduling Meetings</h3>
              <p className="text-sm text-muted-foreground">
                Always specify the time zone when scheduling. Use UTC for clarity, 
                or include multiple time zones in the invitation.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">⏰ DST Awareness</h3>
              <p className="text-sm text-muted-foreground">
                Remember that DST changes happen on different dates worldwide. 
                A meeting time that works today might shift by an hour next month.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">🔄 Rotating Schedules</h3>
              <p className="text-sm text-muted-foreground">
                For regular meetings across many time zones, consider rotating 
                the meeting time so the inconvenience is shared fairly.
              </p>
            </div>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
