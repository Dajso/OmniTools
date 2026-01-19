import { Metadata } from 'next';
import { PressureConverter } from '@/components/calculators/physics';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Pressure Converter - Convert Bar, PSI, Pascal, Atmosphere',
  description: 'Convert pressure between Bar, PSI, Pascal, Atmosphere, Torr, mmHg, and more. Free online pressure unit converter with instant results.',
  keywords: ['pressure converter', 'bar to psi', 'pascal converter', 'pressure calculator', 'atm to bar', 'psi to bar', 'mmhg converter', 'pressure units'],
  alternates: { canonical: '/calculators/physics/pressure-converter' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Pressure Converter',
  description: 'Convert pressure between different units including Bar, PSI, Pascal, Atmosphere, Torr, and more',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter pressure value', text: 'Type the pressure value you want to convert in the input field.' },
  { name: 'Select source unit', text: 'Choose the unit of your input value from the dropdown (e.g., Bar, PSI, Pascal).' },
  { name: 'View all conversions', text: 'Instantly see the equivalent pressure in all supported units.' },
  { name: 'Copy results', text: 'Click on any result to copy it to your clipboard for use elsewhere.' },
];

const faqs = [
  {
    question: 'What is the difference between Bar and PSI?',
    answer: 'Bar and PSI are both units of pressure. Bar is a metric unit where 1 bar equals 100,000 Pascals. PSI (pounds per square inch) is an imperial unit commonly used in the US. 1 bar ≈ 14.5 PSI.',
  },
  {
    question: 'What is standard atmospheric pressure?',
    answer: 'Standard atmospheric pressure at sea level is defined as 101,325 Pascals, which equals 1 atmosphere (atm), approximately 1.013 bar, or about 14.7 PSI.',
  },
  {
    question: 'What is Pascal (Pa)?',
    answer: 'Pascal is the SI (International System) unit of pressure. It is defined as one Newton per square meter (N/m²). Named after Blaise Pascal, it is the base unit used for scientific pressure measurements.',
  },
  {
    question: 'When should I use mmHg or Torr?',
    answer: 'mmHg (millimeters of mercury) and Torr are nearly identical units commonly used in medicine (blood pressure) and vacuum technology. 1 Torr = 1 mmHg = 133.322 Pa.',
  },
  {
    question: 'What is gauge pressure vs absolute pressure?',
    answer: 'Absolute pressure is measured relative to a perfect vacuum (zero pressure). Gauge pressure is measured relative to atmospheric pressure. This converter uses absolute pressure values.',
  },
  {
    question: 'How do I convert tire pressure from Bar to PSI?',
    answer: 'Multiply the Bar value by 14.5038 to get PSI. For example, 2.2 bar × 14.5 ≈ 32 PSI, which is a typical car tire pressure.',
  },
];

const relatedTools = [
  { href: '/calculators/physics/density-calculator', title: 'Density Calculator', description: 'Calculate density, mass, or volume.' },
  { href: '/calculators/physics/kinetic-energy-calculator', title: 'Kinetic Energy Calculator', description: 'Calculate kinetic energy using KE = ½mv².' },
  { href: '/calculators/physics/sound-speed-calculator', title: 'Sound Speed Calculator', description: 'Calculate the speed of sound based on temperature.' },
];

export default function PressureConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="pressure-converter"
          title="Pressure Converter"
          description="Convert pressure between Bar, PSI, Pascal, Atmosphere, Torr, mmHg, and 12 other units. Instant, accurate conversions for engineering, science, and everyday use."
          colorClass="bg-blue-100 text-blue-600"
          category="Physics"
        />

        <section aria-label="Pressure Converter">
          <PressureConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
