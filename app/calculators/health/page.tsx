import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Heart } from 'lucide-react';
import { getToolsByCategory } from '@/lib/constants/tool-registry';
import { getToolIcon } from '@/lib/constants/tool-icons';

export const metadata: Metadata = {
  title: 'Health & Fitness Calculators',
  description: 'Free online health and fitness calculators for BMI, calories, nutrition, and wellness. Track your health goals with our easy-to-use tools.',
};

export default function HealthCalculatorsPage() {
  const tools = getToolsByCategory('health');

  return (
    <main className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <Heart className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Health & Fitness Calculators</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Track your health and fitness goals with our comprehensive collection of calculators. 
            From BMI to nutrition, we help you stay on track.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = getToolIcon(tool.id);
            return (
              <Link
                key={tool.id}
                href={tool.path}
                className="group flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 hover:shadow-md hover:ring-red-200 transition-all"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
                  <Icon className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                    {tool.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{tool.description}</p>
                  <div className="mt-2 inline-flex items-center text-sm text-red-600">
                    Use Calculator <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
