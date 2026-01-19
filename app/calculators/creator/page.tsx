import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Creator Economy & Small Business Calculators',
  description: 'Free online business calculators for invoices, privacy policies, QR codes, paycheck calculations, YouTube earnings, Instagram engagement, and more.',
};

export default function CreatorCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="creator"
      title="Creator Economy & Small Business Calculators"
      description="Essential business utilities for content creators and small business owners. Generate invoices, create legal documents, calculate earnings, and manage your business efficiently."
    />
  );
}
