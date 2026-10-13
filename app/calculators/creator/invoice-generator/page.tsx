import { Metadata } from 'next';
import { InvoiceGenerator } from '@/components/calculators/creator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Invoice Generator - Free PDF Invoice Creator',
  description: 'Create professional invoices with PDF export. Free invoice generator for freelancers and small businesses.',
  keywords: ['invoice generator', 'pdf invoice', 'free invoice maker', 'invoice creator', 'billing software'],
  alternates: { canonical: '/calculators/creator/invoice-generator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Invoice Generator',
  description: 'Create professional invoices with PDF export',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter your business info', text: 'Fill in your company name, address, and contact details.' },
  { name: 'Add client details', text: 'Enter your client\'s name and billing address.' },
  { name: 'Add line items', text: 'Add products or services with quantities and prices.' },
  { name: 'Set tax rate', text: 'Optionally add a tax percentage to the invoice.' },
  { name: 'Download PDF', text: 'Click Download PDF to generate and save your invoice.' },
];

const faqs = [
  {
    question: 'Is this invoice generator free?',
    answer: 'Yes, this invoice generator is completely free to use. There are no limits on the number of invoices you can create.',
  },
  {
    question: 'Are my invoices stored anywhere?',
    answer: 'No, all invoice generation happens in your browser. Your data is never sent to any server, ensuring complete privacy.',
  },
  {
    question: 'Can I customize the invoice template?',
    answer: 'The current version uses a professional standard template. You can customize the currency symbol and add notes to personalize your invoices.',
  },
  {
    question: 'What file format is the invoice?',
    answer: 'Invoices are generated as PDF files, which are universally compatible and professional for business use.',
  },
  {
    question: 'Can I add my logo to the invoice?',
    answer: 'Logo support is not currently available, but you can add your business name and full contact details.',
  },
];

const relatedTools = [
  { href: '/calculators/creator/cpm-calculator', title: 'CPM Calculator', description: 'Calculate advertising costs per thousand impressions.' },
  { href: '/calculators/creator/youtube-money-calculator', title: 'YouTube Money Calculator', description: 'Estimate YouTube ad revenue.' },
  { href: '/calculators/finance/freelance-rate-calculator', title: 'Freelance Rate Calculator', description: 'Calculate your hourly rate.' },
];

export default function InvoiceGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="invoice-generator"
          title="Invoice Generator"
          description="Create professional invoices with PDF export. Perfect for freelancers, contractors, and small businesses."
          colorClass="bg-blue-100 text-blue-600"
        />

        <section aria-label="Invoice Generator">
          <InvoiceGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
