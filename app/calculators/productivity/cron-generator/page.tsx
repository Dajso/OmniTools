import { Metadata } from 'next';
import { CronGenerator } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
    title: 'Cron Job Generator - Free Cron Expression Builder',
    description: 'Build cron expressions with a visual scheduler. Generate cron syntax for scheduled tasks with human-readable descriptions.',
    keywords: ['cron generator', 'cron expression', 'cron job', 'crontab', 'scheduler', 'cron syntax'],
    alternates: { canonical: '/calculators/productivity/cron-generator' },
};

const faqs = [
    {
        question: 'What is a cron expression?',
        answer: 'A cron expression is a string of five fields separated by spaces that represents a schedule. It defines when a scheduled task (cron job) should run.'
    },
    {
        question: 'What do the five fields mean?',
        answer: 'Minute (0-59), Hour (0-23), Day of month (1-31), Month (1-12), Day of week (0-6, where 0 is Sunday).'
    },
    {
        question: 'What does the asterisk (*) mean?',
        answer: 'An asterisk means "every" value for that field. For example, * in the minute field means "every minute".'
    },
    {
        question: 'What does */5 mean?',
        answer: 'The slash (/) defines a step. */5 in the minute field means "every 5 minutes".'
    },
];

export default function CronGeneratorPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <ToolPageHeader
                toolId="cron-generator"
                title="Cron Job Generator"
                description="Build cron expressions with a visual scheduler and human-readable descriptions."
                colorClass="bg-violet-100 text-violet-700"
            />
            <section aria-label="Cron Generator Tool">
                <CronGenerator />
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
