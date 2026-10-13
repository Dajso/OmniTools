import { describe, it, expect } from 'vitest';
import { convert, getAllConversionPairs, getConversionPair, generateFormula, conversionSlug } from '@/lib/conversions';
import { getToolsByCategory } from '@/lib/constants/tool-registry';
import { getUnit, unitsByCategory } from '@/lib/constants/units';
import { convertNumberBase } from '@/lib/calculations/productivity/number-base-converter';

describe('omregnere på norsk', () => {
    it('norsk mil er 10 km', () => {
        expect(convert(1, 'norwegianMile', 'kilometer', 'length')).toBeCloseTo(10, 10);
        expect(convert(3, 'kilometer', 'norwegianMile', 'length')).toBeCloseTo(0.3, 10);
    });

    it('spiseskje og teskje er 15 og 5 ml', () => {
        expect(convert(1, 'tablespoon', 'milliliter', 'volume')).toBeCloseTo(15, 10);
        expect(convert(1, 'teaspoon', 'milliliter', 'volume')).toBeCloseTo(5, 10);
        expect(convert(1, 'deciliter', 'milliliter', 'volume')).toBeCloseTo(100, 10);
    });

    it('dekar er 1000 m²', () => {
        expect(convert(1, 'decare', 'squareMeter', 'area')).toBeCloseTo(1000, 10);
        expect(convert(1, 'hectare', 'decare', 'area')).toBeCloseTo(10, 10);
    });

    it('metrisk hestekraft (hk) og kW', () => {
        expect(convert(100, 'horsepowerMetric', 'kilowatt', 'power')).toBeCloseTo(73.55, 2);
        expect(convert(1, 'kilowatt', 'horsepowerMetric', 'power')).toBeCloseTo(1.3596, 3);
    });

    it('drivstofforbruk: l/100 km, km/l, l/mil og mpg', () => {
        expect(convert(5, 'litersPer100Km', 'kmPerLiter', 'fuelEconomy')).toBeCloseTo(20, 10);
        expect(convert(20, 'kmPerLiter', 'litersPer100Km', 'fuelEconomy')).toBeCloseTo(5, 10);
        expect(convert(0.6, 'litersPerMil', 'litersPer100Km', 'fuelEconomy')).toBeCloseTo(6, 10);
        expect(convert(35, 'mpgUs', 'litersPer100Km', 'fuelEconomy')).toBeCloseTo(6.72, 2);
        expect(convert(35, 'mpgUk', 'litersPer100Km', 'fuelEconomy')).toBeCloseTo(8.07, 2);
    });

    it('vinkel, kraft og tetthet', () => {
        expect(convert(180, 'degree', 'radian', 'angle')).toBeCloseTo(Math.PI, 10);
        expect(convert(100, 'degree', 'gradian', 'angle')).toBeCloseTo(111.111, 2);
        expect(convert(1, 'kilopond', 'newton', 'force')).toBeCloseTo(9.80665, 5);
        expect(convert(1, 'gramPerCubicCentimeter', 'kilogramPerCubicMeter', 'density')).toBeCloseTo(1000, 8);
    });

    it('alle enhets-IDer er unike på tvers av kategorier', () => {
        const ids = Object.values(unitsByCategory).flatMap((units) => Object.keys(units));
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('enheter har norske navn og symboler', () => {
        expect(getUnit('length', 'foot')?.name).toBe('Fot');
        expect(getUnit('speed', 'kilometerPerHour')?.symbol).toBe('km/t');
        expect(getUnit('weight', 'pound')?.name).toBe('Pund');
    });

    it('formelen bruker komma som desimaltegn', () => {
        const pair = getConversionPair('meter-to-foot')!;
        const f = generateFormula(pair.from, pair.to, pair.category);
        expect(f).toContain('3,2808');
        expect(f).not.toContain('3.28');
    });

    it('alle enhetspar kan slås opp', () => {
        const pairs = getAllConversionPairs();
        expect(pairs.length).toBeGreaterThan(500);
        for (const p of pairs) expect(getConversionPair(`${p.from}-to-${p.to}`)).not.toBeNull();
    });

    it('tallsystem: 255 = FF = 11111111 = 377', () => {
        const r = convertNumberBase('255', 10);
        expect(r.hexadecimal).toBe('FF');
        expect(r.binary).toBe('11111111');
        expect(r.octal).toBe('377');
        expect(convertNumberBase('0xff', 16).decimal).toBe('255');
        expect(convertNumberBase('1111 1111', 2).decimal).toBe('255');
        expect(convertNumberBase('-10', 10).hexadecimal).toBe('-A');
        expect(convertNumberBase('18446744073709551616', 10).hexadecimal).toBe('10000000000000000');
        expect(() => convertNumberBase('12', 2)).toThrow();
        expect(() => convertNumberBase('', 10)).toThrow(/Skriv inn/);
    });

    it('adressene er små bokstaver (kebab-case) og gamle camelCase-adresser tolkes fortsatt', () => {
        expect(conversionSlug('squareFoot', 'squareMeter')).toBe('square-foot-to-square-meter');
        expect(getConversionPair('square-foot-to-square-meter')?.from.id).toBe('squareFoot');
        expect(getConversionPair('squareFoot-to-squareMeter')?.to.id).toBe('squareMeter');
        expect(getConversionPair('liters-per100-km-to-km-per-liter')?.category).toBe('fuelEconomy');
    });

    it('alle omregnere i registeret peker på en adresse som finnes', () => {
        for (const tool of getToolsByCategory('converter')) {
            if (!tool.path.startsWith('/convert/')) continue;
            const slug = tool.path.replace('/convert/', '');
            expect(slug).toMatch(/^[a-z0-9-]+$/);
            expect(getConversionPair(slug), tool.id).not.toBeNull();
        }
    });
});
