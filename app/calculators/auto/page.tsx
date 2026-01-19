import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Automotive Calculators',
  description: 'Free online automotive calculators for tire size comparison, wheel offset, horsepower conversion, fuel consumption, car loans, EV charging time, and more.',
};

export default function AutoCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="auto"
      title="Automotive Calculators"
      description="Essential automotive calculation tools for car enthusiasts and owners. Plan modifications and maintenance with tire calculators, wheel offset tools, fuel consumption converters, and more automotive utilities."
    />
  );
}
