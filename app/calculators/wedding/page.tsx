import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
    title: 'Wedding & Event Planning Calculators',
    description: 'Free wedding planning calculators: alcohol, cake, seating, budget, catering, tent size, and more.',
};

export default function WeddingCalculatorsPage() {
    return (
        <CategoryPageLayout
            categoryId="wedding"
            title="Wedding & Event Planning Calculators"
            description="Plan the perfect celebration. Calculate quantities, allocate budgets, and manage every detail."
        />
    );
}
