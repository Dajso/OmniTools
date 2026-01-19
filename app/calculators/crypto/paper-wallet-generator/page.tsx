import { Metadata } from 'next';
import { PaperWalletGenerator } from '@/components/calculators/crypto';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Paper Wallet Generator - Cold Storage Demo (Educational)',
  description: 'Educational demonstration of paper wallet generation for cryptocurrency cold storage. Learn how paper wallets work. NOT for real use.',
  keywords: ['paper wallet', 'cold storage', 'crypto wallet', 'offline wallet', 'educational', 'bitcoin wallet'],
  alternates: { canonical: '/calculators/crypto/paper-wallet-generator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Paper Wallet Generator (Educational)',
  description: 'Educational demonstration of paper wallet generation',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Read warnings', text: 'Understand this is for educational purposes only.' },
  { name: 'Select wallet type', text: 'Choose Ethereum or Bitcoin.' },
  { name: 'Acknowledge disclaimer', text: 'Confirm you will not use this for real funds.' },
  { name: 'Generate wallet', text: 'Create a demo paper wallet to understand the concept.' },
];

const faqs = [
  {
    question: 'What is a paper wallet?',
    answer: 'A paper wallet is a physical document containing your cryptocurrency private key and public address. It is a form of cold storage that keeps your keys completely offline.',
  },
  {
    question: 'Why should I NOT use this tool for real crypto?',
    answer: 'Browser-based key generation is not secure. Malware, browser extensions, or compromised random number generators could expose your private keys. Always use dedicated hardware or air-gapped computers.',
  },
  {
    question: 'What is cold storage?',
    answer: 'Cold storage refers to keeping cryptocurrency private keys completely offline, disconnected from the internet. This protects against hacking and online theft.',
  },
  {
    question: 'How should real paper wallets be created?',
    answer: 'Use an air-gapped computer (never connected to internet), boot from a clean OS, use verified open-source software, and print on a non-networked printer.',
  },
  {
    question: 'What are better alternatives to paper wallets?',
    answer: 'Hardware wallets (Ledger, Trezor) provide better security with easier usability. They keep private keys in secure hardware and never expose them to your computer.',
  },
];

const relatedTools = [
  { href: '/calculators/crypto/seed-phrase-generator', title: 'Seed Phrase Generator', description: 'Learn about BIP-39 seed phrases.' },
  { href: '/calculators/crypto/hash-generator', title: 'Hash Generator', description: 'Generate cryptographic hashes.' },
  { href: '/calculators/crypto/address-shortener', title: 'Address Shortener', description: 'Shorten blockchain addresses.' },
];

export default function PaperWalletGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="paper-wallet-generator"
          title="Paper Wallet Generator"
          description="Educational demonstration of paper wallet generation for cryptocurrency cold storage. Learn how paper wallets work."
          colorClass="bg-red-100 text-red-600"
          category="Crypto"
        />

        <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-200 font-bold text-center">
            ⚠️ EDUCATIONAL TOOL ONLY - Do NOT use for real cryptocurrency ⚠️
          </p>
        </div>

        <section aria-label="Paper Wallet Generator">
          <PaperWalletGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
