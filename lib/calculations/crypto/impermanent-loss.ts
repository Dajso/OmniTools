/**
 * Impermanent Loss Calculator
 * 
 * Calculates impermanent loss for DeFi liquidity pool providers.
 * Impermanent loss occurs when the price ratio of tokens in a liquidity
 * pool changes compared to when they were deposited.
 * 
 * @module lib/calculations/crypto/impermanent-loss
 * @see Requirements 22.2
 */

/**
 * Error class for impermanent loss calculation errors
 */
export class ImpermanentLossError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'calculation_error',
    public field?: string
  ) {
    super(message);
    this.name = 'ImpermanentLossError';
  }
}

/**
 * Input for impermanent loss calculation
 */
export interface ImpermanentLossInput {
  /** Initial price of token A in terms of token B (or USD) */
  initialPriceA: number;
  /** Current price of token A in terms of token B (or USD) */
  currentPriceA: number;
  /** Initial price of token B (optional, defaults to 1 for stablecoin pairs) */
  initialPriceB?: number;
  /** Current price of token B (optional, defaults to 1 for stablecoin pairs) */
  currentPriceB?: number;
  /** Initial investment amount in USD (optional, for value calculations) */
  initialInvestment?: number;
}

/**
 * Result of impermanent loss calculation
 */
export interface ImpermanentLossResult {
  /** Impermanent loss as a percentage (negative value indicates loss) */
  impermanentLossPercent: number;
  /** Price ratio change (current / initial) */
  priceRatioChange: number;
  /** Value if held (HODL) vs providing liquidity */
  holdValue: number;
  /** Value in liquidity pool */
  lpValue: number;
  /** Absolute loss in USD (if initial investment provided) */
  absoluteLoss: number;
  /** Formatted impermanent loss string */
  formatted: string;
  /** Whether the position is in profit (LP value > hold value) */
  isProfit: boolean;
}


/**
 * Calculate impermanent loss for a liquidity pool position
 * 
 * The formula for impermanent loss is:
 * IL = 2 * sqrt(priceRatio) / (1 + priceRatio) - 1
 * 
 * Where priceRatio = currentPrice / initialPrice
 * 
 * @param input - Impermanent loss calculation input
 * @returns Impermanent loss result with all metrics
 */
export function calculateImpermanentLoss(input: ImpermanentLossInput): ImpermanentLossResult {
  const {
    initialPriceA,
    currentPriceA,
    initialPriceB = 1,
    currentPriceB = 1,
    initialInvestment = 1000,
  } = input;

  // Validate inputs
  if (initialPriceA <= 0) {
    throw new ImpermanentLossError(
      'Initial price of token A must be positive',
      'invalid_input',
      'initialPriceA'
    );
  }
  if (currentPriceA <= 0) {
    throw new ImpermanentLossError(
      'Current price of token A must be positive',
      'invalid_input',
      'currentPriceA'
    );
  }
  if (initialPriceB <= 0) {
    throw new ImpermanentLossError(
      'Initial price of token B must be positive',
      'invalid_input',
      'initialPriceB'
    );
  }
  if (currentPriceB <= 0) {
    throw new ImpermanentLossError(
      'Current price of token B must be positive',
      'invalid_input',
      'currentPriceB'
    );
  }
  if (initialInvestment < 0) {
    throw new ImpermanentLossError(
      'Initial investment cannot be negative',
      'invalid_input',
      'initialInvestment'
    );
  }

  // Calculate price ratio change
  // For a 50/50 pool, we need to consider both tokens
  const initialRatio = initialPriceA / initialPriceB;
  const currentRatio = currentPriceA / currentPriceB;
  const priceRatioChange = currentRatio / initialRatio;

  // Calculate impermanent loss using the standard formula
  // IL = 2 * sqrt(r) / (1 + r) - 1
  // where r is the price ratio change
  const sqrtRatio = Math.sqrt(priceRatioChange);
  const ilFactor = (2 * sqrtRatio) / (1 + priceRatioChange);
  const impermanentLossPercent = (ilFactor - 1) * 100;

  // Calculate hold value (if tokens were just held)
  // Assuming 50/50 split at initial investment
  const initialTokenAValue = initialInvestment / 2;
  const initialTokenBValue = initialInvestment / 2;
  
  // Amount of each token at initial investment
  const tokenAAmount = initialTokenAValue / initialPriceA;
  const tokenBAmount = initialTokenBValue / initialPriceB;
  
  // Current value if held
  const holdValue = (tokenAAmount * currentPriceA) + (tokenBAmount * currentPriceB);

  // LP value = holdValue * (1 + IL)
  // Since IL is negative for losses, this reduces the value
  const lpValue = holdValue * ilFactor;

  // Absolute loss
  const absoluteLoss = lpValue - holdValue;

  // Format the result
  const formatted = impermanentLossPercent >= 0
    ? `+${impermanentLossPercent.toFixed(2)}%`
    : `${impermanentLossPercent.toFixed(2)}%`;

  return {
    impermanentLossPercent,
    priceRatioChange,
    holdValue,
    lpValue,
    absoluteLoss,
    formatted,
    isProfit: impermanentLossPercent >= 0,
  };
}


