import { Metadata } from 'next';
import { TermsConditionsGenerator } from '@/components/calculators/creator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Terms & Conditions Generator - Free ToS Template',
  description: 'Generate free terms and conditions for your website or app. Customizable template for user agreements.',
  keywords: ['terms and conditions generator', 'terms of service generator', 'free tos template', 'website terms', 'user agreement'],
  alternates: { canonical: '/calculators/creator/terms-conditions-generator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Terms & Conditions Generator',
  description: 'Generate terms and conditions for your website or app',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter website details', text: 'Fill in your website name, URL, and contact information.' },
  { name: 'Select service features', text: 'Check which features your service offers (accounts, subscriptions, etc.).' },
  { name: 'Configure refund policy', text: 'Set your refund policy terms if applicable.' },
  { name: 'Generate terms', text: 'Click Generate to create your terms and conditions.' },
  { name: 'Copy or download', text: 'Copy the text or download as a file for your website.' },
];

const faqs = [
  {
    question: 'What is the difference between Terms & Conditions and Privacy Policy?',
    answer: 'Terms & Conditions govern how users can use your service and your rights as a provider. Privacy Policy explains how you collect and use personal data.',
  },
  {
    question: 'Do I need Terms & Conditions for my website?',
    answer: 'While not always legally required, Terms & Conditions protect your business by setting rules for using your service and limiting your liability.',
  },
  {
    question: 'Can I modify the generated terms?',
    answer: 'Yes, the generated text is a starting point. You should customize it to fit your specific business needs and have it reviewed by a lawyer.',
  },
  {
    question: 'How do I make users agree to my terms?',
    answer: 'Common methods include checkbox agreements during signup, click-wrap agreements, or browse-wrap notices with links to your terms.',
  },
  {
    question: 'How often should I update my Terms & Conditions?',
    answer: 'Update your terms whenever you change your services, pricing, or policies. Notify users of material changes.',
  },
];

const relatedTools = [
  { href: '/calculators/creator/privacy-policy-generator', title: 'Privacy Policy Generator', description: 'Generate a privacy policy for your website.' },
  { href: '/calculators/creator/invoice-generator', title: 'Invoice Generator', description: 'Create professional invoices.' },
];

export default function TermsConditionsGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="terms-conditions-generator"
          title="Terms & Conditions Generator"
          description="Generate customizable terms of service for your website or app. Free template with common legal provisions."
          colorClass="bg-purple-100 text-purple-600"
          category="Creator"
        />

        <section aria-label="Terms & Conditions Generator">
          <TermsConditionsGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
