import { Metadata } from 'next';
import { HashGenerator } from '@/components/calculators/crypto';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Hash Generator - SHA-256 & Keccak-256 Calculator',
  description: 'Generate cryptographic hashes using SHA-256 and Keccak-256 algorithms. Create hashes for blockchain development and security applications.',
  keywords: ['hash generator', 'sha256', 'keccak256', 'crypto hash', 'ethereum hash', 'bitcoin hash'],
  alternates: { canonical: '/calculators/crypto/hash-generator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Hash Generator',
  description: 'Generate cryptographic hashes using SHA-256 and Keccak-256',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter text', text: 'Type or paste the text you want to hash.' },
  { name: 'Select algorithm', text: 'Choose SHA-256, Keccak-256, or another hash algorithm.' },
  { name: 'View hash', text: 'See the generated hash in hexadecimal format.' },
  { name: 'Copy result', text: 'Copy the hash with or without the 0x prefix.' },
];

const faqs = [
  {
    question: 'What is a cryptographic hash?',
    answer: 'A cryptographic hash is a fixed-size output generated from any input data. It is deterministic (same input = same output), one-way (cannot be reversed), and collision-resistant.',
  },
  {
    question: 'What is the difference between SHA-256 and Keccak-256?',
    answer: 'SHA-256 is used in Bitcoin and general cryptography. Keccak-256 is used in Ethereum for address generation and transaction signing. Both produce 256-bit hashes but use different algorithms.',
  },
  {
    question: 'Why is Keccak-256 different from SHA-3?',
    answer: 'Keccak won the SHA-3 competition, but Ethereum uses the original Keccak-256 before it was standardized as SHA-3. The standardized SHA-3 has slightly different padding.',
  },
  {
    question: 'Can I use this for password hashing?',
    answer: 'No. Password hashing requires specialized algorithms like bcrypt, scrypt, or Argon2 that include salting and are intentionally slow to prevent brute-force attacks.',
  },
  {
    question: 'What is the 0x prefix?',
    answer: 'The 0x prefix indicates a hexadecimal number. It is commonly used in Ethereum and other blockchain contexts to distinguish hex values from decimal numbers.',
  },
];

const relatedTools = [
  { href: '/calculators/crypto/address-shortener', title: 'Address Shortener', description: 'Shorten blockchain addresses for display.' },
  { href: '/calculators/crypto/ethereum-unit-converter', title: 'ETH Unit Converter', description: 'Convert between Wei, Gwei, and Ether.' },
  { href: '/calculators/productivity/base64-converter', title: 'Base64 Converter', description: 'Encode and decode Base64 strings.' },
];

export default function HashGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="hash-generator"
          title="Hash Generator"
          description="Generate cryptographic hashes using SHA-256 and Keccak-256 algorithms. Essential for blockchain development and security applications."
          colorClass="bg-green-100 text-green-600"
          category="Crypto"
        />

        <section aria-label="Hash Generator">
          <HashGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
