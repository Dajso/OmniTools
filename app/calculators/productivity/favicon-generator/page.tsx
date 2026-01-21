import { Metadata } from 'next';
import { FaviconGenerator } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
    title: 'Favicon Generator - Free Emoji Favicon Creator',
    description: 'Create favicons from text or emoji with custom colors and styles. Download in all standard sizes for your website.',
    keywords: ['favicon generator', 'emoji favicon', 'favicon creator', 'website icon', 'favicon maker'],
    alternates: { canonical: '/calculators/productivity/favicon-generator' },
};

const faqs = [
    {
        question: 'What sizes do I need for a favicon?',
        answer: 'Common sizes are 16x16 (browser tab), 32x32 (taskbar), 180x180 (Apple touch icon), and 512x512 (PWA). We generate all standard sizes.'
    },
    {
        question: 'Can I use emoji as a favicon?',
        answer: 'Yes! Emoji make great favicons and work on all modern browsers. This tool lets you create emoji-based favicons with custom backgrounds.'
    },
    {
        question: 'How do I add a favicon to my website?',
        answer: 'Add this to your HTML head: <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">. For full support, include multiple sizes.'
    },
    {
        question: 'What file format should I use?',
        answer: 'PNG is recommended for modern browsers. For legacy support, you may also want an .ico file. This tool generates PNG files.'
    },
];

export default function FaviconGeneratorPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <ToolPageHeader
                toolId="favicon-generator"
                title="Favicon Generator"
                description="Create favicons from text or emoji with custom colors and styles."
                colorClass="bg-violet-100 text-violet-700"
            />
            <section aria-label="Favicon Generator Tool">
                <FaviconGenerator />
            </section>

            <section className="mt-12" aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="text-2xl font-semibold mb-6">FAQ</h2>
                <div className="space-y-6">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border-b pb-6 last:border-b-0">
                            <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                            <p className="text-muted-foreground">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
