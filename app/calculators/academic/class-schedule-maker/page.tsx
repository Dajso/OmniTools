import { Metadata } from 'next';
import { ClassScheduleMaker } from '@/components/calculators/academic';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Class Schedule Maker - Create & Export Timetables',
  description: 'Free class schedule maker to create and export your weekly timetable. Export as PDF or image for easy sharing and printing.',
  keywords: ['class schedule maker', 'timetable maker', 'schedule planner', 'course schedule', 'weekly planner', 'student schedule'],
  alternates: { canonical: '/calculators/academic/class-schedule-maker' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Class Schedule Maker',
  description: 'Create and export class schedules as PDF or image',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Add your classes', text: 'Click "Add Class" and enter the class name, instructor, location, day, and time.' },
  { name: 'Choose colors', text: 'Select a color for each class to make your schedule easy to read at a glance.' },
  { name: 'Preview your schedule', text: 'See your schedule in the preview section below the form.' },
  { name: 'Export your schedule', text: 'Click "Export PDF" or "Export Image" to download your schedule for printing or sharing.' },
];

const faqs = [
  { 
    question: 'Can I add multiple classes on the same day?', 
    answer: 'Yes! You can add as many classes as you need. Each class can have its own day, time, and color. The schedule will display all classes in their correct time slots.' 
  },
  { 
    question: 'What formats can I export my schedule in?', 
    answer: 'You can export your schedule as a PDF document (great for printing) or as a PNG image (great for sharing on social media or messaging apps).' 
  },
  { 
    question: 'Is my schedule data saved?', 
    answer: 'Currently, schedules are not saved between sessions. Make sure to export your schedule before closing the page. We recommend exporting as PDF for a permanent copy.' 
  },
  { 
    question: 'Can I include weekend classes?', 
    answer: 'Yes, you can add classes on Saturday and Sunday. However, the PDF export currently only includes Monday through Friday. The preview shows all days.' 
  },
  { 
    question: 'How do I print my schedule?', 
    answer: 'Export your schedule as a PDF, then open the PDF file and use your browser or PDF reader\'s print function. For best results, use landscape orientation.' 
  },
];

const relatedTools = [
  { href: '/calculators/academic/pomodoro-timer', title: 'Pomodoro Timer', description: 'Stay focused with timed study sessions.' },
  { href: '/calculators/productivity/date-difference', title: 'Date Calculator', description: 'Calculate days between dates.' },
];

export default function ClassScheduleMakerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="class-schedule-maker"
          title="Class Schedule Maker"
          description="Create your weekly class schedule with custom colors and times. Export as PDF or image for easy printing and sharing."
          colorClass="bg-teal-100 text-teal-600"
        />

        <section aria-label="Class Schedule Maker">
          <ClassScheduleMaker />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
