import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Zap } from 'lucide-react';
import { getToolsByCategory } from '@/lib/constants/tool-registry';
import { getToolIcon } from '@/lib/constants/tool-icons';

export const metadata: Metadata = {
  title: 'Productivity Tools',
  description: 'Free online productivity tools including text utilities, generators, converters, and more. Boost your workflow with our easy-to-use tools.',
};

export default function ProductivityToolsPage() {
  const tools = getToolsByCategory('productivity');

  return (
    <main className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
            <Zap className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Productivity Tools</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Boost your productivity with our collection of text tools, generators, and utilities. 
            From word counting to password generation, we&apos;ve got you covered.
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
                className="group flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 hover:shadow-md hover:ring-purple-200 transition-all"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors">
                  <Icon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {tool.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{tool.description}</p>
                  <div className="mt-2 inline-flex items-center text-sm text-purple-600">
                    Use Tool <ChevronRight className="h-4 w-4 ml-1" />
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
