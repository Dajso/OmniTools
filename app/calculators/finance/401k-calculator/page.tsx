import { Metadata } from 'next';
import { Calculator401k } from '@/components/calculators/finance/401k-calculator';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: '401(k) Calculator - Retirement Savings with Employer Match',
  description: 'Calculate your 401(k) retirement savings with employer matching contributions. See how your retirement fund grows over time.',
  keywords: ['401k calculator', 'retirement calculator', 'employer match', 'retirement savings', '401k contribution'],
  alternates: { canonical: '/calculators/finance/401k-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '401(k) Savings Calculator',
  description: 'Calculate your 401(k) retirement savings with employer matching contributions',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter your current age', text: 'Input your current age to calculate years until retirement.' },
  { name: 'Set retirement age', text: 'Choose when you plan to retire (typically 65).' },
  { name: 'Enter current balance', text: 'Input your current 401(k) balance.' },
  { name: 'Set annual contribution', text: 'Enter how much you contribute annually (max $23,000 for 2024).' },
  { name: 'Add employer match details', text: 'Enter your employer match percentage and limit.' },
  { name: 'View projections', text: 'See your projected retirement balance and breakdown.' },
];

const faqs = [
  { question: 'What is a 401(k)?', answer: 'A 401(k) is an employer-sponsored retirement savings plan that allows employees to save and invest a portion of their paycheck before taxes are taken out.' },
  { question: 'What is employer matching?', answer: 'Employer matching is when your employer contributes to your 401(k) based on your contributions. For example, a 50% match up to 6% means if you contribute 6% of your salary, your employer adds 3%.' },
  { question: 'What is the 401(k) contribution limit?', answer: 'For 2024, the contribution limit is $23,000 for those under 50, and $30,500 for those 50 and older (includes $7,500 catch-up contribution).' },
  { question: 'Should I max out my 401(k)?', answer: 'At minimum, contribute enough to get the full employer match - it\'s free money. Beyond that, consider your other financial goals and tax situation.' },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader toolId="401k-calculator" title="401(k) Savings Calculator"
          description="Calculate your retirement savings with employer matching. See how compound growth and employer contributions can build your retirement nest egg."
          colorClass="bg-green-100 text-green-700" />
        <section aria-label="401k Calculator"><Calculator401k /></section>
        <section className="mt-12" aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-2xl font-semibold mb-6">How to Use This Calculator</h2>
          <ol className="space-y-4">
            {howToSteps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">{i + 1}</span>
                <div><h3 className="font-medium">{step.name}</h3><p className="text-muted-foreground">{step.text}</p></div>
              </li>
            ))}
          </ol>
        </section>
        <section className="mt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b pb-6 last:border-b-0">
                <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
