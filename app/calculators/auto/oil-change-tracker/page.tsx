import { Metadata } from 'next';
import { OilChangeTracker } from '@/components/calculators/auto';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Oil Change Tracker - Service Reminder & Log',
  description: 'Track your oil changes and get reminders when service is due. Log your maintenance history and see average intervals between changes.',
  keywords: ['oil change tracker', 'car maintenance', 'oil change reminder', 'service log', 'vehicle maintenance'],
  alternates: { canonical: '/calculators/auto/oil-change-tracker' },
};

export default function OilChangeTrackerPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="oil-change-tracker"
        title="Oil Change Tracker"
        description="Track your oil changes and get reminders when service is due. Log your maintenance history and see average intervals."
      />
      <OilChangeTracker />
    </main>
  );
}
