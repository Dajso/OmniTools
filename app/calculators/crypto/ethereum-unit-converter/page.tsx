import { Metadata } from 'next';
import { EthereumUnitConverter } from '@/components/calculators/crypto';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Ethereum Unit Converter - Wei, Gwei, Ether Calculator',
  description: 'Convert between Ethereum units including Wei, Gwei, and Ether. Handle 18 decimal precision for accurate cryptocurrency calculations.',
  keywords: ['ethereum converter', 'wei to ether', 'gwei converter', 'eth units', 'wei calculator', 'crypto converter'],
  alternates: { canonical: '/calculators/crypto/ethereum-unit-converter' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Ethereum Unit Converter',
  description: 'Convert between Ethereum units (Wei, Gwei, Ether)',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter amount', text: 'Input the value you want to convert.' },
  { name: 'Select source unit', text: 'Choose the unit you are converting from (Wei, Gwei, Ether, etc.).' },
  { name: 'Select target unit', text: 'Choose the unit you want to convert to.' },
  { name: 'View all conversions', text: 'See the value in all Ethereum denominations.' },
];

const faqs = [
  {
    question: 'What is Wei?',
    answer: 'Wei is the smallest denomination of Ether, named after Wei Dai. 1 Ether = 10^18 Wei. It is used for precise calculations in smart contracts.',
  },
  {
    question: 'What is Gwei?',
    answer: 'Gwei (Gigawei) equals 10^9 Wei or 0.000000001 Ether. It is commonly used to express gas prices on the Ethereum network.',
  },
  {
    question: 'Why does Ethereum use 18 decimals?',
    answer: 'Ethereum uses 18 decimal places to allow for very small fractions of Ether to be used in transactions and smart contracts, enabling micropayments and precise calculations.',
  },
  {
    question: 'What are Szabo and Finney?',
    answer: 'Szabo (10^12 Wei) and Finney (10^15 Wei) are intermediate denominations named after cryptographers Nick Szabo and Hal Finney. They are less commonly used than Gwei.',
  },
  {
    question: 'How do I convert gas prices?',
    answer: 'Gas prices are typically quoted in Gwei. To find the cost in Ether, multiply the gas price (Gwei) by the gas limit, then convert to Ether by dividing by 10^9.',
  },
];

const relatedTools = [
  { href: '/calculators/crypto/gas-fee-converter', title: 'Gas Fee Converter', description: 'Calculate Ethereum transaction costs.' },
  { href: '/calculators/crypto/satoshi-converter', title: 'Satoshi Converter', description: 'Convert Bitcoin units.' },
  { href: '/calculators/crypto/impermanent-loss-calculator', title: 'Impermanent Loss Calculator', description: 'Calculate DeFi liquidity pool losses.' },
];

export default function EthereumUnitConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="ethereum-unit-converter"
          title="Ethereum Unit Converter"
          description="Convert between Ethereum units including Wei, Gwei, and Ether. Handle 18 decimal precision for accurate cryptocurrency calculations."
          colorClass="bg-indigo-100 text-indigo-600"
          category="Crypto"
        />

        <section aria-label="Ethereum Unit Converter">
          <EthereumUnitConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
