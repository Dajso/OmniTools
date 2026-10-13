/**
 * Tidslinje for bryllupsplanleggingen
 */
export interface SaveTheDateInput { weddingDate: string; }
export interface TimelineEvent { event: string; date: string; daysFromNow: number; }
export interface SaveTheDateResult { events: TimelineEvent[]; }
export function calculateSaveTheDate(input: SaveTheDateInput): SaveTheDateResult {
    const wedding = new Date(input.weddingDate);
    if (isNaN(wedding.getTime())) throw new Error('Ugyldig dato');
    const now = new Date();
    const msPerDay = 86400000;
    const milestones = [
        { event: '💍 Sett dato og budsjett, og start planleggingen', daysBeforeWedding: 365 },
        { event: '📸 Book lokale og fotograf', daysBeforeWedding: 300 },
        { event: '💌 Send save the date', daysBeforeWedding: 240 },
        { event: '👗 Bestill brudekjole og dress', daysBeforeWedding: 210 },
        { event: '🎵 Book DJ eller band', daysBeforeWedding: 180 },
        { event: '💐 Book blomsterdekoratør', daysBeforeWedding: 150 },
        { event: '📄 Søk om prøving av ekteskapsvilkår hos Skatteetaten', daysBeforeWedding: 90 },
        { event: '📝 Send invitasjoner', daysBeforeWedding: 60 },
        { event: '⏰ Svarfrist (RSVP)', daysBeforeWedding: 30 },
        { event: '📋 Endelig gjesteantall til leverandørene', daysBeforeWedding: 14 },
        { event: '🥂 Siste gjennomgang og prøve dagen før', daysBeforeWedding: 1 },
        { event: '💒 Bryllupsdagen!', daysBeforeWedding: 0 },
    ];
    const fmt = (d: Date) => d.toLocaleDateString('nb-NO', { year: 'numeric', month: 'short', day: 'numeric' });
    const events = milestones.map(m => {
        const d = new Date(wedding); d.setDate(d.getDate() - m.daysBeforeWedding);
        return { event: m.event, date: fmt(d), daysFromNow: Math.ceil((d.getTime() - now.getTime()) / msPerDay) };
    });
    return { events };
}
