import { Metadata } from 'next';
import { AddressShortener } from '@/components/calculators/crypto';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Address Shortener - Blockchain Address Display Tool',
  description: 'Shorten blockchain addresses for display in the 0x123...abc format. Support for Ethereum, Bitcoin, and Solana addresses.',
  keywords: ['address shortener', 'ethereum address', 'wallet address', 'blockchain address', 'crypto address format'],
  alternates: { canonical: '/calculators/crypto/address-shortener' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Address Shortener',
  description: 'Shorten blockchain addresses for display',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter address', text: 'Paste your blockchain address (Ethereum, Bitcoin, or Solana).' },
  { name: 'Adjust lengths', text: 'Set the prefix and suffix character lengths.' },
  { name: 'Copy result', text: 'Copy the shortened address for use in your application.' },
];

const faqs = [
  {
    question: 'Why shorten blockchain addresses?',
    answer: 'Blockchain addresses are long and difficult to read. Shortening them (e.g., 0x742d...fE21) makes them easier to display in UIs while still being identifiable.',
  },
  {
    question: 'Is the shortened address still valid?',
    answer: 'No, shortened addresses are for display purposes only. Always use the full address for transactions to avoid sending funds to the wrong address.',
  },
  {
    question: 'What is the standard format?',
    answer: 'The most common format shows 6 characters at the start and 4 at the end (e.g., 0x742d...fE21). This provides enough uniqueness while being compact.',
  },
  {
    question: 'How do I verify an address?',
    answer: 'Always compare multiple characters from both the beginning and end of an address. Never rely solely on a shortened version for verification.',
  },
];

const relatedTools = [
  { href: '/calculators/crypto/hash-generator', title: 'Hash Generator', description: 'Generate SHA-256 and Keccak-256 hashes.' },
  { href: '/calculators/crypto/ethereum-unit-converter', title: 'ETH Unit Converter', description: 'Convert between Wei, Gwei, and Ether.' },
  { href: '/calculators/crypto/gas-fee-converter', title: 'Gas Fee Converter', description: 'Calculate Ethereum transaction costs.' },
];

export default function AddressShortenerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="address-shortener"
          title="Address Shortener"
          description="Shorten blockchain addresses for display in the 0x123...abc format. Supports Ethereum, Bitcoin, and Solana addresses."
          colorClass="bg-blue-100 text-blue-600"
          category="Crypto"
        />

        <section aria-label="Address Shortener">
          <AddressShortener />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
