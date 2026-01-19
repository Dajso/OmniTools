import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Photo & Video Calculators',
  description: 'Free online photography calculators for depth of field, golden hour, aspect ratio, timelapse, ND filters, and more.',
};

export default function PhotoCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="photo"
      title="Photo & Video Calculators"
      description="Essential photography and videography calculation tools. Calculate depth of field, golden hour times, aspect ratios, timelapse settings, ND filter exposure, and enhance your visual content."
    />
  );
}
