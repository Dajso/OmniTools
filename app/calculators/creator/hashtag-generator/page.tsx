import { Metadata } from 'next';
import { HashtagGenerator } from '@/components/calculators/creator';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
    title: 'Hashtag Generator - Free Social Media Hashtag Tool',
    description: 'Generate relevant hashtags for Instagram, Twitter, TikTok, and LinkedIn. Boost your social media reach with trending hashtags.',
    keywords: ['hashtag generator', 'Instagram hashtags', 'TikTok hashtags', 'social media', 'trending hashtags'],
    alternates: { canonical: '/calculators/creator/hashtag-generator' },
};

const faqs = [
    {
        question: 'How many hashtags should I use?',
        answer: 'Instagram allows up to 30 hashtags, but 10-15 relevant ones often work best. Twitter/X and TikTok work best with 3-5 hashtags. LinkedIn recommends 3-5 professional hashtags.'
    },
    {
        question: 'Should I use popular or niche hashtags?',
        answer: 'A mix of both works best. Popular hashtags get more eyeballs but more competition. Niche hashtags have less competition and attract a more targeted audience.'
    },
    {
        question: 'Where should I put hashtags?',
        answer: 'On Instagram, hashtags can go in the caption or first comment. On Twitter, include them naturally in the tweet. On TikTok, add them to your caption.'
    },
];

export default function HashtagGeneratorPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <ToolPageHeader
                toolId="hashtag-generator"
                title="Hashtag Generator"
                description="Generate relevant hashtags for your social media posts on Instagram, Twitter, TikTok, and more."
                colorClass="bg-indigo-100 text-indigo-700"
            />
            <section aria-label="Hashtag Generator Tool">
                <HashtagGenerator />
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
