import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Travel Calculators',
  description: 'Free online travel calculators for Schengen visa, timezone planning, currency conversion, flight duration, and more.',
};

export default function TravelCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="travel"
      title="Travel Calculators"
      description="Essential travel calculation tools for globetrotters. Track Schengen visa days, plan meetings across timezones, convert currencies, estimate flight durations, and organize your trips."
    />
  );
}
