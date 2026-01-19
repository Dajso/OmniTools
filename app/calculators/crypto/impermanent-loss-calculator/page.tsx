import { Metadata } from 'next';
import { ImpermanentLossCalculator } from '@/components/calculators/crypto';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Impermanent Loss Calculator - DeFi LP Calculator',
  description: 'Calculate impermanent loss for DeFi liquidity pool positions. Understand the risks of providing liquidity on Uniswap, SushiSwap, and other AMMs.',
  keywords: ['impermanent loss', 'liquidity pool', 'DeFi calculator', 'AMM', 'Uniswap', 'yield farming'],
  alternates: { canonical: '/calculators/crypto/impermanent-loss-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Impermanent Loss Calculator',
  description: 'Calculate impermanent loss for DeFi liquidity pool positions',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter investment', text: 'Input your total initial investment in USD.' },
  { name: 'Set initial price', text: 'Enter the token price when you provided liquidity.' },
  { name: 'Set current price', text: 'Enter the current token price.' },
  { name: 'View impermanent loss', text: 'See your impermanent loss percentage and dollar amount.' },
];

const faqs = [
  {
    question: 'What is impermanent loss?',
    answer: 'Impermanent loss occurs when the price ratio of tokens in a liquidity pool changes compared to when you deposited them. The greater the price change, the more impermanent loss you experience.',
  },
  {
    question: 'Why is it called "impermanent"?',
    answer: 'It is called impermanent because the loss only becomes permanent when you withdraw your liquidity. If prices return to their original ratio, the loss disappears.',
  },
  {
    question: 'Can impermanent loss be offset?',
    answer: 'Yes, trading fees and liquidity mining rewards can offset impermanent loss. Many LPs remain profitable despite impermanent loss due to these additional earnings.',
  },
  {
    question: 'Which pools have the least impermanent loss?',
    answer: 'Stablecoin pairs (like USDC/USDT) have minimal impermanent loss since their prices stay close to each other. Correlated asset pairs also experience less IL.',
  },
  {
    question: 'How is impermanent loss calculated?',
    answer: 'IL = 2 × √(price_ratio) / (1 + price_ratio) - 1, where price_ratio is the current price divided by the initial price. A 2x price change results in about 5.7% IL.',
  },
];

const relatedTools = [
  { href: '/calculators/crypto/apy-apr-converter', title: 'APY/APR Converter', description: 'Convert between APY and APR for yield calculations.' },
  { href: '/calculators/crypto/gas-fee-converter', title: 'Gas Fee Converter', description: 'Calculate Ethereum transaction costs.' },
  { href: '/calculators/finance/crypto-profit-loss', title: 'Crypto Profit/Loss', description: 'Calculate cryptocurrency gains.' },
];

export default function ImpermanentLossCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="impermanent-loss-calculator"
          title="Impermanent Loss Calculator"
          description="Calculate impermanent loss for DeFi liquidity pool positions. Understand the risks before providing liquidity on decentralized exchanges."
          colorClass="bg-purple-100 text-purple-600"
          category="Crypto"
        />

        <section aria-label="Impermanent Loss Calculator">
          <ImpermanentLossCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
