import Link from 'next/link';
import { 
  Heart, 
  Home as HomeIcon, 
  ArrowRightLeft, 
  Zap,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Search
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { toolRegistry, getFeaturedTools, getToolsByCategory } from '@/lib/constants/tool-registry';
import { getToolIcon } from '@/lib/constants/tool-icons';

// 动态获取工具总数
const totalTools = Object.keys(toolRegistry).length;

const categories = [
  {
    name: 'Finance',
    description: 'Mortgage, investments, taxes & more',
    icon: TrendingUp,
    href: '/calculators/finance',
    color: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200',
    hoverColor: 'hover:bg-emerald-50',
    tools: ['mortgage-calculator', 'compound-interest-calculator', 'tip-calculator', 'roi-calculator'],
  },
  {
    name: 'Health & Fitness',
    description: 'BMI, calories, nutrition & wellness',
    icon: Heart,
    href: '/calculators/health',
    color: 'bg-rose-50 text-rose-600 ring-1 ring-rose-200',
    hoverColor: 'hover:bg-rose-50',
    tools: ['bmi-calculator', 'tdee-calculator', 'macro-calculator', 'water-intake-calculator'],
  },
  {
    name: 'Home & DIY',
    description: 'Paint, concrete, flooring & projects',
    icon: HomeIcon,
    href: '/calculators/home',
    color: 'bg-amber-50 text-amber-600 ring-1 ring-amber-200',
    hoverColor: 'hover:bg-amber-50',
    tools: ['paint-calculator', 'concrete-calculator', 'tile-calculator', 'square-footage-calculator'],
  },
  {
    name: 'Unit Converters',
    description: 'Length, weight, temperature & more',
    icon: ArrowRightLeft,
    href: '/convert/meters-to-feet',
    color: 'bg-sky-50 text-sky-600 ring-1 ring-sky-200',
    hoverColor: 'hover:bg-sky-50',
    tools: ['length-converter', 'weight-converter', 'temperature-converter', 'volume-converter'],
  },
  {
    name: 'Productivity',
    description: 'Text tools, generators & utilities',
    icon: Zap,
    href: '/calculators/productivity',
    color: 'bg-violet-50 text-violet-600 ring-1 ring-violet-200',
    hoverColor: 'hover:bg-violet-50',
    tools: ['word-counter', 'password-generator', 'json-formatter', 'uuid-generator'],
  },
];

// 热门工具 - 使用动态图标
const popularToolIds = [
  'mortgage-calculator',
  'bmi-calculator', 
  'paint-calculator',
  'word-counter',
  'compound-interest-calculator',
  'tdee-calculator',
];

export default function Home() {
  const featuredTools = getFeaturedTools().slice(0, 8);

  return (
    <main className="flex flex-col">
      {/* Hero Section - 更简洁的设计 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.06),transparent_50%)]"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="flex justify-center mb-5">
              <div className="relative">
                <Logo className="h-16 w-16 text-blue-600" />
                <div className="absolute -inset-2 bg-blue-100 rounded-full -z-10 opacity-50"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              Your All-in-One{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Toolkit</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-600 sm:text-lg">
              {totalTools}+ free calculators and converters. Fast, accurate, and easy to use.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="#categories"
                className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-all hover:shadow-md"
              >
                Explore Tools
              </Link>
              <Link
                href="#popular"
                className="group rounded-full bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 hover:ring-blue-200 hover:text-blue-600 transition-all"
              >
                <span className="flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5" />
                  Quick Search
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - 更紧凑 */}
      <section className="bg-white py-8 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 sm:text-3xl">{totalTools}+</div>
              <div className="mt-0.5 text-xs text-gray-500 sm:text-sm">Free Tools</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 sm:text-3xl">5</div>
              <div className="mt-0.5 text-xs text-gray-500 sm:text-sm">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 sm:text-3xl">100%</div>
              <div className="mt-0.5 text-xs text-gray-500 sm:text-sm">Free Forever</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 sm:text-3xl">0</div>
              <div className="mt-0.5 text-xs text-gray-500 sm:text-sm">Ads</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - 优化卡片设计 */}
      <section id="categories" className="bg-gray-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Browse by Category</h2>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">Find the perfect tool for your needs</p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`group relative rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 hover:shadow-md hover:ring-blue-100 transition-all ${category.hoverColor}`}
              >
                <div className={`inline-flex rounded-lg p-2.5 ${category.color}`}>
                  <category.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">{category.description}</p>
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools Section - 优化布局 */}
      <section id="popular" className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200 mb-3">
              <Sparkles className="h-3 w-3" />
              Most Popular
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Popular Tools</h2>
            <p className="mt-2 text-gray-600 text-sm">The tools our users love the most</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popularToolIds.map((id) => {
              const tool = toolRegistry[id];
              if (!tool) return null;
              const Icon = getToolIcon(id);
              return (
                <Link
                  key={id}
                  href={tool.path}
                  className="group flex items-center gap-3 rounded-lg bg-gray-50/80 p-3.5 hover:bg-blue-50 ring-1 ring-gray-100 hover:ring-blue-200 transition-all"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-gray-100 group-hover:ring-blue-200 group-hover:shadow transition-all">
                    <Icon className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{tool.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Tools Grid - 优化卡片 */}
      <section className="bg-gray-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Featured Tools</h2>
            <p className="mt-2 text-gray-600 text-sm">Hand-picked tools to get you started</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {featuredTools.map((tool) => {
              const Icon = getToolIcon(tool.id);
              return (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="group rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-100 hover:shadow-md hover:ring-blue-200 transition-all"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 group-hover:bg-blue-100 transition-colors">
                      <Icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {tool.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{tool.description}</p>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/calculators/finance"
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View all {totalTools}+ tools <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - 更简洁 */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Ready to simplify your calculations?
          </h2>
          <p className="mt-2 text-blue-100 text-sm">
            All tools are free, no signup required.
          </p>
          <div className="mt-5">
            <Link
              href="/calculators/finance/mortgage-calculator"
              className="inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50 transition-colors"
            >
              Try Mortgage Calculator
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
