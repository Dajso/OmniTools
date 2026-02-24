import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
    title: 'Baking & Food Science Calculators',
    description: 'Free baking calculators: sourdough hydration, baker\'s percentages, cake pan conversion, yeast conversion, chocolate tempering, and more.',
};

export default function BakingCalculatorsPage() {
    return (
        <CategoryPageLayout
            categoryId="baking"
            title="Baking & Food Science Calculators"
            description="Precision baking tools for serious bakers. Calculate hydration, convert recipes, scale pans, and more."
        />
    );
}
