import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
    title: 'Real Estate Investing Calculators',
    description: 'Free real estate investing calculators: cap rate, cash-on-cash return, Airbnb profit, BRRRR, closing costs, and more.',
};

export default function RealEstateCalculatorsPage() {
    return (
        <CategoryPageLayout
            categoryId="realestate"
            title="Real Estate Investing Calculators"
            description="Advanced tools for real estate investors. Evaluate deals, estimate returns, and plan your investment strategy."
        />
    );
}
