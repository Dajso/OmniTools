import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Physics Calculators',
  description: 'Free online physics calculators for projectile motion, kinetic energy, density, pressure, torque, and more.',
};

export default function PhysicsCalculatorsPage() {
  return (
    <CategoryPageLayout
      categoryId="physics"
      title="Physics Calculators"
      description="Essential physics calculation tools for students and enthusiasts. Calculate projectile motion, kinetic energy, density, pressure, torque, speed of sound, and explore physics concepts."
    />
  );
}
