import { Metadata } from 'next';
import { GPACalculator } from '@/components/calculators/academic';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'College GPA Calculator - Weighted & Unweighted GPA',
  description: 'Calculate your college GPA with support for weighted and unweighted calculations. Includes Honors and AP course bonuses on a 4.0 scale.',
  keywords: ['GPA calculator', 'college GPA', 'weighted GPA', 'unweighted GPA', 'grade point average', 'academic calculator'],
  alternates: { canonical: '/calculators/academic/gpa-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'College GPA Calculator',
  description: 'Calculate your weighted and unweighted college GPA on a 4.0 scale',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Add your courses', text: 'Enter each course name, or leave blank for unnamed courses.' },
  { name: 'Select grades', text: 'Choose the letter grade you received for each course (A+ through F).' },
  { name: 'Set credit hours', text: 'Select the number of credit hours for each course.' },
  { name: 'Mark special courses', text: 'Check Honors (+0.5) or AP/IB (+1.0) for weighted GPA calculation.' },
  { name: 'View your GPA', text: 'See both weighted and unweighted GPA calculated automatically.' },
];

const faqs = [
  { 
    question: 'What is the difference between weighted and unweighted GPA?', 
    answer: 'Unweighted GPA uses a standard 4.0 scale where an A equals 4.0 regardless of course difficulty. Weighted GPA adds bonus points for advanced courses: +0.5 for Honors and +1.0 for AP/IB courses, allowing GPAs above 4.0.' 
  },
  { 
    question: 'How is GPA calculated?', 
    answer: 'GPA is calculated by multiplying each course\'s grade points by its credit hours, summing all values, then dividing by total credit hours. Formula: GPA = Σ(Grade Points × Credits) / Σ(Credits).' 
  },
  { 
    question: 'What is a good college GPA?', 
    answer: 'Generally, a GPA of 3.0 or higher is considered good. A 3.5+ is very good, and 3.7+ is excellent. For graduate school applications, many programs prefer 3.0 or higher.' 
  },
  { 
    question: 'Do all colleges use the same GPA scale?', 
    answer: 'Most US colleges use the 4.0 scale, but some use different scales or calculate weighted GPA differently. Always check your specific institution\'s grading policy.' 
  },
  { 
    question: 'How do plus and minus grades affect GPA?', 
    answer: 'Plus grades add 0.3 points (A- = 3.7, B+ = 3.3) and minus grades subtract 0.3 points from the base grade value. An A+ is typically capped at 4.0 for unweighted GPA.' 
  },
];

const relatedTools = [
  { href: '/calculators/academic/final-grade-calculator', title: 'Final Grade Calculator', description: 'Calculate the grade needed on your final exam.' },
  { href: '/calculators/productivity/grade-calculator', title: 'Grade Calculator', description: 'Calculate your overall course grade.' },
  { href: '/calculators/productivity/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages for any values.' },
];

export default function GPACalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="gpa-calculator"
          title="College GPA Calculator"
          description="Calculate your weighted and unweighted GPA on a 4.0 scale. Add courses, select grades, and see your GPA instantly with support for Honors and AP course bonuses."
          colorClass="bg-blue-100 text-blue-600"
          category="Academic"
        />

        <section aria-label="GPA Calculator">
          <GPACalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
