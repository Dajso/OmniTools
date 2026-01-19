import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Electronics Calculators',
  description: 'Free online electronics calculators for resistor color codes, Ohm\'s law, LED resistors, voltage dividers, capacitor codes, PCB traces, and more.',
};

export default function ElectronicsCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="electronics"
      title="Electronics Calculators"
      description="Essential electronics calculation tools for hobbyists and engineers. Calculate resistor values, Ohm's law, LED resistors, voltage dividers, capacitor codes, and PCB trace widths."
    />
  );
}
