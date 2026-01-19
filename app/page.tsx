import Link from 'next/link';
import {
  Heart,
  Home as HomeIcon,
  ArrowRightLeft,
  Zap,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Search,
  GraduationCap,
  Music,
  Car,
  Trophy,
  Hammer,
  Scissors,
  Briefcase,
  Bitcoin,
  Cpu,
  Gamepad2,
  Flower2,
  Camera,
  Atom,
  Dice5,
  BarChart3,
  Clock,
  Plane,
  Smile
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { toolRegistry, getFeaturedTools, getToolsByCategory } from '@/lib/constants/tool-registry';
import { getToolIcon } from '@/lib/constants/tool-icons';
import { FavoritesSection } from '@/components/layout/favorites-section';

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
  },
  {
    name: 'Health & Fitness',
    description: 'BMI, calories, nutrition & wellness',
    icon: Heart,
    href: '/calculators/health',
    color: 'bg-rose-50 text-rose-600 ring-1 ring-rose-200',
    hoverColor: 'hover:bg-rose-50',
  },
  {
    name: 'Home & DIY',
    description: 'Paint, concrete, flooring & projects',
    icon: HomeIcon,
    href: '/calculators/home',
    color: 'bg-amber-50 text-amber-600 ring-1 ring-amber-200',
    hoverColor: 'hover:bg-amber-50',
  },
  {
    name: 'Unit Converters',
    description: 'Length, weight, temperature & more',
    icon: ArrowRightLeft,
    href: '/convert',
    color: 'bg-sky-50 text-sky-600 ring-1 ring-sky-200',
    hoverColor: 'hover:bg-sky-50',
  },
  {
    name: 'Productivity',
    description: 'Text tools, generators & utilities',
    icon: Zap,
    href: '/calculators/productivity',
    color: 'bg-violet-50 text-violet-600 ring-1 ring-violet-200',
    hoverColor: 'hover:bg-violet-50',
  },
  {
    name: 'Academic',
    description: 'GPA, grades, fractions & study tools',
    icon: GraduationCap,
    href: '/calculators/academic',
    color: 'bg-blue-50 text-blue-600 ring-1 ring-blue-200',
    hoverColor: 'hover:bg-blue-50',
  },
  {
    name: 'Audio & Music',
    description: 'BPM, tuner, frequency & audio',
    icon: Music,
    href: '/calculators/audio',
    color: 'bg-pink-50 text-pink-600 ring-1 ring-pink-200',
    hoverColor: 'hover:bg-pink-50',
  },
  {
    name: 'Auto',
    description: 'Tire, fuel, EV charging & more',
    icon: Car,
    href: '/calculators/auto',
    color: 'bg-slate-50 text-slate-600 ring-1 ring-slate-200',
    hoverColor: 'hover:bg-slate-50',
  },
  {
    name: 'Betting',
    description: 'Odds, parlay & arbitrage',
    icon: Trophy,
    href: '/calculators/betting',
    color: 'bg-yellow-50 text-yellow-600 ring-1 ring-yellow-200',
    hoverColor: 'hover:bg-yellow-50',
  },
  {
    name: 'Construction',
    description: 'Board foot, crown molding & more',
    icon: Hammer,
    href: '/calculators/construction',
    color: 'bg-orange-50 text-orange-600 ring-1 ring-orange-200',
    hoverColor: 'hover:bg-orange-50',
  },
  {
    name: 'Crafts & Sewing',
    description: 'Fabric, knitting & quilting',
    icon: Scissors,
    href: '/calculators/crafts',
    color: 'bg-fuchsia-50 text-fuchsia-600 ring-1 ring-fuchsia-200',
    hoverColor: 'hover:bg-fuchsia-50',
  },
  {
    name: 'Creator',
    description: 'Invoices, signatures & social media',
    icon: Briefcase,
    href: '/calculators/creator',
    color: 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200',
    hoverColor: 'hover:bg-indigo-50',
  },
  {
    name: 'Crypto',
    description: 'Gas fees, ETH units & hashing',
    icon: Bitcoin,
    href: '/calculators/crypto',
    color: 'bg-orange-50 text-orange-600 ring-1 ring-orange-200',
    hoverColor: 'hover:bg-orange-50',
  },
  {
    name: 'Electronics',
    description: 'Resistors, Ohm\'s law & circuits',
    icon: Cpu,
    href: '/calculators/electronics',
    color: 'bg-cyan-50 text-cyan-600 ring-1 ring-cyan-200',
    hoverColor: 'hover:bg-cyan-50',
  },
  {
    name: 'Fun & Lifestyle',
    description: 'Love test, moon phase & more',
    icon: Smile,
    href: '/calculators/fun',
    color: 'bg-pink-50 text-pink-600 ring-1 ring-pink-200',
    hoverColor: 'hover:bg-pink-50',
  },
  {
    name: 'Gaming',
    description: 'Mouse sensitivity & reaction time',
    icon: Gamepad2,
    href: '/calculators/gaming',
    color: 'bg-purple-50 text-purple-600 ring-1 ring-purple-200',
    hoverColor: 'hover:bg-purple-50',
  },
  {
    name: 'Garden',
    description: 'Mulch, spacing & hardiness zones',
    icon: Flower2,
    href: '/calculators/garden',
    color: 'bg-green-50 text-green-600 ring-1 ring-green-200',
    hoverColor: 'hover:bg-green-50',
  },
  {
    name: 'Photo & Video',
    description: 'DOF, golden hour & aspect ratio',
    icon: Camera,
    href: '/calculators/photo',
    color: 'bg-gray-50 text-gray-600 ring-1 ring-gray-200',
    hoverColor: 'hover:bg-gray-50',
  },
  {
    name: 'Physics',
    description: 'Projectile motion, energy & density',
    icon: Atom,
    href: '/calculators/physics',
    color: 'bg-teal-50 text-teal-600 ring-1 ring-teal-200',
    hoverColor: 'hover:bg-teal-50',
  },
  {
    name: 'RPG & Tabletop',
    description: 'Dice roller, names & encounters',
    icon: Dice5,
    href: '/calculators/rpg',
    color: 'bg-red-50 text-red-600 ring-1 ring-red-200',
    hoverColor: 'hover:bg-red-50',
  },
  {
    name: 'Statistics',
    description: 'Standard deviation, A/B test & more',
    icon: BarChart3,
    href: '/calculators/stats',
    color: 'bg-blue-50 text-blue-600 ring-1 ring-blue-200',
    hoverColor: 'hover:bg-blue-50',
  },
  {
    name: 'Time & Date',
    description: 'Business days, age & calendars',
    icon: Clock,
    href: '/calculators/time',
    color: 'bg-lime-50 text-lime-600 ring-1 ring-lime-200',
    hoverColor: 'hover:bg-lime-50',
  },
  {
    name: 'Travel',
    description: 'Schengen, timezone & currency',
    icon: Plane,
    href: '/calculators/travel',
    color: 'bg-sky-50 text-sky-600 ring-1 ring-sky-200',
    hoverColor: 'hover:bg-sky-50',
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
  'tip-calculator',
  'password-generator',
  'square-footage-calculator',
  'concrete-calculator',
  'love-compatibility',
  'dice-roller',
];

export default function Home() {
  const featuredTools = getFeaturedTools().slice(0, 16);


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
              <div className="text-2xl font-bold text-blue-600 sm:text-3xl">{categories.length}</div>
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

      {/* Favorites Section - 用户收藏的工具 */}
      <FavoritesSection />

      {/* Categories Section - 优化卡片设计 */}
      <section id="categories" className="bg-gray-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Browse by Category</h2>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">Find the perfect tool for your needs</p>
          </div>

          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
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

          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
