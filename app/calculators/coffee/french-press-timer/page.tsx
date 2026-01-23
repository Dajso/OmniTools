import { Metadata } from 'next';
import { FrenchPressTimer } from '@/components/calculators/coffee';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
    title: 'French Press Timer - Coffee Brewing Timer with Reminders',
    description: 'French press timer with bloom and stir reminders. Calculate brew ratio and get step-by-step timing for perfect French press coffee every time.',
    keywords: ['french press timer', 'french press coffee', 'coffee timer', 'brew ratio', 'french press brewing', 'press pot timer', 'cafetiere timer'],
    alternates: { canonical: '/calculators/coffee/french-press-timer' },
    openGraph: {
        title: 'French Press Timer - Coffee Brewing Timer with Reminders',
        description: 'French press timer with bloom and stir reminders for perfect coffee.',
        url: '/calculators/coffee/french-press-timer',
        siteName: 'OmniTools',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'French Press Timer - Coffee Brewing Timer with Reminders',
        description: 'French press timer with bloom and stir reminders.',
    },
};

const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'French Press Timer',
    description: 'Timer with bloom and stir reminders for consistent French press brewing with brew ratio calculation',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter coffee dose', text: 'Input the amount of coarse-ground coffee you\'re using in grams.' },
    { name: 'Enter water amount', text: 'Input the amount of hot water (195-205°F) in grams.' },
    { name: 'Set steep time', text: 'Choose your steep time (4 minutes is standard).' },
    { name: 'Start the timer', text: 'Begin brewing and follow the visual and audio reminders.' },
    { name: 'Stir and plunge', text: 'Stir at the bloom and halfway point, then press at the end.' },
];

const faqs = [
    { question: 'How long should I brew French press coffee?', answer: 'The standard French press brewing time is 4 minutes. You can adjust between 2-10 minutes depending on preference. Shorter times produce lighter coffee, longer times create stronger flavors.' },
    { question: 'What is the best coffee to water ratio for French press?', answer: 'The classic ratio is 1:15 to 1:17 (coffee to water). For example, 30g of coffee to 500g of water gives a 1:16.7 ratio for balanced, full-bodied coffee.' },
    { question: 'When should I stir my French press coffee?', answer: 'Stir twice: at 30 seconds (bloom phase) to saturate all grounds, and again at the halfway point to promote even extraction.' },
    { question: 'What grind size should I use for French press?', answer: 'French press requires a coarse grind, similar to sea salt or breadcrumbs. Coarse grounds prevent sediment and allow proper extraction during the 4-minute brew.' },
    { question: 'What temperature should the water be for French press?', answer: 'The ideal water temperature is 195-205°F (90-96°C), just off the boil. If you boil water, let it sit for 30 seconds before pouring.' },
];

const relatedTools = [
    { href: '/calculators/coffee/brew-ratio-calculator', title: 'Brew Ratio Calculator', description: 'Calculate water amount for your brew ratio.' },
    { href: '/calculators/coffee/pour-over-timer', title: 'Pour Over Timer', description: 'Multi-stage timer for pour over brewing.' },
    { href: '/calculators/coffee/grind-size-converter', title: 'Grind Size Converter', description: 'Convert grind settings between grinders.' },
];

export default function FrenchPressTimerPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader
                    toolId="french-press-timer"
                    title="French Press Timer"
                    description="Timer with bloom and stir reminders for perfect French press coffee brewing."
                    colorClass="bg-amber-100 text-amber-700"
                    category="Coffee"
                />

                <section aria-label="French Press Timer">
                    <FrenchPressTimer />
                </section>

                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
