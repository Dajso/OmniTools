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
  Compass,
  Radio,
  Fuel,
  Wrench,
  ArrowUpRight,
  Box,
  Lightbulb,
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
      title: 'Omregner ikke funnet',
    };
  }

  const { from, to, category } = pair;
  const fromName = from.name.toLowerCase();
  const toName = to.name.toLowerCase();
  const title = `${from.name} til ${toName} (${from.symbol} til ${to.symbol}) – omregner`;
  const description = `Regn om fra ${fromName} (${from.symbol}) til ${toName} (${to.symbol}) med en gang. Gratis omregner for ${CATEGORY_LABELS[category].toLowerCase()} med formel og relaterte omregninger.`;

  return {
    title,
    description,
    keywords: [
      `${fromName} til ${toName}`,
      `${from.symbol} til ${to.symbol}`,
      `regn om ${fromName}`,
      `${CATEGORY_LABELS[category].toLowerCase()} omregner`,
      `${fromName} omregner`,
      `${toName} omregner`,
    ],
    alternates: {
      canonical: `/convert/${conversion}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'nb_NO',
      siteName: 'Kalkulator',
    },
  };
}

/** Norske navn på enhetskategoriene */
const CATEGORY_LABELS: Record<UnitCategory, string> = {
  length: 'Lengde',
  weight: 'Vekt',
  temperature: 'Temperatur',
  volume: 'Volum',
  area: 'Areal',
  speed: 'Fart',
  time: 'Tid',
  data: 'Datastørrelse',
  pressure: 'Trykk',
  energy: 'Energi',
  angle: 'Vinkel',
  frequency: 'Frekvens',
  fuelEconomy: 'Drivstofforbruk',
  power: 'Effekt',
  torque: 'Dreiemoment',
  force: 'Kraft',
  density: 'Tetthet',
  illuminance: 'Belysningsstyrke',
};

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
    angle: Compass,
    frequency: Radio,
    fuelEconomy: Fuel,
    power: Zap,
    torque: Wrench,
    force: ArrowUpRight,
    density: Box,
    illuminance: Lightbulb,
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
    angle: 'bg-teal-100 text-teal-600',
    frequency: 'bg-pink-100 text-pink-600',
    fuelEconomy: 'bg-lime-100 text-lime-700',
    power: 'bg-yellow-100 text-yellow-600',
    torque: 'bg-stone-100 text-stone-600',
    force: 'bg-rose-100 text-rose-600',
    density: 'bg-emerald-100 text-emerald-600',
    illuminance: 'bg-amber-100 text-amber-600',
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

  const fromName = from.name.toLowerCase();
  const toName = to.name.toLowerCase();

  // Strukturerte data for søkemotorer
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${from.name} til ${toName} – omregner`,
    description: `Regn om fra ${fromName} (${from.symbol}) til ${toName} (${to.symbol}).`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    inLanguage: 'nb-NO',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'NOK',
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
        {/* Brødsmulesti */}
        <Breadcrumb
          items={[
            { label: 'Omregnere', href: '/convert' },
            { label: `${from.name} til ${toName}` },
          ]}
        />

        {/* Sideoverskrift */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className={`p-3 rounded-xl ${colorClass}`}>
              <CategoryIcon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                {CATEGORY_LABELS[category]}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold">
                {from.name} til {toName}
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground">
            Regn om fra {fromName} ({from.symbol}) til {toName} ({to.symbol}) med en gang. Gratis og uten registrering.
          </p>
        </header>

        {/* Omregner */}
        <ConverterBase
          fromUnit={toSerializableUnit(from)}
          toUnit={toSerializableUnit(to)}
          category={category}
          relatedConversions={relatedConversions}
          presetValues={getPresetValues(category)}
        />

        {/* Slik bruker du den */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">
            Slik regner du om fra {fromName} til {toName}
          </h2>
          <div className="bg-muted/50 rounded-xl p-6">
            <ol className="space-y-3">
              {[
                `Skriv inn verdien i ${fromName} (${from.symbol}) i feltet til venstre`,
                `Omregneren viser svaret i ${toName} (${to.symbol}) med en gang`,
                'Bruk bytteknappen (↔) for å snu retningen',
                'Trykk på «Kopier» for å kopiere resultatet',
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

        {/* Vanlige spørsmål */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">
            Vanlige spørsmål
          </h2>
          <div className="space-y-3">
            <FAQItem
              question={`Hvordan regner jeg om fra ${fromName} til ${toName}?`}
              answer={`Bruk formelen ${formula}. Eller skriv inn verdien i omregneren over, så får du svaret med en gang.`}
            />
            <FAQItem
              question={`Hva er sammenhengen mellom ${from.symbol} og ${to.symbol}?`}
              answer={`${from.name} (${from.symbol}) og ${toName} (${to.symbol}) er begge enheter for ${CATEGORY_LABELS[category].toLowerCase()}. Sammenhengen er: ${formula}.`}
            />
            <FAQItem
              question={`Er omregneren nøyaktig?`}
              answer={`Ja. Omregneren bruker presise omregningsfaktorer, og svaret vises med opptil seks desimaler eller i vitenskapelig notasjon for svært store og små tall.`}
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
      return [0, 20, 37, 100];
    case 'data':
      return [1, 100, 1024, 10240];
    case 'time':
      return [1, 60, 3600, 86400];
    case 'angle':
      return [1, 45, 90, 180];
    case 'fuelEconomy':
      return [5, 6, 8, 10];
    case 'speed':
      return [1, 10, 50, 100];
    case 'power':
      return [1, 10, 100, 1000];
    case 'illuminance':
      return [1, 100, 500, 1000];
    default:
      return [1, 10, 100, 1000];
  }
}
