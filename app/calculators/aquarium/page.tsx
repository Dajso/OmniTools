import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
    title: 'Aquarium & Terrarium Calculators',
    description: 'Free online aquarium calculators for tank volume, substrate, CO2, salt mix, heater wattage, stocking levels, fertilizer dosing, and more.',
};

export default function AquariumCalculatorsPage() {
    return (
        <CategoryPageLayout
            categoryId="aquarium"
            title="Aquarium & Terrarium Calculators"
            description="Essential aquarium and terrarium calculation tools. Calculate tank volume, substrate needs, CO2 levels, heater sizing, fish stocking, fertilizer dosing, and more."
        />
    );
}
