import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Academic Calculators',
  description: 'Free online academic calculators for GPA, grades, fractions, scientific notation, and study tools.',
};

export default function AcademicCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="academic"
      title="Academic Calculators"
      description="Essential academic calculation tools for students and educators. Calculate GPA, final grades, fractions, scientific notation, and enhance your study efficiency."
    />
  );
}
