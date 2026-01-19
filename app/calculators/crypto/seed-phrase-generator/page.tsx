import { Metadata } from 'next';
import { SeedPhraseGenerator } from '@/components/calculators/crypto';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Seed Phrase Generator - BIP-39 Mnemonic Generator (Educational)',
  description: 'Educational tool for understanding BIP-39 seed phrase generation. Learn how cryptocurrency wallet recovery phrases work. NOT for real wallet use.',
  keywords: ['seed phrase generator', 'bip39', 'mnemonic phrase', 'crypto wallet', 'recovery phrase', 'educational'],
  alternates: { canonical: '/calculators/crypto/seed-phrase-generator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Seed Phrase Generator (Educational)',
  description: 'Educational tool for understanding BIP-39 seed phrase generation',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Read warnings', text: 'Understand that this is for educational purposes only.' },
  { name: 'Select word count', text: 'Choose 12, 15, 18, 21, or 24 words.' },
  { name: 'Acknowledge disclaimer', text: 'Confirm you understand the security implications.' },
  { name: 'Generate phrase', text: 'Click generate to create a sample seed phrase.' },
];

const faqs = [
  {
    question: 'What is a seed phrase?',
    answer: 'A seed phrase (also called recovery phrase or mnemonic) is a list of words that stores all the information needed to recover a cryptocurrency wallet. It is the master key to your funds.',
  },
  {
    question: 'Why should I NOT use this for a real wallet?',
    answer: 'Browser-based random number generation may not be cryptographically secure. For real wallets, always use official wallet software with hardware-based entropy sources.',
  },
  {
    question: 'What is BIP-39?',
    answer: 'BIP-39 is a Bitcoin Improvement Proposal that defines a standard for generating mnemonic seed phrases. It uses a wordlist of 2048 words and includes a checksum for error detection.',
  },
  {
    question: 'Why are there different word counts?',
    answer: 'More words = more entropy = more security. 12 words provide 128 bits of entropy, while 24 words provide 256 bits. Both are considered secure, but 24 words is recommended for large holdings.',
  },
  {
    question: 'How should I store a real seed phrase?',
    answer: 'Write it on paper or metal (for fire resistance), store in a secure location, never store digitally, never take photos, and consider splitting it across multiple locations.',
  },
];

const relatedTools = [
  { href: '/calculators/crypto/paper-wallet-generator', title: 'Paper Wallet Generator', description: 'Generate paper wallets for cold storage.' },
  { href: '/calculators/crypto/hash-generator', title: 'Hash Generator', description: 'Generate SHA-256 and Keccak-256 hashes.' },
  { href: '/calculators/productivity/password-generator', title: 'Password Generator', description: 'Generate secure passwords.' },
];

export default function SeedPhraseGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="seed-phrase-generator"
          title="Seed Phrase Generator"
          description="Educational tool for understanding BIP-39 seed phrase generation. Learn how cryptocurrency wallet recovery phrases work."
          colorClass="bg-red-100 text-red-600"
          category="Crypto"
        />

        <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-200 font-medium">
            ⚠️ Educational Tool Only - Do NOT use for real cryptocurrency wallets
          </p>
        </div>

        <section aria-label="Seed Phrase Generator">
          <SeedPhraseGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
