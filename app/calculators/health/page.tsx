import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Health & Fitness Calculators',
  description: 'Free online health calculators for BMI, TDEE, macros, calories, body fat, sleep cycles, and more wellness tools.',
};

export default function HealthCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="health"
      title="Health & Fitness Calculators"
      description="Essential health and fitness calculation tools. Calculate BMI, TDEE, macronutrients, body fat percentage, sleep cycles, and track your wellness journey."
    />
  );
}
