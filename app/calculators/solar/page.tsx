import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
    title: 'Solar & Off-Grid Calculators',
    description: 'Free online solar and off-grid calculators for panel tilt, battery bank sizing, inverter sizing, wire gauge, ROI, and more.',
};

export default function SolarCalculatorsPage() {
    return (
        <CategoryPageLayout
            categoryId="solar"
            title="Solar & Off-Grid Calculators"
            description="Essential calculators for solar energy and off-grid living. Calculate panel tilt angles, battery bank sizing, wire gauges, inverter sizing, ROI, and more."
        />
    );
}
