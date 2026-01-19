import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Crypto & Web3 Calculators',
  description: 'Free online crypto calculators for gas fees, impermanent loss, Satoshi conversion, hash generation, NFT rarity, APY/APR conversion, and more.',
};

export default function CryptoCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="crypto"
      title="Crypto & Web3 Calculators"
      description="Essential crypto calculation tools for cryptocurrency users and DeFi investors. Calculate gas fees, impermanent loss, convert units, generate hashes, and manage your digital assets effectively."
    />
  );
}
