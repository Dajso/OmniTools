import { Metadata } from 'next';
import { NFTRarityCalculator } from '@/components/calculators/crypto';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'NFT Rarity Calculator - Calculate NFT Trait Rarity',
  description: 'Calculate the rarity score of an NFT based on its traits. Determine how rare your NFT is within a collection using percentage-based rarity scoring.',
  keywords: ['nft rarity', 'nft calculator', 'trait rarity', 'nft score', 'rarity ranking', 'nft traits'],
  alternates: { canonical: '/calculators/crypto/nft-rarity-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'NFT Rarity Calculator',
  description: 'Calculate the rarity score of an NFT based on its traits',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter collection size', text: 'Input the total number of NFTs in the collection.' },
  { name: 'Add traits', text: 'Enter each trait name and how many NFTs have that trait.' },
  { name: 'Calculate rarity', text: 'View the rarity score and ranking for your NFT.' },
];

const faqs = [
  {
    question: 'How is NFT rarity calculated?',
    answer: 'Rarity is calculated by dividing 1 by the percentage of NFTs that have each trait. Traits that appear less frequently contribute more to the overall rarity score.',
  },
  {
    question: 'What makes an NFT rare?',
    answer: 'An NFT is considered rare when it has traits that appear in a small percentage of the collection. The fewer NFTs that share a trait, the rarer that trait is.',
  },
  {
    question: 'What do the rarity tiers mean?',
    answer: 'Common (low score), Uncommon, Rare, Epic, and Legendary (highest score). These tiers are based on the average rarity score across all traits.',
  },
  {
    question: 'Does rarity affect NFT value?',
    answer: 'Rarity is one factor that can influence NFT value, but it is not the only one. Art quality, artist reputation, utility, and market demand also play significant roles.',
  },
  {
    question: 'How do I find trait occurrence data?',
    answer: 'Most NFT marketplaces like OpenSea display trait rarity percentages. You can also find this data on rarity tools like Rarity.tools or HowRare.is.',
  },
];

const relatedTools = [
  { href: '/calculators/finance/crypto-profit-loss', title: 'Crypto Profit/Loss', description: 'Calculate cryptocurrency gains.' },
  { href: '/calculators/crypto/gas-fee-converter', title: 'Gas Fee Converter', description: 'Calculate Ethereum transaction costs.' },
  { href: '/calculators/crypto/ethereum-unit-converter', title: 'ETH Unit Converter', description: 'Convert between Wei, Gwei, and Ether.' },
];

export default function NFTRarityCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="nft-rarity-calculator"
          title="NFT Rarity Calculator"
          description="Calculate the rarity score of an NFT based on its traits. Determine how rare your NFT is within a collection."
          colorClass="bg-pink-100 text-pink-600"
          category="Crypto"
        />

        <section aria-label="NFT Rarity Calculator">
          <NFTRarityCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
