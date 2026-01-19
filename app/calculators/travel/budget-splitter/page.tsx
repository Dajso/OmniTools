import { Metadata } from 'next';
import { TravelBudgetSplitter } from '@/components/calculators/travel/travel-budget-splitter';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Travel Budget Splitter - Split Group Expenses',
  description: 'Split travel expenses fairly among your group. Track who paid what and calculate who owes whom to settle up.',
  keywords: ['expense splitter', 'split bill', 'travel budget', 'group expenses', 'trip cost calculator', 'who owes whom'],
  alternates: { canonical: '/calculators/travel/budget-splitter' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Travel Budget Splitter',
  description: 'Split travel expenses fairly among your group',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Add people', text: 'Enter the names of everyone in your travel group.' },
  { name: 'Add expenses', text: 'Record each expense with description, amount, and who paid.' },
  { name: 'Select who splits', text: 'Choose which people should split each expense.' },
  { name: 'View balances', text: 'See who is owed money and who owes money.' },
  { name: 'Settle up', text: 'Follow the settlement suggestions to balance everyone out.' },
];

const faqs = [
  { 
    question: 'How does the splitting work?', 
    answer: 'Each expense is divided equally among the people selected to split it. The person who paid gets credit, and everyone in the split owes their share. The calculator then figures out the minimum payments needed to settle up.' 
  },
  { 
    question: 'Can I split expenses unequally?', 
    answer: 'Currently, expenses are split equally among selected participants. For unequal splits, you can add separate expenses for each person\'s share.' 
  },
  { 
    question: 'What if someone didn\'t participate in an expense?', 
    answer: 'Simply uncheck that person from the "Split between" selection for that expense. They won\'t be included in that particular split.' 
  },
  { 
    question: 'How are settlements calculated?', 
    answer: 'The calculator uses a debt simplification algorithm to minimize the number of transactions needed. Instead of everyone paying everyone, it finds the most efficient way to settle all debts.' 
  },
  { 
    question: 'Can I use different currencies?', 
    answer: 'The calculator works with any currency, but all amounts should be in the same currency. Use our Currency Converter to convert amounts before entering them.' 
  },
];

const relatedTools = [
  { href: '/calculators/travel/currency-converter', title: 'Currency Converter', description: 'Convert between currencies.' },
  { href: '/calculators/finance/tip-calculator', title: 'Tip Calculator', description: 'Calculate tips for your group.' },
  { href: '/calculators/travel/packing-list', title: 'Packing List Generator', description: 'Generate a packing list.' },
];

export default function BudgetSplitterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="travel-budget-splitter"
          title="Travel Budget Splitter"
          description="Split travel expenses fairly among your group. Track who paid what, see individual balances, and get simple settlement suggestions."
          colorClass="bg-emerald-100 text-emerald-600"
          category="Travel"
        />

        <section aria-label="Travel Budget Splitter">
          <TravelBudgetSplitter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
