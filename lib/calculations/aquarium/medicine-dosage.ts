/**
 * Medicine Dosage Calculator
 * Calculate aquarium medication dosing based on tank volume.
 * @module lib/calculations/aquarium/medicine-dosage
 */

export const MEDICATIONS: Record<string, {
    name: string;
    concentration: string;
    mlPer10Liters: number;
    notes: string;
}> = {
    'malachite-green': {
        name: 'Malakittgrønt (0,1 %)',
        concentration: '0.1%',
        mlPer10Liters: 0.5,
        notes: 'Mot flekksyke (ich). Halver dosen for fisk uten skjell.',
    },
    'methylene-blue': {
        name: 'Metylenblått (1 %)',
        concentration: '1%',
        mlPer10Liters: 1.0,
        notes: 'Mot soppinfeksjoner og til behandling av rogn. Kan farge dekor.',
    },
    'ich-x': {
        name: 'Ich-X (Hikari)',
        concentration: 'Standard',
        mlPer10Liters: 1.3,
        notes: 'Mot flekksyke, fløyelssyke og soppinfeksjoner. Trygt for de fleste fisk.',
    },
    'general-cure': {
        name: 'API General Cure',
        concentration: 'Pulver',
        mlPer10Liters: 0,
        notes: '1 pose per 38 liter. Mot parasittinfeksjoner.',
    },
    'melafix': {
        name: 'API Melafix',
        concentration: 'Standard',
        mlPer10Liters: 1.3,
        notes: 'Mot bakterieinfeksjoner, finneråte og sår.',
    },
    'seachem-paraguard': {
        name: 'Seachem ParaGuard',
        concentration: 'Standard',
        mlPer10Liters: 1.3,
        notes: 'Mot ytre parasitter og sopp- og bakterieinfeksjoner.',
    },
    'custom': {
        name: 'Egen medisin',
        concentration: 'Egendefinert',
        mlPer10Liters: 1.0,
        notes: 'Legg inn din egen doseringsrate.',
    },
};

export interface MedicineDosageInput {
    /** Tank volume in liters */
    volumeLiters: number;
    /** Medication key */
    medication: string;
    /** Custom ml per 10 liters (if medication='custom') */
    customDose?: number;
}

export interface MedicineDosageResult {
    doseMl: number;
    doseTeaspoons: number;
    medicationName: string;
    notes: string;
}

export function calculateMedicineDosage(input: MedicineDosageInput): MedicineDosageResult {
    const { volumeLiters, medication, customDose } = input;

    if (volumeLiters <= 0) throw new Error('Volumet må være positivt');

    const med = MEDICATIONS[medication];
    if (!med) throw new Error('Ukjent medisin');

    const mlPer10L = medication === 'custom' && customDose
        ? customDose
        : med.mlPer10Liters;

    const doseMl = (volumeLiters / 10) * mlPer10L;

    return {
        doseMl: Math.round(doseMl * 100) / 100,
        doseTeaspoons: Math.round(doseMl / 4.929 * 100) / 100,
        medicationName: med.name,
        notes: med.notes,
    };
}
