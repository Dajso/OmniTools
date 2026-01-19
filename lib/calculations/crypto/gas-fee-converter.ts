/**
 * Gas Fee Converter
 * 
 * Converts Ethereum gas fees between Gwei and USD equivalent,
 * and calculates transaction costs based on gas usage.
 * 
 * @module lib/calculations/crypto/gas-fee-converter
 * @see Requirements 22.1
 */

import { convertEthereumUnits, gweiToEther } from './ethereum-units';

/**
 * Error class for gas fee calculation errors
 */
export class GasFeeError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'calculation_error',
    public field?: string
  ) {
    super(message);
    this.name = 'GasFeeError';
  }
}

/**
 * Common transaction types with typical gas usage
 */
export const COMMON_GAS_LIMITS: Record<string, number> = {
  'ETH Transfer': 21000,
  'ERC-20 Transfer': 65000,
  'ERC-20 Approval': 46000,
  'Uniswap Swap': 150000,
  'NFT Mint': 150000,
  'NFT Transfer': 85000,
  'Contract Deployment': 1000000,
  'DeFi Deposit': 200000,
  'DeFi Withdrawal': 150000,
  'Bridge Transaction': 250000,
};

/**
 * Input for gas fee calculation
 */
export interface GasFeeInput {
  /** Gas price in Gwei */
  gasPriceGwei: number;
  /** Gas limit (units of gas) */
  gasLimit: number;
  /** Current ETH price in USD */
  ethPriceUsd: number;
}

/**
 * Result of gas fee calculation
 */
export interface GasFeeResult {
  /** Gas cost in Gwei */
  costGwei: number;
  /** Gas cost in ETH */
  costEth: number;
  /** Gas cost in USD */
  costUsd: number;
  /** Formatted cost string */
  formatted: string;
  /** Gas price used */
  gasPriceGwei: number;
  /** Gas limit used */
  gasLimit: number;
  /** ETH price used */
  ethPriceUsd: number;
}


/**
 * Calculate gas fee for a transaction
 * 
 * @param input - Gas fee calculation input
 * @returns Gas fee result with costs in multiple units
 */
export function calculateGasFee(input: GasFeeInput): GasFeeResult {
  const { gasPriceGwei, gasLimit, ethPriceUsd } = input;

  // Validate inputs
  if (gasPriceGwei < 0) {
    throw new GasFeeError(
      'Gas price cannot be negative',
      'invalid_input',
      'gasPriceGwei'
    );
  }
  if (gasLimit <= 0) {
    throw new GasFeeError(
      'Gas limit must be positive',
      'invalid_input',
      'gasLimit'
    );
  }
  if (ethPriceUsd <= 0) {
    throw new GasFeeError(
      'ETH price must be positive',
      'invalid_input',
      'ethPriceUsd'
    );
  }

  // Calculate costs
  const costGwei = gasPriceGwei * gasLimit;
  const costEth = gweiToEther(costGwei);
  const costUsd = costEth * ethPriceUsd;

  // Format the result
  const formatted = costUsd < 0.01
    ? `$${costUsd.toFixed(4)}`
    : `$${costUsd.toFixed(2)}`;

  return {
    costGwei,
    costEth,
    costUsd,
    formatted,
    gasPriceGwei,
    gasLimit,
    ethPriceUsd,
  };
}

/**
 * Convert Gwei to USD
 * 
 * @param gwei - Amount in Gwei
 * @param ethPriceUsd - Current ETH price in USD
 * @returns USD equivalent
 */
export function gweiToUsd(gwei: number, ethPriceUsd: number): number {
  if (ethPriceUsd <= 0) {
    throw new GasFeeError(
      'ETH price must be positive',
      'invalid_input',
      'ethPriceUsd'
    );
  }
  const eth = gweiToEther(gwei);
  return eth * ethPriceUsd;
}

/**
 * Convert USD to Gwei
 * 
 * @param usd - Amount in USD
 * @param ethPriceUsd - Current ETH price in USD
 * @returns Gwei equivalent
 */
export function usdToGwei(usd: number, ethPriceUsd: number): number {
  if (ethPriceUsd <= 0) {
    throw new GasFeeError(
      'ETH price must be positive',
      'invalid_input',
      'ethPriceUsd'
    );
  }
  const eth = usd / ethPriceUsd;
  // Convert ETH to Gwei (1 ETH = 10^9 Gwei)
  return eth * 1e9;
}

/**
 * Calculate gas costs for multiple transaction types
 * 
 * @param gasPriceGwei - Current gas price in Gwei
 * @param ethPriceUsd - Current ETH price in USD
 * @returns Array of transaction types with their costs
 */