/**
 * Calculate impermanent loss from price ratio directly
 * 
 * Simplified version that takes just the price ratio change
 * 
 * @param priceRatioChange - The ratio of current price to initial price
 * @returns Impermanent loss as a percentage (negative for loss)
 */
export function calculateILFromRatio(priceRatioChange: number): number {
  if (priceRatioChange <= 0) {
    throw new ImpermanentLossError(
      'Price ratio must be positive',
      'invalid_input',
      'priceRatioChange'
    );
  }

  const sqrtRatio = Math.sqrt(priceRatioChange);
  const ilFactor = (2 * sqrtRatio) / (1 + priceRatioChange);
  return (ilFactor - 1) * 100;
}

/**
 * Calculate the break-even fee APY needed to offset impermanent loss
 * 
 * @param impermanentLossPercent - The impermanent loss percentage
 * @param daysInPool - Number of days the position has been in the pool
 * @returns Required APY to break even
 */
export function calculateBreakEvenAPY(
  impermanentLossPercent: number,
  daysInPool: number
): number {
  if (daysInPool <= 0) {
    throw new ImpermanentLossError(
      'Days in pool must be positive',
      'invalid_input',
      'daysInPool'
    );
  }

  // Convert IL to positive value (since it's typically negative)
  const ilAbsolute = Math.abs(impermanentLossPercent);
  
  // Annualize the loss
  const annualizedLoss = (ilAbsolute / daysInPool) * 365;
  
  return annualizedLoss;
}

/**
 * Generate impermanent loss data for a range of price changes
 * Useful for creating charts
 * 
 * @param minRatio - Minimum price ratio (e.g., 0.1 for -90% price drop)
 * @param maxRatio - Maximum price ratio (e.g., 10 for 10x price increase)
 * @param steps - Number of data points to generate
 * @returns Array of price ratio and IL pairs
 */
export function generateILCurve(
  minRatio: number = 0.1,
  maxRatio: number = 10,
  steps: number = 100
): Array<{ priceRatio: number; impermanentLoss: number }> {
  const result: Array<{ priceRatio: number; impermanentLoss: number }> = [];
  
  const logMin = Math.log(minRatio);
  const logMax = Math.log(maxRatio);
  const logStep = (logMax - logMin) / (steps - 1);
  
  for (let i = 0; i < steps; i++) {
    const priceRatio = Math.exp(logMin + i * logStep);
    const impermanentLoss = calculateILFromRatio(priceRatio);
    result.push({ priceRatio, impermanentLoss });
  }
  
  return result;
}

/**
 * Common impermanent loss scenarios for reference
 */
export const IL_SCENARIOS = [
  { priceChange: '1.25x (25% up)', ratio: 1.25, il: calculateILFromRatio(1.25) },
  { priceChange: '1.5x (50% up)', ratio: 1.5, il: calculateILFromRatio(1.5) },
  { priceChange: '1.75x (75% up)', ratio: 1.75, il: calculateILFromRatio(1.75) },
  { priceChange: '2x (100% up)', ratio: 2, il: calculateILFromRatio(2) },
  { priceChange: '3x (200% up)', ratio: 3, il: calculateILFromRatio(3) },
  { priceChange: '4x (300% up)', ratio: 4, il: calculateILFromRatio(4) },
  { priceChange: '5x (400% up)', ratio: 5, il: calculateILFromRatio(5) },
  { priceChange: '0.8x (20% down)', ratio: 0.8, il: calculateILFromRatio(0.8) },
  { priceChange: '0.5x (50% down)', ratio: 0.5, il: calculateILFromRatio(0.5) },
  { priceChange: '0.25x (75% down)', ratio: 0.25, il: calculateILFromRatio(0.25) },
];
