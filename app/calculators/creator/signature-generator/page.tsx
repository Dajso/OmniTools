import { Metadata } from 'next';
import { SignatureGenerator } from '@/components/calculators/creator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Signature Generator - Create Digital Signatures',
  description: 'Generate handwriting-style digital signatures for documents and emails. Free SVG and PNG signature creator.',
  keywords: ['signature generator', 'digital signature', 'handwriting signature', 'signature maker', 'electronic signature'],
  alternates: { canonical: '/calculators/creator/signature-generator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Signature Generator',
  description: 'Generate handwriting-style digital signatures',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter your name', text: 'Type the name you want to appear in the signature.' },
  { name: 'Choose a style', text: 'Select from various handwriting styles.' },
  { name: 'Customize appearance', text: 'Pick an ink color and adjust stroke width.' },
  { name: 'Preview', text: 'See your signature in the preview area.' },
  { name: 'Download', text: 'Download as SVG for documents or PNG for emails.' },
];

const faqs = [
  {
    question: 'Is this signature legally binding?',
    answer: 'This tool creates decorative signatures for informal use. For legally binding electronic signatures, use dedicated e-signature services like DocuSign or Adobe Sign.',
  },
  {
    question: 'What\'s the difference between SVG and PNG?',
    answer: 'SVG is a vector format that scales perfectly at any size, ideal for documents. PNG is a raster format better suited for emails and web use.',
  },
  {
    question: 'Can I use this for official documents?',
    answer: 'This is best for informal documents, email signatures, and personal use. Official documents may require certified electronic signatures.',
  },
  {
    question: 'Is my signature stored anywhere?',
    answer: 'No, your signature is generated entirely in your browser and is never sent to any server.',
  },
  {
    question: 'Can I create multiple signatures?',
    answer: 'Yes! You can create as many signatures as you like with different names and styles.',
  },
];

const relatedTools = [
  { href: '/calculators/creator/invoice-generator', title: 'Invoice Generator', description: 'Create professional invoices.' },
  { href: '/calculators/creator/business-name-generator', title: 'Business Name Generator', description: 'Generate business name ideas.' },
];

export default function SignatureGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="signature-generator"
          title="Signature Generator"
          description="Generate handwriting-style digital signatures for documents, emails, and personal use."
          colorClass="bg-indigo-100 text-indigo-600"
          category="Creator"
        />

        <section aria-label="Signature Generator">
          <SignatureGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
