/**
 * Health and Fitness Calculation Functions
 * 
 * @module lib/calculations/health
 */

export * from './bmi-calculator';
export { calculateTDEE, type TDEEInputs, type TDEEResults, type ActivityLevel, type MacroBreakdown, type BiologicalSex } from './tdee-calculator';
export { calculateMacros as calculateMacroNutrients, type MacroInputs, type MacroResults, type MacroGoal } from './macro-calculator';
export * from './one-rep-max';
export * from './water-intake';
export * from './due-date';
export * from './ovulation';
export { calculateBAC, type BACInputs, type BACResults } from './bac-calculator';
export * from './pace-calculator';
export { calculateBodyFat, type BodyFatInputs, type BodyFatResults } from './body-fat';
export * from './sleep-cycle';
export * from './pet-age';
export * from './size-converters';
export * from './cooking-converter';
export * from './oven-temperature';
export * from './smoking-cost';
export * from './intermittent-fasting';
