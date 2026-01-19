import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Productivity Tools',
  description: 'Free online productivity tools for text processing, password generation, UUID creation, JSON formatting, and more.',
};

export default function ProductivityCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="productivity"
      title="Productivity Tools"
      description="Essential productivity and utility tools. Count words, generate passwords, create UUIDs, format JSON, convert text cases, and boost your workflow efficiency."
    />
  );
}
