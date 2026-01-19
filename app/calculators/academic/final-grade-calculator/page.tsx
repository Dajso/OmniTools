import { Metadata } from 'next';
import { FinalGradeCalculator } from '@/components/calculators/academic';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Final Grade Calculator - What Score Do I Need?',
  description: 'Calculate the minimum score you need on your final exam to achieve your target grade. Free final grade calculator for students.',
  keywords: ['final grade calculator', 'exam grade needed', 'what score do I need', 'final exam calculator', 'target grade'],
  alternates: { canonical: '/calculators/academic/final-grade-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Final Grade Calculator',
  description: 'Calculate the score needed on your final exam to achieve your target grade',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter current grade', text: 'Input your current grade percentage in the class before the final exam.' },
  { name: 'Set target grade', text: 'Choose your desired final grade using presets (A, B, C, D) or enter a custom percentage.' },
  { name: 'Enter final weight', text: 'Input how much the final exam counts toward your total grade (e.g., 25%).' },
  { name: 'View required score', text: 'See the minimum score you need on the final to achieve your target grade.' },
];

const faqs = [
  { 
    question: 'How is the required final exam score calculated?', 
    answer: 'The formula is: Required Score = (Target Grade - Current Grade × (1 - Final Weight)) / Final Weight. This is derived from the weighted average formula used to calculate your final grade.' 
  },
  { 
    question: 'What if the required score is over 100%?', 
    answer: 'If the calculator shows a score over 100%, it means your target grade is not achievable even with a perfect score on the final. Consider adjusting your target grade to something more realistic.' 
  },
  { 
    question: 'What if the required score is negative?', 
    answer: 'A negative required score means you\'ve already secured your target grade! Even scoring 0% on the final would still give you your desired grade.' 
  },
  { 
    question: 'How do I find my final exam weight?', 
    answer: 'Check your course syllabus or ask your instructor. Common final exam weights are 20%, 25%, 30%, or 40% of the total grade.' 
  },
  { 
    question: 'Does this account for extra credit?', 
    answer: 'This calculator uses standard weighted averages. If your class offers extra credit, your actual required score may be lower than calculated.' 
  },
];

const relatedTools = [
  { href: '/calculators/academic/gpa-calculator', title: 'GPA Calculator', description: 'Calculate your weighted and unweighted GPA.' },
  { href: '/calculators/productivity/grade-calculator', title: 'Grade Calculator', description: 'Calculate your overall course grade.' },
  { href: '/calculators/productivity/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages for any values.' },
];

export default function FinalGradeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="final-grade-calculator"
          title="Final Grade Calculator"
          description="Find out exactly what score you need on your final exam to achieve your target grade. Enter your current grade and final exam weight to calculate."
          colorClass="bg-purple-100 text-purple-600"
          category="Academic"
        />

        <section aria-label="Final Grade Calculator">
          <FinalGradeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
