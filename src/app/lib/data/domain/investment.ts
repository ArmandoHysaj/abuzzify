import { logger } from '../../utils/logger';
import { investmentRepository } from '../repositories/Investment/investmentRepository';
import {
  InvestmentRecord,
  CreateInvestmentInput,
  UpdateInvestmentInput
} from '../repositories/Investment/model';

// Investment calculation logic for single investment
export function calculateSingleInvestmentResults(
  initialInvestment: number,
  initialCoinPrice: number,
  currentPrice: number
) {
  // Calculate number of coins purchased
  const numberOfCoins = initialInvestment / initialCoinPrice;
  
  // Calculate current value
  const currentValue = numberOfCoins * currentPrice;
  
  // Calculate profit/loss
  const profitLoss = currentValue - initialInvestment;
  
  // Calculate percentage change
  const percentageChange = ((currentPrice / initialCoinPrice) - 1) * 100;

  return {
    totalInvested: initialInvestment,
    totalValue: currentValue,
    totalGain: profitLoss,
    gainPercentage: percentageChange,
    finalPrice: currentPrice,
    numberOfCoins
  };
}

// Investment calculation logic for DCA/projected scenarios
export function calculateInvestmentResults(
  initialInvestment: number,
  monthlyContribution: number,
  investmentPeriod: number, // in months
  expectedReturn: number, // annual percentage
  currentPrice: number
) {
  const monthlyRate = expectedReturn / 100 / 12;
  const totalMonths = investmentPeriod;

  // Calculate total invested amount
  const totalInvested = initialInvestment + (monthlyContribution * (totalMonths - 1));

  // Calculate future value using compound interest formula
  let futureValue = initialInvestment * Math.pow(1 + monthlyRate, totalMonths);
  
  if (monthlyContribution > 0) {
    // Add future value of monthly contributions (annuity)
    const annuityValue = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    futureValue += annuityValue;
  }

  const totalGain = futureValue - totalInvested;
  const gainPercentage = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;
  const finalPrice = currentPrice * (futureValue / initialInvestment);

  return {
    totalInvested,
    totalValue: futureValue,
    totalGain,
    gainPercentage,
    finalPrice
  };
}

// Domain functions for investments
export async function createInvestmentDomain(
  userId: string,
  investmentData: CreateInvestmentInput
): Promise<{ investmentId: string }> {
  // The investment data should already have calculated results from the server action
  if (!investmentData.calculatedResults) {
    throw new Error('Calculated results are required for investment creation');
  }

  const investmentWithResults: CreateInvestmentInput = {
    ...investmentData
  };

  const investmentId = await investmentRepository.createInvestment(userId, investmentWithResults);
  
  logger.info('✅ Investment created via domain', { userId, investmentId });
  
  return { investmentId };
}

export async function getInvestmentsByUserIdDomain(userId: string): Promise<InvestmentRecord[]> {
  return await investmentRepository.getInvestmentsByUserId(userId);
}

export async function getInvestmentByIdDomain(investmentId: string): Promise<InvestmentRecord | null> {
  return await investmentRepository.getInvestmentById(investmentId);
}

export async function updateInvestmentDomain(
  investmentId: string,
  updates: UpdateInvestmentInput,
  currentPrice?: number
): Promise<{ success: boolean; error?: string }> {
  // If any calculation inputs are updated, recalculate results
  if (updates.initialInvestment || updates.initialCoinPrice || updates.monthlyContribution || 
      updates.investmentPeriod || updates.expectedReturn) {
    
    // Get current investment to get all values
    const currentInvestment = await investmentRepository.getInvestmentById(investmentId);
    if (!currentInvestment) {
      return { success: false, error: 'Investment not found' };
    }

    // Merge updates with current values
    const updatedData = {
      ...currentInvestment,
      ...updates
    };

    let calculatedResults;
    
    // If there's no monthly contribution, it's a single investment
    if (updatedData.monthlyContribution === 0 && updatedData.investmentPeriod === 1) {
      // For single investments, we need current price to calculate results
      if (!currentPrice) {
        currentPrice = updatedData.calculatedResults.finalPrice; // Use the saved final price as fallback
      }
      calculatedResults = calculateSingleInvestmentResults(
        updatedData.initialInvestment,
        updatedData.initialCoinPrice,
        currentPrice
      );
    } else {
      // For DCA/projected investments, use the original calculation
      calculatedResults = calculateInvestmentResults(
        updatedData.initialInvestment,
        updatedData.monthlyContribution,
        updatedData.investmentPeriod,
        updatedData.expectedReturn,
        currentPrice || updatedData.initialCoinPrice
      );
    }

    updates.calculatedResults = calculatedResults;
  }

  return await investmentRepository.updateInvestment(investmentId, updates);
}

export async function deleteInvestmentDomain(investmentId: string): Promise<{ success: boolean; error?: string }> {
  return await investmentRepository.deleteInvestment(investmentId);
}

