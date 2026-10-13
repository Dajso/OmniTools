import { Metadata } from 'next';
import { PomodoroTimer } from '@/components/calculators/academic';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Pomodoro Timer - Focus & Productivity Timer',
  description: 'Free Pomodoro timer with customizable work and break intervals. Stay focused and boost productivity with the Pomodoro technique.',
  keywords: ['pomodoro timer', 'focus timer', 'study timer', 'productivity timer', 'work timer', 'break timer'],
  alternates: { canonical: '/calculators/academic/pomodoro-timer' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Pomodoro Timer',
  description: 'Stay focused with the Pomodoro technique - work in focused intervals with regular breaks',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Set your intervals', text: 'Use the default 25/5 minute intervals or customize work and break durations in settings.' },
  { name: 'Start the timer', text: 'Click Start to begin your work session. The timer will count down.' },
  { name: 'Focus on your task', text: 'Work on your task until the timer rings. Avoid distractions during this time.' },
  { name: 'Take a break', text: 'When the work session ends, take a short break. After 4 sessions, take a longer break.' },
  { name: 'Repeat', text: 'Continue the cycle to maintain focus and productivity throughout your study or work session.' },
];

const faqs = [
  { 
    question: 'What is the Pomodoro Technique?', 
    answer: 'The Pomodoro Technique is a time management method developed by Francesco Cirillo. It uses a timer to break work into intervals (traditionally 25 minutes) separated by short breaks. After 4 work intervals, you take a longer break.' 
  },
  { 
    question: 'Why is it called Pomodoro?', 
    answer: 'Pomodoro is Italian for "tomato." The technique was named after the tomato-shaped kitchen timer that Francesco Cirillo used as a university student.' 
  },
  { 
    question: 'What are the best Pomodoro intervals?', 
    answer: 'The classic intervals are 25 minutes of work followed by 5-minute breaks, with a 15-30 minute break after 4 sessions. However, you can customize these based on your needs - some prefer 50/10 for deep work or 15/3 for tasks requiring frequent context switching.' 
  },
  { 
    question: 'How many Pomodoros should I do per day?', 
    answer: 'Most people can sustain 8-12 Pomodoros (4-6 hours of focused work) per day. Quality matters more than quantity - it\'s better to complete fewer focused sessions than many distracted ones.' 
  },
  { 
    question: 'What should I do during breaks?', 
    answer: 'During short breaks, step away from your work - stretch, get water, or rest your eyes. During long breaks, take a walk, have a snack, or do something relaxing. Avoid checking email or social media as these can extend your break.' 
  },
];

const relatedTools = [
  { href: '/calculators/productivity/date-difference', title: 'Date Calculator', description: 'Calculate days between dates.' },
];

export default function PomodoroTimerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="pomodoro-timer"
          title="Pomodoro Timer"
          description="Boost your productivity with the Pomodoro technique. Work in focused intervals with customizable work and break durations."
          colorClass="bg-rose-100 text-rose-600"
          category="Academic"
        />

        <section aria-label="Pomodoro Timer">
          <PomodoroTimer />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
