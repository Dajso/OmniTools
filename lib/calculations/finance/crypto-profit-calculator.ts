/**
 * Crypto Profit/Loss Calculator
 * 
 * @module lib/calculations/finance/crypto-profit-calculator
 * @see Requirements 5.12
 */

export interface CryptoProfitInputs {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  buyFeePercent: number;
  sellFeePercent: number;
}

export interface CryptoProfitResults {
  investmentAmount: number;
  buyFee: number;
  sellFee: number;
  totalFees: number;
  saleProceeds: number;
  profitLoss: number;
  profitLossPercent: number;
  isProfit: boolean;
}

export function calculateCryptoProfit(inputs: CryptoProfitInputs): CryptoProfitResults {
  const { buyPrice, sellPrice, quantity, buyFeePercent, sellFeePercent } = inputs;
  
  if (buyPrice <= 0) throw new Error('Buy price must be positive');
  if (sellPrice < 0) throw new Error('Sell price cannot be negative');
  if (quantity <= 0) throw new Error('Quantity must be positive');

  const investmentAmount = buyPrice * quantity;
  const buyFee = investmentAmount * (buyFeePercent / 100);
  const totalCost = investmentAmount + buyFee;

  const grossProceeds = sellPrice * quantity;
  const sellFee = grossProceeds * (sellFeePercent / 100);
  const saleProceeds = grossProceeds - sellFee;

  const totalFees = buyFee + sellFee;
  const profitLoss = saleProceeds - totalCost;
  const profitLossPercent = (profitLoss / totalCost) * 100;

  return {
    investmentAmount,
    buyFee,
    sellFee,
    totalFees,
    saleProceeds,
    profitLoss,
    profitLossPercent,
    isProfit: profitLoss >= 0,
  };
}
