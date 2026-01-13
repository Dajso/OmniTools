import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ConverterBase } from '@/components/converters/converter-base';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { 
  getConversionPair, 
  getAllConversionPairs,
  getRelatedConversions,
  generateFormula 
} from '@/lib/conversions';
import { SerializableUnit, UnitCategory } from '@/lib/constants/types';
import { 
  Ruler, 
  Scale, 
  Thermometer, 
  Beaker, 
  Square, 
  Gauge, 
  Clock, 
  HardDrive,
  Activity,
  Zap,
  LucideIcon
} from 'lucide-react';

interface PageProps {
  params: Promise<{ conversion: string }>;
}

/**
 * Convert a ConversionUnit to a SerializableUnit (removes functions)
 */
function toSerializableUnit(unit: { id: string; name: string; symbol: string; category: string }): SerializableUnit {
  return {
    id: unit.id,
    name: unit.name,
    symbol: unit.symbol,
    category: unit.category as SerializableUnit['category'],
  };
}

/**
 * Generate static params for all conversion pairs
 * This enables static generation of all conversion pages
 */
export async function generateStaticParams() {
  const pairs = getAllConversionPairs();
  return pairs.map(({ from, to }) => ({
    conversion: `${from}-to-${to}`,
  }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { conversion } = await params;
  const pair = getConversionPair(conversion);
  
  if (!pair) {
    return {
      title: 'Converter Not Found',
    };
  }

  const { from, to, category } = pair;
  const title = `${from.name} to ${to.name} Converter - Free Online ${capitalize(category)} Converter`;
  const description = `Convert ${from.name} (${from.symbol}) to ${to.name} (${to.symbol}) instantly. Free online ${category} converter with formula and related conversions.`;

  return {
    title,
    description,
    keywords: [
      `${from.name.toLowerCase()} to ${to.name.toLowerCase()}`,
      `${from.symbol} to ${to.symbol}`,
      `convert ${from.name.toLowerCase()}`,
      `${category} converter`,
      `${from.name.toLowerCase()} converter`,
      `${to.name.toLowerCase()} converter`,
    ],
    alternates: {
      canonical: `/convert/${conversion}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get icon for a unit category
 */
function getCategoryIcon(category: UnitCategory): LucideIcon {
  const iconMap: Record<UnitCategory, LucideIcon> = {
    length: Ruler,
    weight: Scale,
    temperature: Thermometer,
    volume: Beaker,
    area: Square,
    speed: Gauge,
    time: Clock,
    data: HardDrive,
    pressure: Activity,
    energy: Zap,
  };
  return iconMap[category] || Ruler;
}

/**
 * Get color class for a unit category
 */
function getCategoryColorClass(category: UnitCategory): string {
  const colorMap: Record<UnitCategory, string> = {
    length: 'bg-blue-100 text-blue-600',
    weight: 'bg-green-100 text-green-600',
    temperature: 'bg-red-100 text-red-600',
    volume: 'bg-cyan-100 text-cyan-600',
    area: 'bg-purple-100 text-purple-600',
    speed: 'bg-orange-100 text-orange-600',
    time: 'bg-indigo-100 text-indigo-600',
    data: 'bg-slate-100 text-slate-600',
    pressure: 'bg-amber-100 text-amber-600',
    energy: 'bg-yellow-100 text-yellow-600',
  };
  return colorMap[category] || 'bg-blue-100 text-blue-600';
}

/**
 * Dynamic conversion page component
 */
export default async function ConversionPage({ params }: PageProps) {
  const { conversion } = await params;
  const pair = getConversionPair(conversion);

  if (!pair) {
    notFound();
  }

  const { from, to, category } = pair;
  const formula = generateFormula(from, to, category);
  const relatedConversions = getRelatedConversions(category, from.id, to.id, 6);
  const CategoryIcon = getCategoryIcon(category);
  const colorClass = getCategoryColorClass(category);

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${from.name} to ${to.name} Converter`,
    description: `Convert ${from.name} (${from.symbol}) to ${to.name} (${to.symbol}) instantly.`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Converters', href: '/convert' },
            { label: `${from.name} to ${to.name}` },
          ]}
        />

        {/* Page Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className={`p-3 rounded-xl ${colorClass}`}>
              <CategoryIcon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                {capitalize(category)} Converter
              </p>
              <h1 className="text-2xl md:text-3xl font-bold">
                {from.name} to {to.name}
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground">
            Instantly convert {from.name.toLowerCase()} ({from.symbol}) to {to.name.toLowerCase()} ({to.symbol}) with our free online converter.
          </p>
        </header>

        {/* Converter Component */}
        <ConverterBase
          fromUnit={toSerializableUnit(from)}
          toUnit={toSerializableUnit(to)}
          category={category}
          relatedConversions={relatedConversions}
          presetValues={getPresetValues(category)}
        />

        {/* How to Use Section */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">
            How to Convert {from.name} to {to.name}
          </h2>
          <div className="bg-muted/50 rounded-xl p-6">
            <ol className="space-y-3">
              {[
                `Enter the value in ${from.name.toLowerCase()} (${from.symbol}) in the input field`,
                `The converter automatically calculates the equivalent in ${to.name.toLowerCase()} (${to.symbol})`,
                'Use the swap button (↔) to reverse the conversion direction',
                'Click "Copy" to copy the result to your clipboard',
              ].map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            <FAQItem
              question={`How do I convert ${from.name.toLowerCase()} to ${to.name.toLowerCase()}?`}
              answer={`To convert ${from.name.toLowerCase()} to ${to.name.toLowerCase()}, use the formula: ${formula}. Simply enter your value in the converter above for instant results.`}
            />
            <FAQItem
              question={`What is the relationship between ${from.symbol} and ${to.symbol}?`}
              answer={`${from.name} (${from.symbol}) and ${to.name} (${to.symbol}) are both units of ${category}. The conversion formula is: ${formula}.`}
            />
            <FAQItem
              question={`Is this ${category} converter accurate?`}
              answer={`Yes, our converter uses precise conversion factors to ensure accurate results. The conversion is calculated using the standard formula: ${formula}.`}
            />
          </div>
        </section>
      </main>
    </>
  );
}

/**
 * FAQ Item component
 */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border rounded-xl p-4 hover:bg-muted/30 transition-colors">
      <h3 className="font-medium mb-2">{question}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{answer}</p>
    </div>
  );
}

/**
 * Get preset values based on category
 */
function getPresetValues(category: string): number[] {
  switch (category) {
    case 'temperature':
      return [0, 32, 100, 212];
    case 'data':
      return [1, 100, 1024, 10240];
    case 'time':
      return [1, 60, 3600, 86400];
    default:
      return [1, 10, 100, 1000];
  }
}
