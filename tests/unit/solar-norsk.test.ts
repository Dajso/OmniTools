import { describe, it, expect } from 'vitest';
import { calculateSolarROI } from '@/lib/calculations/solar/solar-roi';
import { calculateSunPeakHours } from '@/lib/calculations/solar/sun-peak-hours';
import { calculateDCWireGauge } from '@/lib/calculations/solar/dc-wire-gauge';
import { calculateRainwaterCollection } from '@/lib/calculations/solar/rainwater-collection';
import { calculateGeneratorFuel } from '@/lib/calculations/solar/generator-fuel';
import { calculateDCPower } from '@/lib/calculations/solar/dc-power';
import { calculateSolarPanelTilt } from '@/lib/calculations/solar/solar-panel-tilt';

describe('solceller på norsk', () => {
    it('regner tilbakebetalingstid i kroner', () => {
        const r = calculateSolarROI({
            systemCost: 150000, annualProductionKWh: 7200, electricityRate: 1.2,
            rateIncreasePercent: 0, lifespanYears: 30, maintenanceCost: 0, incentive: 0,
            selfConsumptionPercent: 100,
        });
        expect(r.netCost).toBe(150000);
        expect(r.annualSavingsYear1).toBeCloseTo(8640, 0);
        expect(r.paybackYears).toBeGreaterThan(16);
        expect(r.paybackYears).toBeLessThan(18);
    });

    it('trekker fra støtte og melder om anlegg som aldri betaler seg', () => {
        const r = calculateSolarROI({
            systemCost: 500000, annualProductionKWh: 1000, electricityRate: 0.5,
            rateIncreasePercent: 0, lifespanYears: 20, maintenanceCost: 0, incentive: 50000,
        });
        expect(r.netCost).toBe(450000);
        expect(r.neverPaysBack).toBe(true);
    });

    it('gir fullasttimer for Oslo, med mer om sommeren enn vinteren', () => {
        const r = calculateSunPeakHours({ latitude: 59.9, panelWatts: 400 });
        expect(r.summerHours).toBeGreaterThan(r.winterHours);
        expect(r.annualEnergyKWh).toBeGreaterThan(250);
        expect(r.annualEnergyKWh).toBeLessThan(500);
    });

    it('kabeltverrsnitt gis i mm² og ligger i standardrekka', () => {
        const r = calculateDCWireGauge({ amps: 20, lengthM: 8, voltage: 12, maxDropPercent: 3 });
        expect([1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120]).toContain(r.recommendedMm2);
        expect(r.voltageDropPercent).toBeLessThanOrEqual(3);
    });

    it('lengre kabel eller høyere strøm gir ikke tynnere kabel', () => {
        const a = calculateDCWireGauge({ amps: 20, lengthM: 5, voltage: 12, maxDropPercent: 3 });
        const b = calculateDCWireGauge({ amps: 20, lengthM: 15, voltage: 12, maxDropPercent: 3 });
        expect(b.recommendedMm2).toBeGreaterThanOrEqual(a.recommendedMm2);
    });

    it('regnvann: 1 mm på 1 m² er 1 liter', () => {
        const r = calculateRainwaterCollection({ roofAreaM2: 100, annualRainfallMm: 1000, efficiencyPercent: 100 });
        expect(r.annualLiters).toBe(100000);
        expect(r.annualCubicMeters).toBe(100);
        expect(r.monthlyLiters).toBe(8333);
    });

    it('aggregat: bensin 3 kW ved 50 % bruker ca. 0,67 l/t', () => {
        const r = calculateGeneratorFuel({ ratedWatts: 3000, loadPercent: 50, tankLiters: 15, fuelType: 'gasoline' });
        expect(r.fuelPerHour).toBeCloseTo(0.67, 1);
        expect(r.runtimeHours).toBeGreaterThan(20);
        expect(r.runtimeFormatted).toMatch(/^\d+ t \d+ min$/);
    });

    it('aggregat: avviser ugyldige verdier på norsk', () => {
        expect(() => calculateGeneratorFuel({ ratedWatts: 0, loadPercent: 50, tankLiters: 10, fuelType: 'diesel' })).toThrow(/Merkeeffekten/);
    });

    it('P = U × I', () => {
        expect(calculateDCPower({ solveFor: 'watts', amps: 10, volts: 12 }).watts).toBe(120);
        expect(calculateDCPower({ solveFor: 'amps', watts: 120, volts: 12 }).amps).toBe(10);
        expect(() => calculateDCPower({ solveFor: 'volts', watts: 120 })).toThrow(/watt og ampere/);
    });

    it('solcellevinkel for Oslo er ca. 49° mot sør', () => {
        const r = calculateSolarPanelTilt({ latitude: 59.9, season: 'annual' });
        expect(r.tiltAngle).toBeCloseTo(48.6, 0);
        expect(r.azimuth).toContain('sør');
    });
});
