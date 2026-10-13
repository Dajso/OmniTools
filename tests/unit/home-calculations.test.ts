import { describe, it, expect } from 'vitest';
import {
  calculatePaint,
  calculateConcrete,
  calculateTiles,
  calculateWallpaper,
  calculateCarpet,
  calculateElectricityCost,
  calculateHeatPumpNeed,
  calculateGravel,
  calculateGrassSeed,
  calculateFence,
  calculateDecking,
  calculateRoofPitch,
  calculateStairs,
  calculateArea,
  calculatePoolVolume,
  calculateLumber,
  calculateDrywall,
  calculateSolarPanels,
  calculateMulch,
} from '@/lib/calculations/home/home-calculations';

describe('Bolig: maling', () => {
  it('regner veggflate, fradrag og liter', () => {
    const r = calculatePaint({
      roomLength: 4, roomWidth: 3, wallHeight: 2.5,
      numberOfDoors: 1, numberOfWindows: 1, numberOfCoats: 2,
      coveragePerLiter: 10, includeCeiling: false,
    });
    expect(r.wallArea).toBe(35);
    expect(r.openingsArea).toBe(3.4);
    expect(r.paintableArea).toBe(31.6);
    expect(r.litersNeeded).toBe(6.32);
    expect(r.litersToBuy).toBe(6.5);
    expect(r.cans2_7).toBe(3);
  });

  it('tar med taket når det er valgt', () => {
    const r = calculatePaint({
      roomLength: 4, roomWidth: 3, wallHeight: 2.5,
      numberOfDoors: 0, numberOfWindows: 0, numberOfCoats: 1,
      coveragePerLiter: 10, includeCeiling: true,
    });
    expect(r.ceilingArea).toBe(12);
    expect(r.paintableArea).toBe(47);
  });

  it('avviser ugyldige mål', () => {
    expect(() => calculatePaint({
      roomLength: 0, roomWidth: 3, wallHeight: 2.5, numberOfDoors: 0,
      numberOfWindows: 0, numberOfCoats: 1, coveragePerLiter: 10, includeCeiling: false,
    })).toThrow();
  });
});

describe('Bolig: betong', () => {
  it('regner volum, vekt og sekker', () => {
    const r = calculateConcrete({ length: 4, width: 3, thicknessCm: 10, wastePercent: 10 });
    expect(r.volume).toBe(1.2);
    expect(r.volumeWithWaste).toBe(1.32);
    expect(r.weightKg).toBe(3036);
    expect(r.bags25kg).toBe(122);
  });
});

describe('Bolig: fliser', () => {
  it('runder opp antall fliser og esker', () => {
    const r = calculateTiles({
      roomLength: 3, roomWidth: 2, tileLengthCm: 30, tileWidthCm: 30, wastePercent: 10, tilesPerBox: 11,
    });
    expect(r.roomArea).toBe(6);
    expect(r.tilesNeeded).toBe(67);
    expect(r.totalTiles).toBe(74);
    expect(r.boxes).toBe(7);
  });

  it('gir null esker når eskestørrelse mangler', () => {
    const r = calculateTiles({
      roomLength: 3, roomWidth: 2, tileLengthCm: 30, tileWidthCm: 30, wastePercent: 0, tilesPerBox: 0,
    });
    expect(r.boxes).toBe(0);
  });
});

describe('Bolig: tapet', () => {
  it('regner baner og ruller for standard rull', () => {
    const r = calculateWallpaper({
      roomLength: 4, roomWidth: 3, wallHeight: 2.4, numberOfDoors: 1, numberOfWindows: 1,
      rollWidthCm: 53, rollLength: 10.05, patternRepeatCm: 0,
    });
    expect(r.perimeter).toBe(14);
    expect(r.stripsNeeded).toBe(25);
    expect(r.stripsPerRoll).toBe(4);
    expect(r.totalRolls).toBe(7);
  });

  it('runder banelengden opp til hele mønsterrapporter', () => {
    const r = calculateWallpaper({
      roomLength: 4, roomWidth: 3, wallHeight: 2.4, numberOfDoors: 0, numberOfWindows: 0,
      rollWidthCm: 53, rollLength: 10.05, patternRepeatCm: 64,
    });
    expect(r.stripLength).toBe(2.56);
  });
});

describe('Bolig: teppe', () => {
  it('velger leggeretningen med minst forbruk', () => {
    const r = calculateCarpet({ roomLength: 5, roomWidth: 3.5, rollWidth: 4, pricePerM2: 300 });
    expect(r.roomArea).toBe(17.5);
    expect(r.runningMeters).toBe(5.1);
    expect(r.estimatedCost).toBe(6120);
  });
});

