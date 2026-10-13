/**
 * Save the Date Timeline
 */
export interface SaveTheDateInput { weddingDate: string; }
export interface TimelineEvent { event: string; date: string; daysFromNow: number; }
export interface SaveTheDateResult { events: TimelineEvent[]; }
export function calculateSaveTheDate(input: SaveTheDateInput): SaveTheDateResult {
    const wedding = new Date(input.weddingDate);
    if (isNaN(wedding.getTime())) throw new Error('Invalid date');
    const now = new Date();
    const msPerDay = 86400000;
    const milestones = [
        { event: '💍 Start Planning', daysBeforeWedding: 365 },
        { event: '📸 Book Photographer & Venue', daysBeforeWedding: 300 },
        { event: '💌 Send Save-the-Dates', daysBeforeWedding: 240 },
        { event: '👗 Order Attire', daysBeforeWedding: 210 },
        { event: '🎵 Book DJ / Band', daysBeforeWedding: 180 },
        { event: '💐 Book Florist', daysBeforeWedding: 150 },
        { event: '📝 Send Invitations', daysBeforeWedding: 60 },
        { event: '⏰ RSVP Deadline', daysBeforeWedding: 30 },
        { event: '📋 Final Headcount to Vendors', daysBeforeWedding: 14 },
        { event: '🎉 Rehearsal Dinner', daysBeforeWedding: 1 },
        { event: '💒 Wedding Day!', daysBeforeWedding: 0 },
    ];
    const fmt = (d: Date) => d.toLocaleDateString('nb-NO', { year: 'numeric', month: 'short', day: 'numeric' });
    const events = milestones.map(m => {
        const d = new Date(wedding); d.setDate(d.getDate() - m.daysBeforeWedding);
        return { event: m.event, date: fmt(d), daysFromNow: Math.ceil((d.getTime() - now.getTime()) / msPerDay) };
    });
    return { events };
}