export function calculateCommonTransactionCosts(
  gasPriceGwei: number,
  ethPriceUsd: number
): Array<{ type: string; gasLimit: number; costUsd: number; costEth: number }> {
  return Object.entries(COMMON_GAS_LIMITS).map(([type, gasLimit]) => {
    const result = calculateGasFee({ gasPriceGwei, gasLimit, ethPriceUsd });
    return {
      type,
      gasLimit,
      costUsd: result.costUsd,
      costEth: result.costEth,
    };
  });
}


/**
 * EIP-1559 gas fee calculation input
 */
export interface EIP1559GasFeeInput {
  /** Base fee in Gwei */
  baseFeeGwei: number;
  /** Priority fee (tip) in Gwei */
  priorityFeeGwei: number;
  /** Gas limit (units of gas) */
  gasLimit: number;
  /** Current ETH price in USD */
  ethPriceUsd: number;
}

/**
 * EIP-1559 gas fee calculation result
 */
export interface EIP1559GasFeeResult extends GasFeeResult {
  /** Base fee in Gwei */
  baseFeeGwei: number;
  /** Priority fee in Gwei */
  priorityFeeGwei: number;
  /** Max fee per gas (base + priority) */
  maxFeePerGas: number;
  /** Base fee cost in USD */
  baseFeeUsd: number;
  /** Priority fee cost in USD */
  priorityFeeUsd: number;
}

/**
 * Calculate EIP-1559 gas fee
 * 
 * @param input - EIP-1559 gas fee calculation input
 * @returns Gas fee result with EIP-1559 specific fields
 */
export function calculateEIP1559GasFee(input: EIP1559GasFeeInput): EIP1559GasFeeResult {
  const { baseFeeGwei, priorityFeeGwei, gasLimit, ethPriceUsd } = input;

  // Validate inputs
  if (baseFeeGwei < 0) {
    throw new GasFeeError(
      'Base fee cannot be negative',
      'invalid_input',
      'baseFeeGwei'
    );
  }
  if (priorityFeeGwei < 0) {
    throw new GasFeeError(
      'Priority fee cannot be negative',
      'invalid_input',
      'priorityFeeGwei'
    );
  }
  if (gasLimit <= 0) {
    throw new GasFeeError(
      'Gas limit must be positive',
      'invalid_input',
      'gasLimit'
    );
  }
  if (ethPriceUsd <= 0) {
    throw new GasFeeError(
      'ETH price must be positive',
      'invalid_input',
      'ethPriceUsd'
    );
  }

  const maxFeePerGas = baseFeeGwei + priorityFeeGwei;
  const costGwei = maxFeePerGas * gasLimit;
  const costEth = gweiToEther(costGwei);
  const costUsd = costEth * ethPriceUsd;

  const baseFeeUsd = gweiToEther(baseFeeGwei * gasLimit) * ethPriceUsd;
  const priorityFeeUsd = gweiToEther(priorityFeeGwei * gasLimit) * ethPriceUsd;

  const formatted = costUsd < 0.01
    ? `$${costUsd.toFixed(4)}`
    : `$${costUsd.toFixed(2)}`;

  return {
    costGwei,
    costEth,
    costUsd,
    formatted,
    gasPriceGwei: maxFeePerGas,
    gasLimit,
    ethPriceUsd,
    baseFeeGwei,
    priorityFeeGwei,
    maxFeePerGas,
    baseFeeUsd,
    priorityFeeUsd,
  };
}

/**
 * Estimate gas price tier based on urgency
 * 
 * @param baseFeeGwei - Current base fee in Gwei
 * @returns Gas price recommendations for different urgency levels
 */
export function estimateGasPriceTiers(baseFeeGwei: number): {
  slow: { priorityFee: number; maxFee: number; waitTime: string };
  standard: { priorityFee: number; maxFee: number; waitTime: string };
  fast: { priorityFee: number; maxFee: number; waitTime: string };
  instant: { priorityFee: number; maxFee: number; waitTime: string };
} {
  return {
    slow: {
      priorityFee: 0.5,
      maxFee: baseFeeGwei * 1.1 + 0.5,
      waitTime: '~10 minutes',
    },
    standard: {
      priorityFee: 1.5,
      maxFee: baseFeeGwei * 1.25 + 1.5,
      waitTime: '~3 minutes',
    },
    fast: {
      priorityFee: 3,
      maxFee: baseFeeGwei * 1.5 + 3,
      waitTime: '~1 minute',
    },
    instant: {
      priorityFee: 5,
      maxFee: baseFeeGwei * 2 + 5,
      waitTime: '~15 seconds',
    },
  };
}
