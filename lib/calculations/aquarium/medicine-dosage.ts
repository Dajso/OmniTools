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
        name: 'Malachite Green (0.1%)',
        concentration: '0.1%',
        mlPer10Liters: 0.5,
        notes: 'For ich/white spot disease. Reduce dose by 50% for scaleless fish.',
    },
    'methylene-blue': {
        name: 'Methylene Blue (1%)',
        concentration: '1%',
        mlPer10Liters: 1.0,
        notes: 'For fungal infections and egg treatment. May stain decorations.',
    },
    'ich-x': {
        name: 'Ich-X (Hikari)',
        concentration: 'Standard',
        mlPer10Liters: 1.3,
        notes: 'For ich, velvet, and fungal infections. Safe for most fish.',
    },
    'general-cure': {
        name: 'API General Cure',
        concentration: 'Powder',
        mlPer10Liters: 0,
        notes: '1 packet per 38 liters. For parasitic infections.',
    },
    'melafix': {
        name: 'API Melafix',
        concentration: 'Standard',
        mlPer10Liters: 1.3,
        notes: 'For bacterial infections, fin rot, and ulcers.',
    },
    'seachem-paraguard': {
        name: 'Seachem ParaGuard',
        concentration: 'Standard',
        mlPer10Liters: 1.3,
        notes: 'External parasites and fungal/bacterial infections.',
    },
    'custom': {
        name: 'Custom Medication',
        concentration: 'Custom',
        mlPer10Liters: 1.0,
        notes: 'Enter your own dosing rate.',
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

    if (volumeLiters <= 0) throw new Error('Volume must be positive');

    const med = MEDICATIONS[medication];
    if (!med) throw new Error('Unknown medication');

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
