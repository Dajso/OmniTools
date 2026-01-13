import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ArrowRightLeft } from 'lucide-react';
import { getToolsByCategory } from '@/lib/constants/tool-registry';
import { getToolIcon } from '@/lib/constants/tool-icons';

export const metadata: Metadata = {
  title: 'Unit Converters',
  description: 'Free online unit converters for length, weight, temperature, volume, and more. Convert between units instantly with our easy-to-use tools.',
};

const converterCategories = [
  { name: 'Length', href: '/convert/meter-to-foot', examples: ['Meters ↔ Feet', 'CM ↔ Inches', 'KM ↔ Miles'] },
  { name: 'Weight', href: '/convert/kilogram-to-pound', examples: ['KG ↔ Pounds', 'Grams ↔ Ounces', 'Stones ↔ KG'] },
  { name: 'Temperature', href: '/convert/celsius-to-fahrenheit', examples: ['Celsius ↔ Fahrenheit', 'Kelvin ↔ Celsius'] },
  { name: 'Volume', href: '/convert/liter-to-gallon', examples: ['Liters ↔ Gallons', 'ML ↔ Cups', 'Fluid Oz ↔ ML'] },
  { name: 'Area', href: '/convert/squareFoot-to-squareMeter', examples: ['Sq Ft ↔ Sq M', 'Acres ↔ Hectares'] },
  { name: 'Speed', href: '/convert/milePerHour-to-kilometerPerHour', examples: ['MPH ↔ KM/H', 'Knots ↔ MPH'] },
  { name: 'Data', href: '/convert/megabyte-to-gigabyte', examples: ['MB ↔ GB', 'KB ↔ MB', 'TB ↔ GB'] },
  { name: 'Time', href: '/convert/hour-to-minute', examples: ['Hours ↔ Minutes', 'Days ↔ Hours'] },
];

export default function ConvertersPage() {
  const tools = getToolsByCategory('converter');

  return (
    <main className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <ArrowRightLeft className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Unit Converters</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Convert between units instantly with our comprehensive collection of converters. 
            Length, weight, temperature, and more.
          </p>
        </div>

        {/* Converter Categories */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {converterCategories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 hover:shadow-md hover:ring-blue-200 transition-all"
            >
              <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h2>
              <div className="mt-2 space-y-1">
                {category.examples.map((example) => (
                  <p key={example} className="text-sm text-gray-500">{example}</p>
                ))}
              </div>
              <div className="mt-3 inline-flex items-center text-sm text-blue-600">
                Convert <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* All Converters */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Converters</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = getToolIcon(tool.id);
            return (
              <Link
                key={tool.id}
                href={tool.path}
                className="group flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 hover:shadow-md hover:ring-blue-200 transition-all"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{tool.description}</p>
                  <div className="mt-2 inline-flex items-center text-sm text-blue-600">
                    Use Converter <ChevronRight className="h-4 w-4 ml-1" />
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
