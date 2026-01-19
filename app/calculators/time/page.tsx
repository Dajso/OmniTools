import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Time & Date Calculators',
  description: 'Free online time calculators for business days, age calculation, week numbers, timezone differences, and more.',
};

export default function TimeCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="time"
      title="Time & Date Calculators"
      description="Essential time and date calculation tools. Calculate business days, precise age, week numbers, timezone differences, generate calendars, and manage your time effectively."
    />
  );
}