describe('Bolig: strømkostnad', () => {
  it('regner kWh og kroner', () => {
    const r = calculateElectricityCost({
      watts: 2000, hoursPerDay: 3, daysPerMonth: 30, powerPriceOre: 100, gridPriceOre: 25,
    });
    expect(r.dailyKwh).toBe(6);
    expect(r.monthlyKwh).toBe(180);
    expect(r.totalPriceOre).toBe(125);
    expect(r.dailyCost).toBeCloseTo(7.5, 5);
    expect(r.monthlyCost).toBeCloseTo(225, 5);
  });

  it('avviser negative verdier', () => {
    expect(() => calculateElectricityCost({
      watts: -1, hoursPerDay: 1, daysPerMonth: 1, powerPriceOre: 1, gridPriceOre: 1,
    })).toThrow();
  });
});

describe('Bolig: varmepumpe', () => {
  it('anbefaler en standard størrelse', () => {
    const r = calculateHeatPumpNeed({
      roomLength: 6, roomWidth: 5, ceilingHeight: 2.4, insulation: 'modern', climate: 'coast',
      occupants: 2, sunnyRoom: false, isKitchen: false,
    });
    expect(r.area).toBe(30);
    expect(r.heatingKw).toBe(1.4);
    expect(r.recommendedKw).toBe(2.5);
  });

  it('gir større pumpe for dårlig isolert hus i kaldt klima', () => {
    const r = calculateHeatPumpNeed({
      roomLength: 8, roomWidth: 6, ceilingHeight: 2.4, insulation: 'poor', climate: 'cold',
      occupants: 2, sunnyRoom: false, isKitchen: false,
    });
    expect(r.recommendedKw).toBeGreaterThan(5);
  });
});

describe('Bolig: grus, gressfrø, barkflis', () => {
  it('regner tonn grus', () => {
    const r = calculateGravel({ length: 10, width: 3, depthCm: 10, density: 1700, compactionPercent: 15 });
    expect(r.volume).toBe(3);
    expect(r.volumeWithCompaction).toBe(3.45);
    expect(r.tons).toBe(5.87);
  });

  it('regner kg gressfrø for ny plen', () => {
    const r = calculateGrassSeed({ length: 10, width: 8, application: 'new', lawnType: 'general' });
    expect(r.area).toBe(80);
    expect(r.rateGramsPerM2).toBe(30);
    expect(r.seedKg).toBe(2.4);
  });

  it('bruker halv såmengde ved ettersåing', () => {
    const r = calculateGrassSeed({ length: 10, width: 10, application: 'overseed', lawnType: 'general' });
    expect(r.rateGramsPerM2).toBe(15);
  });

  it('regner liter barkflis', () => {
    const r = calculateMulch({ length: 5, width: 3, depthCm: 7 });
    expect(r.liters).toBe(1050);
    expect(r.bags50l).toBe(21);
    expect(r.bags80l).toBe(14);
  });
});

describe('Bolig: gjerde og terrasse', () => {
  it('regner stolper og bord', () => {
    const r = calculateFence({
      totalLength: 30, fenceHeightCm: 120, postSpacing: 2, numberOfGates: 1, boardWidthMm: 98, boardGapMm: 20,
    });
    expect(r.sections).toBe(15);
    expect(r.posts).toBe(17);
    expect(r.rails).toBe(30);
    expect(r.boards).toBe(255);
  });

  it('bruker tre løsholter ved høyt gjerde', () => {
    const r = calculateFence({
      totalLength: 10, fenceHeightCm: 180, postSpacing: 2, numberOfGates: 0, boardWidthMm: 98, boardGapMm: 20,
    });
    expect(r.rails).toBe(15);
  });

  it('regner terrassebord og bjelker', () => {
    const r = calculateDecking({
      deckLength: 5, deckWidth: 4, boardWidthMm: 120, boardLength: 4.8, boardGapMm: 5, joistSpacingCm: 60,
    });
    expect(r.area).toBe(20);
    expect(r.boardRows).toBe(32);
    expect(r.joists).toBe(10);
    expect(r.boardsNeeded).toBe(Math.ceil(32 * 2 * 1.1));
  });
});

describe('Bolig: takvinkel', () => {
  it('regner vinkel og prosent', () => {
    const r = calculateRoofPitch({ rise: 1, run: 1 });
    expect(r.degrees).toBe(45);
    expect(r.percentage).toBe(100);
    expect(r.rafterMultiplier).toBe(1.414);
  });

  it('flatt tak har null grader', () => {
    expect(calculateRoofPitch({ rise: 0, run: 5 }).degrees).toBe(0);
  });

  it('avviser horisontal lengde på null', () => {
    expect(() => calculateRoofPitch({ rise: 1, run: 0 })).toThrow();
  });
});

