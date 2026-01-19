import { Metadata } from 'next';
import { PrivacyPolicyGenerator } from '@/components/calculators/creator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Privacy Policy Generator - Free Policy Template',
  description: 'Generate a free privacy policy for your website or app. Customizable template for GDPR and CCPA compliance.',
  keywords: ['privacy policy generator', 'free privacy policy', 'gdpr privacy policy', 'website privacy policy', 'privacy policy template'],
  alternates: { canonical: '/calculators/creator/privacy-policy-generator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Privacy Policy Generator',
  description: 'Generate a privacy policy for your website or app',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter website details', text: 'Fill in your website name, URL, and contact information.' },
  { name: 'Select data collection', text: 'Check which types of data your website collects.' },
  { name: 'Configure features', text: 'Select features like cookies, analytics, and third-party services.' },
  { name: 'Generate policy', text: 'Click Generate to create your privacy policy.' },
  { name: 'Copy or download', text: 'Copy the text or download as a file for your website.' },
];

const faqs = [
  {
    question: 'Is this privacy policy legally binding?',
    answer: 'This generator creates a template that covers common privacy policy requirements. However, for full legal compliance, we recommend having an attorney review your policy.',
  },
  {
    question: 'Does this cover GDPR requirements?',
    answer: 'The generated policy includes many GDPR-related provisions like user rights and data handling. For full GDPR compliance, additional customization may be needed.',
  },
  {
    question: 'Can I use this for my mobile app?',
    answer: 'Yes, this privacy policy can be adapted for mobile apps. Just enter your app name instead of website name.',
  },
  {
    question: 'How often should I update my privacy policy?',
    answer: 'Update your privacy policy whenever you change how you collect, use, or share user data, or when laws change.',
  },
  {
    question: 'Do I need a privacy policy for my website?',
    answer: 'If you collect any personal information (including through analytics or cookies), most jurisdictions require a privacy policy.',
  },
];

const relatedTools = [
  { href: '/calculators/creator/terms-conditions-generator', title: 'Terms & Conditions Generator', description: 'Generate terms of service for your website.' },
  { href: '/calculators/creator/invoice-generator', title: 'Invoice Generator', description: 'Create professional invoices.' },
];

export default function PrivacyPolicyGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="privacy-policy-generator"
          title="Privacy Policy Generator"
          description="Generate a customizable privacy policy for your website or app. Free template with common legal provisions."
          colorClass="bg-green-100 text-green-600"
          category="Creator"
        />

        <section aria-label="Privacy Policy Generator">
          <PrivacyPolicyGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
