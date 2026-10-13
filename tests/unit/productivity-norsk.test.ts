import { describe, it, expect } from 'vitest';
import { convertTimezone } from '@/lib/calculations/productivity/timezone-converter';
import { describeCron, getNextRuns } from '@/lib/calculations/productivity/cron-generator';
import { calculateAge } from '@/lib/calculations/productivity/age-calculator';
import { convertCase } from '@/lib/calculations/productivity/case-converter';
import { countCharacters } from '@/lib/calculations/productivity/character-counter';
import { calculateImageResolution } from '@/lib/calculations/productivity/image-resolution-calculator';

describe('produktivitet på norsk', () => {
    it('tidssone: klokkeslettet tolkes i fra-sonen (Oslo → New York, vinter)', () => {
        const r = convertTimezone({ dateTime: '2025-01-15T12:00', fromTimezone: 'Europe/Oslo', toTimezone: 'America/New_York' });
        expect(r.toTime).toContain('06:00');
        expect(r.fromTime).toContain('12:00');
        expect(r.offset).toContain('UTC+1');
        expect(r.offset).toContain('UTC−5');
    });

    it('tidssone: sommertid i Norge (CEST = UTC+2)', () => {
        const r = convertTimezone({ dateTime: '2025-07-01T12:00', fromTimezone: 'Europe/Oslo', toTimezone: 'UTC' });
        expect(r.toTime).toContain('10:00');
        expect(r.isDST).toBe(false);
        const r2 = convertTimezone({ dateTime: '2025-07-01T12:00', fromTimezone: 'UTC', toTimezone: 'Europe/Oslo' });
        expect(r2.isDST).toBe(true);
    });

    it('cron: beskriver på norsk', () => {
        expect(describeCron({ minute: '0', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '1' })).toBe('Kjører kl. 09:00 hver mandag');
        expect(describeCron({ minute: '*/5', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' })).toBe('Kjører hvert 5. minutt');
    });

    it('cron: neste kjøringer følger uttrykket', () => {
        const from = new Date(2025, 0, 1, 10, 30); // onsdag 1. januar 2025
        const runs = getNextRuns({ minute: '0', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '1' }, 3, from);
        expect(runs).toHaveLength(3);
        expect(runs[0]).toMatch(/6\. jan/);
        expect(runs[1]).toMatch(/13\. jan/);
        expect(runs[0]).toContain('09:00');
    });

    it('alder: norske stjernetegn og ukedager', () => {
        const r = calculateAge({ birthDate: '2000-05-17', targetDate: '2025-05-17' });
        expect(r.years).toBe(25);
        expect(r.zodiacSign).toBe('Tyren');
        expect(r.dayOfWeekBorn).toBe('onsdag');
        expect(r.chineseZodiac).toBe('Drage');
    });

    it('tekstverktøy håndterer æ, ø og å', () => {
        expect(convertCase({ text: 'blåbærsyltetøy', targetCase: 'upper' }).converted).toBe('BLÅBÆRSYLTETØY');
        expect(convertCase({ text: 'øl er godt. åpent hus', targetCase: 'sentence' }).converted).toBe('Øl er godt. Åpent hus');
        expect(convertCase({ text: 'Blåbær og Ærlig', targetCase: 'snake' }).converted).toBe('blåbær_og_ærlig');
        const counts = countCharacters({ text: 'Åse og Ørjan!', includeSpaces: true });
        expect(counts.letters).toBe(10);
        expect(counts.specialCharacters).toBe(1);
    });

    it('bildeoppløsning regnes i cm', () => {
        const r = calculateImageResolution({ mode: 'calculate-print-size', widthPixels: 3543, heightPixels: 2480, dpi: 300 });
        expect(r.widthCm).toBeCloseTo(30, 0);
        expect(r.heightCm).toBeCloseTo(21, 0);
        const px = calculateImageResolution({ mode: 'calculate-pixels', widthCm: 21, heightCm: 29.7, dpi: 300 });
        expect(px.widthPixels).toBe(2480);
        expect(px.heightPixels).toBe(3508);
    });
});