describe('Bolig: trapp', () => {
  it('deler høyden i like opptrinn', () => {
    const r = calculateStairs({ totalRiseCm: 260, availableRunCm: 280, stairWidthCm: 90 });
    expect(r.numberOfRisers).toBe(15);
    expect(r.numberOfTreads).toBe(14);
    expect(r.riserHeightCm).toBeCloseTo(17.3, 1);
    expect(r.treadDepthCm).toBe(20);
    expect(r.meetsCode).toBe(false);
  });

  it('godkjenner komfortabel trapp', () => {
    const r = calculateStairs({ totalRiseCm: 262.5, availableRunCm: 350, stairWidthCm: 90 });
    expect(r.treadDepthCm).toBe(25);
    expect(r.meetsCode).toBe(true);
  });

  it('flagger for smal trapp', () => {
    const r = calculateStairs({ totalRiseCm: 262.5, availableRunCm: 350, stairWidthCm: 70 });
    expect(r.meetsCode).toBe(false);
  });
});

describe('Bolig: areal', () => {
  it('regner rektangel', () => {
    const r = calculateArea({ shape: 'rectangle', length: 8, width: 5 });
    expect(r.areaM2).toBe(40);
    expect(r.perimeter).toBe(26);
    expect(r.areaDekar).toBe(0.04);
  });

  it('regner sirkel', () => {
    expect(calculateArea({ shape: 'circle', radius: 3 }).areaM2).toBe(28.27);
  });

  it('regner trekant og trapes', () => {
    expect(calculateArea({ shape: 'triangle', length: 6, height: 4 }).areaM2).toBe(12);
    expect(calculateArea({ shape: 'trapezoid', topWidth: 2, bottomWidth: 4, height: 3 }).areaM2).toBe(9);
  });

  it('avviser manglende mål', () => {
    expect(() => calculateArea({ shape: 'rectangle', length: 0, width: 5 })).toThrow();
  });
});

describe('Bolig: basseng', () => {
  it('regner liter for rektangulært basseng', () => {
    const r = calculatePoolVolume({ shape: 'rectangle', length: 5, width: 3, shallowDepth: 1, deepDepth: 1.5 });
    expect(r.volumeM3).toBe(18.8);
    expect(r.volumeLiters).toBe(18750);
  });

  it('bruker diameter for rundt basseng uten bredde', () => {
    const r = calculatePoolVolume({ shape: 'round', length: 4, width: 0, shallowDepth: 1, deepDepth: 1 });
    expect(r.surfaceArea).toBeCloseTo(12.6, 1);
  });
});

describe('Bolig: trelast og gips', () => {
  it('regner løpemeter, volum og pris', () => {
    const r = calculateLumber({ thicknessMm: 48, widthMm: 148, length: 4.8, quantity: 10, pricePerMeter: 35 });
    expect(r.totalMeters).toBe(48);
    expect(r.volumeM3).toBe(0.341);
    expect(r.totalCost).toBe(1680);
  });

  it('regner gipsplater med 10 % svinn', () => {
    const r = calculateDrywall({
      roomLength: 4, roomWidth: 3, wallHeight: 2.4, includeCeiling: false, numberOfDoors: 0,
      numberOfWindows: 0, sheetSize: '1200x2400',
    });
    expect(r.totalArea).toBe(33.6);
    expect(r.sheetsNeeded).toBe(Math.ceil((33.6 * 1.1) / (1.2 * 2.4)));
  });
});

describe('Bolig: solceller', () => {
  const base = {
    annualUsageKwh: 16000, region: 'south' as const, panelWattage: 430, maxPanels: 0,
    costPerKwp: 15000, electricityPrice: 1.2, sellPrice: 0.5, selfUsePercent: 40,
  };

  it('dimensjonerer etter forbruk', () => {
    const r = calculateSolarPanels(base);
    expect(r.numberOfPanels).toBe(42);
    expect(r.annualProductionKwh).toBeGreaterThan(15000);
    expect(r.paybackYears).not.toBeNull();
  });

  it('begrenser av maks antall paneler', () => {
    const r = calculateSolarPanels({ ...base, maxPanels: 10 });
    expect(r.numberOfPanels).toBe(10);
    expect(r.systemSizeKwp).toBe(4.3);
  });

  it('gir lengre tilbakebetalingstid i nord enn i sør', () => {
    const south = calculateSolarPanels({ ...base, maxPanels: 10 });
    const north = calculateSolarPanels({ ...base, maxPanels: 10, region: 'north' });
    expect(north.paybackYears!).toBeGreaterThan(south.paybackYears!);
  });
});
