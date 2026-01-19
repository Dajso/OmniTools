import { Metadata } from 'next';
import { SatoshiConverter } from '@/components/calculators/crypto';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Satoshi to USD Converter - Bitcoin Unit Calculator',
  description: 'Convert between Satoshis, Bitcoin, and USD. Calculate the value of any amount of sats in dollars with current BTC prices.',
  keywords: ['satoshi converter', 'sats to usd', 'bitcoin calculator', 'satoshi to dollar', 'btc converter'],
  alternates: { canonical: '/calculators/crypto/satoshi-converter' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Satoshi to USD Converter',
  description: 'Convert between Satoshis, Bitcoin, and USD',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select conversion mode', text: 'Choose whether to convert from Satoshis, Bitcoin, or USD.' },
  { name: 'Enter amount', text: 'Input the amount you want to convert.' },
  { name: 'Set BTC price', text: 'Enter the current Bitcoin price in USD.' },
  { name: 'View conversions', text: 'See the equivalent values in all Bitcoin denominations.' },
];

const faqs = [
  {
    question: 'What is a Satoshi?',
    answer: 'A Satoshi (sat) is the smallest unit of Bitcoin, equal to 0.00000001 BTC. It is named after Bitcoin\'s pseudonymous creator, Satoshi Nakamoto.',
  },
  {
    question: 'How many Satoshis are in one Bitcoin?',
    answer: 'There are 100,000,000 (100 million) Satoshis in one Bitcoin. This allows for very small transactions and precise pricing.',
  },
  {
    question: 'Why use Satoshis instead of Bitcoin?',
    answer: 'As Bitcoin\'s price increases, using Satoshis makes everyday transactions more intuitive. It\'s easier to say "1000 sats" than "0.00001 BTC".',
  },
  {
    question: 'What are mBTC and bits?',
    answer: 'mBTC (millibitcoin) equals 0.001 BTC or 100,000 sats. Bits (microbitcoin) equals 0.000001 BTC or 100 sats. These are intermediate denominations.',
  },
  {
    question: 'Can I buy fractions of a Bitcoin?',
    answer: 'Yes! You can buy any amount of Bitcoin, down to a single Satoshi. Most exchanges allow purchases starting from just a few dollars.',
  },
];

const relatedTools = [
  { href: '/calculators/crypto/ethereum-unit-converter', title: 'ETH Unit Converter', description: 'Convert between Wei, Gwei, and Ether.' },
  { href: '/calculators/finance/crypto-profit-loss', title: 'Crypto Profit/Loss', description: 'Calculate cryptocurrency gains.' },
  { href: '/calculators/crypto/gas-fee-converter', title: 'Gas Fee Converter', description: 'Calculate Ethereum transaction costs.' },
];

export default function SatoshiConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="satoshi-converter"
          title="Satoshi to USD Converter"
          description="Convert between Satoshis, Bitcoin, and USD. Calculate the dollar value of any amount of sats with current market prices."
          colorClass="bg-yellow-100 text-yellow-600"
          category="Crypto"
        />

        <section aria-label="Satoshi Converter">
          <SatoshiConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
