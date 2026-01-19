import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Audio & Music Calculators',
  description: 'Free online audio calculators for BPM, guitar tuning, note frequency, delay/reverb, and more music production tools.',
};

export default function AudioCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="audio"
      title="Audio & Music Calculators"
      description="Essential audio and music calculation tools for musicians and producers. Tap BPM, tune instruments, convert note frequencies, calculate delay times, and enhance your music production."
    />
  );
}
