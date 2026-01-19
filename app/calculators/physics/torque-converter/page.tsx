import { Metadata } from 'next';
import { TorqueConverter } from '@/components/calculators/physics';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Torque Converter - Convert Newton-meter, Foot-pound, Kilogram-meter',
  description: 'Convert torque between Newton-meter (Nm), Foot-pound (ft-lb), Kilogram-meter (kg-m), Inch-pound (in-lb), and more. Free online torque unit converter with instant results.',
  keywords: ['torque converter', 'nm to ft-lb', 'newton meter converter', 'torque calculator', 'ft-lb to nm', 'torque units', 'kilogram meter converter'],
  alternates: { canonical: '/calculators/physics/torque-converter' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Torque Converter',
  description: 'Convert torque between different units including Newton-meter, Foot-pound, Kilogram-meter, Inch-pound, and more',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter torque value', text: 'Type the torque value you want to convert in the input field.' },
  { name: 'Select source unit', text: 'Choose the unit of your input value from the dropdown (e.g., Newton-meter, Foot-pound).' },
  { name: 'View all conversions', text: 'Instantly see the equivalent torque in all supported units.' },
  { name: 'Copy results', text: 'Click on any result to copy it to your clipboard for use elsewhere.' },
];

const faqs = [
  {
    question: 'What is the difference between Newton-meter and Foot-pound?',
    answer: 'Newton-meter (N·m) is the SI unit of torque, while Foot-pound (ft-lb) is an imperial unit commonly used in the US. 1 N·m ≈ 0.7376 ft-lb, and 1 ft-lb ≈ 1.3558 N·m.',
  },
  {
    question: 'What is torque?',
    answer: 'Torque is a measure of rotational force. It is calculated as the product of force and the perpendicular distance from the axis of rotation (τ = F × r). Torque determines how much rotational effect a force has on an object.',
  },
  {
    question: 'Why is torque important in automotive applications?',
    answer: 'Torque is crucial in automotive applications because it determines the pulling power of an engine. Higher torque means better acceleration and towing capacity. Torque specifications are also critical for properly tightening bolts and fasteners.',
  },
  {
    question: 'What is the typical torque for car wheel lug nuts?',
    answer: 'Most car wheel lug nuts require 80-100 ft-lb (108-135 N·m) of torque. Always check your vehicle\'s manual for the exact specification, as over-tightening can damage the studs and under-tightening can cause wheels to come loose.',
  },
  {
    question: 'How do I convert Newton-meters to Foot-pounds?',
    answer: 'To convert N·m to ft-lb, multiply by 0.7376. For example, 100 N·m × 0.7376 = 73.76 ft-lb. To convert ft-lb to N·m, multiply by 1.3558.',
  },
  {
    question: 'What is the relationship between torque and power?',
    answer: 'Power is the rate at which work is done, and it relates to torque through the formula: Power = Torque × Angular Velocity. In automotive terms: Horsepower = (Torque × RPM) / 5252.',
  },
];

const relatedTools = [
  { href: '/calculators/physics/pressure-converter', title: 'Pressure Converter', description: 'Convert pressure between Bar, PSI, Pascal, and more.' },
  { href: '/calculators/physics/kinetic-energy-calculator', title: 'Kinetic Energy Calculator', description: 'Calculate kinetic energy using KE = ½mv².' },
  { href: '/calculators/auto/horsepower-to-kw-converter', title: 'Horsepower to kW Converter', description: 'Convert between horsepower and kilowatts.' },
];

export default function TorqueConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="torque-converter"
          title="Torque Converter"
          description="Convert torque between Newton-meter (N·m), Foot-pound (ft-lb), Kilogram-meter (kg·m), Inch-pound (in-lb), and 5 other units. Instant, accurate conversions for automotive, engineering, and mechanical applications."
          colorClass="bg-blue-100 text-blue-600"
          category="Physics"
        />

        <section aria-label="Torque Converter">
          <TorqueConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
