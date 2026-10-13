import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { toolRegistry, getFeaturedTools } from '@/lib/constants/tool-registry';
import { categoryConfig } from '@/lib/constants/category-config';
import { getToolIcon } from '@/lib/constants/tool-icons';
import { FavoritesSection } from '@/components/layout/favorites-section';

// Antall verktøy hentes fra registeret
const totalTools = Object.keys(toolRegistry).length;

const categories = Object.values(categoryConfig);

// Mest brukte verktøy: de som er mest relevante i norsk hverdag
const popularToolIds = [
  'mortgage-calculator',
  'electricity-cost-calculator',
  'ev-charging-calculator',
  'solar-panel-calculator',
  'fuel-cost-calculator',
  'sales-tax-calculator',
  'paint-calculator',
  'bmi-calculator',
  'compound-interest-calculator',
  'percentage-calculator',
  'length-converter',
  'timezone-converter',
];

export default function Home() {
  const featuredTools = getFeaturedTools().slice(0, 16);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-100 py-16 sm:py-24 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="flex justify-center mb-5">
              <Logo className="h-16 w-16" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              Kalkulatorer for <span className="text-blue-600">hverdagen</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-600 sm:text-lg">
              {totalTools} gratis kalkulatorer og omregnere tilpasset Norge: kroner, metriske enheter
              og norske regler.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="#categories"
                className="rounded-[10px] bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                Utforsk verktøy
              </Link>
              <Link
                href="#popular"
                className="rounded-[10px] bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 hover:ring-blue-200 hover:text-blue-700 transition-colors"
              >
                Mest brukte
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Nøkkeltall */}
      <section className="bg-white py-8 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4">
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-blue-600 sm:text-3xl">{totalTools}</div>
              <div className="mt-0.5 text-xs text-gray-500 sm:text-sm">Verktøy</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-blue-600 sm:text-3xl">{categories.length}</div>
              <div className="mt-0.5 text-xs text-gray-500 sm:text-sm">Kategorier</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-blue-600 sm:text-3xl">kr · m · °C</div>
              <div className="mt-0.5 text-xs text-gray-500 sm:text-sm">Norske enheter</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-blue-600 sm:text-3xl">0</div>
              <div className="mt-0.5 text-xs text-gray-500 sm:text-sm">Reklame og sporing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Favoritter */}
      <FavoritesSection />

      {/* Kategorier */}
      <section id="categories" className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Velg kategori</h2>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">Finn verktøyet du trenger</p>
          </div>

          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="group relative rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 hover:shadow-md hover:ring-blue-300 transition-all"
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

      {/* Mest brukte verktøy */}
      <section id="popular" className="bg-white py-12 sm:py-16 border-y">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200 mb-3">
              <Sparkles className="h-3 w-3" />
              Mest brukt
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Mest brukte verktøy</h2>
            <p className="mt-2 text-gray-600 text-sm">Et godt sted å starte</p>
          </div>

          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {popularToolIds.map((id) => {
              const tool = toolRegistry[id];
              if (!tool) return null;
              const Icon = getToolIcon(id);
              return (
                <Link
                  key={id}
                  href={tool.path}
                  className="group flex items-center gap-3 rounded-lg bg-gray-50 p-3.5 hover:bg-blue-50 ring-1 ring-gray-200 hover:ring-blue-200 transition-all"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-gray-200 group-hover:ring-blue-200 transition-all">
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

      {/* Utvalgte verktøy */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Utvalgte verktøy</h2>
            <p className="mt-2 text-gray-600 text-sm">Håndplukket til norsk hverdag</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {featuredTools.map((tool) => {
              const Icon = getToolIcon(tool.id);
              return (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="group rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200 hover:shadow-md hover:ring-blue-300 transition-all"
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
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Se alle {totalTools} verktøy <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Avslutning */}
      <section className="bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-white sm:text-2xl">Klar for å regne?</h2>
          <p className="mt-2 text-gray-300 text-sm">
            Alle verktøyene er gratis, uten innlogging og uten sporing.
          </p>
          <div className="mt-5">
            <Link
              href="/calculators/finance/mortgage-calculator"
              className="inline-flex items-center rounded-[10px] bg-blue-400 px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-blue-300 transition-colors"
            >
              Prøv boliglånskalkulatoren
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
