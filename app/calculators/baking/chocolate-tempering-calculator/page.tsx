import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { ChocolateTemperingCalculator } from '@/components/calculators/baking';

export const metadata: Metadata = {
    title: 'Chocolate Tempering Calculator - Temperature Guide',
    description: 'Get precise tempering temperatures for dark, milk, and white chocolate. Achieve perfect snap and glossy finish every time.',
    keywords: ['chocolate tempering', 'tempering temperatures', 'chocolate melting point', 'chocolate crystals', 'couverture'],
    alternates: { canonical: '/calculators/baking/chocolate-tempering-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Chocolate Tempering Calculator', description: 'Get precise tempering temperatures for chocolate.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Select chocolate type', text: 'Choose dark, milk, or white chocolate.' },
    { name: 'See temperature stages', text: 'View the melt, cool, and working temperatures for your chocolate type.' },
    { name: 'Enter amount', text: 'Input how much chocolate you are tempering for technique recommendations.' },
    { name: 'Follow the process', text: 'Melt to target, cool to working temp, then use immediately for coating or molding.' },
];

const faqs = [
    { question: 'What temperature to temper dark chocolate?', answer: 'Melt to 122-131°F (50-55°C), cool to 82°F (28°C), then reheat to working temp 88-90°F (31-32°C).' },
    { question: 'Why does chocolate need tempering?', answer: 'Tempering aligns cocoa butter crystals into a stable form (Form V), giving chocolate a glossy sheen, clean snap, and smooth texture.' },
    { question: 'Can I temper chocolate in a microwave?', answer: 'Yes. Microwave in 15-second bursts, stirring between each. Use a thermometer to hit the right temperatures.' },
    { question: 'How do I know if chocolate is in temper?', answer: 'Dip a knife tip in the chocolate. If it sets within 3-5 minutes at room temp with a glossy finish, it is properly tempered.' },
];

const relatedTools = [
    { href: '/calculators/baking/bakers-percentage-calculator', title: "Baker's Percentage", description: 'Scale chocolate recipes.' },
    { href: '/calculators/baking/unit-cost-per-serving', title: 'Cost Per Serving', description: 'Calculate ingredient costs.' },
    { href: '/calculators/baking/egg-size-converter', title: 'Egg Size Converter', description: 'Convert between egg sizes.' },
];

export default function ChocolateTemperingPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="chocolate-tempering-calculator" title="Chocolate Tempering Calculator"
                    description="Get precise tempering temperatures for chocolate." category="Baking & Food Science" />
                <section aria-label="Chocolate Tempering Calculator"><ChocolateTemperingCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
