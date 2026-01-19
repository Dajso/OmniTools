import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'RPG & Tabletop Calculators',
  description: 'Free online RPG calculators for dice rolling, character stats, encounter balancing, loot generation, and more tabletop gaming tools.',
};

export default function RpgCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="rpg"
      title="RPG & Tabletop Calculators"
      description="Essential tabletop gaming tools for dungeon masters and players. Roll dice, generate character stats, balance encounters, create loot tables, and enhance your tabletop adventures."
    />
  );
}
