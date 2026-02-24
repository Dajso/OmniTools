import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { RenovationROICalculator } from '@/components/calculators/realestate';

export const metadata: Metadata = {
    title: 'Renovation ROI Estimator - Home Improvement Return Calculator',
    description: 'Calculate the return on investment for home renovation projects. See which improvements add the most value.',
    keywords: ['renovation ROI', 'home improvement return', 'remodel ROI calculator', 'renovation value', 'home renovation cost'],
    alternates: { canonical: '/calculators/realestate/renovation-roi-estimator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Renovation ROI Estimator', description: 'Calculate renovation return on investment.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Select renovation type', text: 'Choose the type of renovation (kitchen, bathroom, roof, etc.).' },
    { name: 'Enter renovation cost', text: 'Input your estimated or actual renovation cost.' },
    { name: 'Enter current home value', text: 'Input the current market value of your property.' },
    { name: 'See ROI analysis', text: 'View estimated value increase, ROI percentage, and cost recoup rate.' },
];

const faqs = [
    { question: 'Which home improvements have the best ROI?', answer: 'Garage door replacement (94%), manufactured stone veneer (92%), and minor kitchen remodels (72%) consistently top ROI lists according to Remodeling Magazine.' },
    { question: 'Does a kitchen remodel pay for itself?', answer: 'A minor kitchen remodel recoups about 72% of costs. Major remodels recoup about 54%. Focus on cosmetic updates rather than layout changes for best ROI.' },
    { question: 'Is a bathroom remodel worth it?', answer: 'A midrange bathroom remodel recoups about 60-68% of costs. Adding a bathroom to a one-bath home has even higher returns.' },
    { question: 'How does renovation ROI vary by market?', answer: 'ROI varies significantly by location. Hot markets with low inventory tend to reward renovations more. Always check local comparable sales.' },
];

const relatedTools = [
    { href: '/calculators/realestate/brrrr-calculator', title: 'BRRRR Calculator', description: 'Plan BRRRR strategy deals.' },
    { href: '/calculators/realestate/house-affordability-calculator', title: 'Affordability Calculator', description: 'How much house can you afford?' },
    { href: '/calculators/realestate/closing-cost-estimator', title: 'Closing Costs', description: 'Estimate buying/selling costs.' },
];

export default function RenovationROIEstimatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="renovation-roi-estimator" title="Renovation ROI Estimator"
                    description="Calculate renovation return on investment." category="Real Estate Investing" />
                <section aria-label="Renovation ROI Estimator"><RenovationROICalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
