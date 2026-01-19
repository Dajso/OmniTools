import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Crafts & Sewing Calculators',
  description: 'Free online crafting calculators for fabric yardage, knitting gauge, quilt binding, crochet sizing, and more sewing tools.',
};

export default function CraftsCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="crafts"
      title="Crafts & Sewing Calculators"
      description="Essential crafting calculation tools for sewers, knitters, and quilters. Calculate fabric yardage, knitting gauge, quilt binding, yarn substitutions, and plan your creative projects."
    />
  );
}
