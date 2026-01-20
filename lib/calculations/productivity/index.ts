// Productivity calculations
export * from './word-counter';
export * from './password-generator';
export * from './character-counter';
export * from './random-number-generator';
export * from './uuid-generator';
export * from './lorem-ipsum-generator';
export * from './case-converter';
export * from './text-to-binary';
export * from './hex-to-rgb';
export * from './timestamp-converter';
export * from './percentage-calculator';
export * from './age-calculator';
export * from './date-difference';
export * from './timezone-converter';
// gpa-calculator is also in academic, so we rename exports here to avoid conflicts
export {
    calculateGPA as calculateProductivityGPA,
    AVAILABLE_GRADES as PRODUCTIVITY_AVAILABLE_GRADES,
    type GPAInputs as ProductivityGPAInputs,
    type GPAResults as ProductivityGPAResults
} from './gpa-calculator';
export * from './grade-calculator';
export * from './aspect-ratio-calculator';
export * from './image-resolution-calculator';
export * from './json-formatter';
export * from './base64-converter';
