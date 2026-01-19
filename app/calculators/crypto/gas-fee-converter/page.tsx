import { Metadata } from 'next';
import { GasFeeConverter } from '@/components/calculators/crypto';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Gas Fee Converter - Ethereum Gas Calculator',
  description: 'Calculate Ethereum gas fees and convert between Gwei and USD. Estimate transaction costs for ETH transfers, token swaps, and smart contract interactions.',
  keywords: ['gas fee calculator', 'ethereum gas', 'gwei to usd', 'eth gas price', 'transaction fee', 'crypto gas'],
  alternates: { canonical: '/calculators/crypto/gas-fee-converter' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Gas Fee Converter',
  description: 'Calculate Ethereum gas fees and convert between Gwei and USD',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter gas price', text: 'Input the current gas price in Gwei (check Etherscan for current prices).' },
  { name: 'Select transaction type', text: 'Choose a common transaction type or enter a custom gas limit.' },
  { name: 'Enter ETH price', text: 'Input the current ETH price in USD for accurate cost calculation.' },
  { name: 'View results', text: 'See your transaction cost in USD, ETH, and Gwei.' },
];

const faqs = [
  {
    question: 'What is gas in Ethereum?',
    answer: 'Gas is the unit that measures the computational effort required to execute operations on the Ethereum network. Every transaction requires gas, and users pay for gas in ETH.',
  },
  {
    question: 'What is Gwei?',
    answer: 'Gwei is a denomination of ETH (1 ETH = 1,000,000,000 Gwei). Gas prices are typically quoted in Gwei because the amounts are more readable than tiny fractions of ETH.',
  },
  {
    question: 'Why do gas prices fluctuate?',
    answer: 'Gas prices are determined by supply and demand on the network. When many users want to make transactions, gas prices increase. During low activity periods, prices decrease.',
  },
  {
    question: 'What is gas limit?',
    answer: 'Gas limit is the maximum amount of gas you are willing to spend on a transaction. Simple ETH transfers use 21,000 gas, while complex smart contract interactions may use much more.',
  },
  {
    question: 'How can I save on gas fees?',
    answer: 'You can save on gas by transacting during low-activity periods (weekends, late nights), using Layer 2 solutions, or waiting for network congestion to decrease.',
  },
];

const relatedTools = [
  { href: '/calculators/crypto/ethereum-unit-converter', title: 'ETH Unit Converter', description: 'Convert between Wei, Gwei, and Ether.' },
  { href: '/calculators/crypto/impermanent-loss-calculator', title: 'Impermanent Loss Calculator', description: 'Calculate DeFi liquidity pool losses.' },
  { href: '/calculators/finance/crypto-profit-loss', title: 'Crypto Profit/Loss', description: 'Calculate cryptocurrency gains.' },
];

export default function GasFeeConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="gas-fee-converter"
          title="Gas Fee Converter"
          description="Calculate Ethereum gas fees and convert between Gwei and USD. Estimate transaction costs for different types of blockchain operations."
          colorClass="bg-orange-100 text-orange-600"
          category="Crypto"
        />

        <section aria-label="Gas Fee Converter">
          <GasFeeConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
