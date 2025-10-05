'use server';

import { z } from 'zod';
import { createServerAction } from '../server-actions/server-action';
import {
  createInvestmentDomain,
  getInvestmentsByUserIdDomain,
  getInvestmentByIdDomain,
  updateInvestmentDomain,
  deleteInvestmentDomain,
  calculateInvestmentResults,
  calculateSingleInvestmentResults
} from './domain/investment';
import {
  InvestmentCalculationInput,
  CreateInvestmentInput,
  UpdateInvestmentInput,
  investmentCalculationSchema
} from './repositories/Investment/model';



// Investment update schema
const investmentUpdateSchema = z.object({
  investmentId: z.string().min(1, 'Investment ID is required'),
  updates: z.object({
    coinSymbol: z.string().optional(),
    coinName: z.string().optional(),
    initialInvestment: z.number().positive().optional(),
    initialCoinPrice: z.number().positive().optional(),
    currentPrice: z.number().positive().optional(),
    investmentDate: z.string().optional(),
    monthlyContribution: z.number().min(0).optional(),
    investmentPeriod: z.number().min(1).optional(),
    expectedReturn: z.number().optional(),
    calculatedResults: z.object({
      totalInvested: z.number(),
      totalValue: z.number(),
      totalGain: z.number(),
      gainPercentage: z.number(),
      finalPrice: z.number()
    }).optional()
  })
});

// Calculate investment results action
export const calculateInvestmentResultsAction = createServerAction()
  .input(investmentCalculationSchema)
  .handler(async ({ input }) => {
    const results = calculateSingleInvestmentResults(
      input.initialInvestment,
      input.initialCoinPrice,
      input.currentPrice
    );

    return {
      ...results,
      coinSymbol: input.coinSymbol,
      coinName: input.coinName
    };
  });

// Create investment action
export const createInvestmentAction = createServerAction()
  .input(investmentCalculationSchema)
  .withAuth({ optional: false })
  .handler(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new Error('User not authenticated');
    }

    // Calculate results using the domain function
    const calculatedResults = calculateSingleInvestmentResults(
      input.initialInvestment,
      input.initialCoinPrice,
      input.currentMarketPrice
    );

    // Build investment data, filtering out undefined values
    const investmentData: CreateInvestmentInput = {
      coinSymbol: input.coinSymbol,
      coinName: input.coinName,
      initialInvestment: input.initialInvestment,
      initialCoinPrice: input.initialCoinPrice,
      monthlyContribution: input.monthlyContribution,
      investmentPeriod: input.investmentPeriod,
      expectedReturn: input.expectedReturn,
      calculatedResults: {
        totalInvested: calculatedResults.totalInvested,
        totalValue: calculatedResults.totalValue,
        totalGain: calculatedResults.totalGain,
        gainPercentage: calculatedResults.gainPercentage,
        finalPrice: calculatedResults.finalPrice
      }
    };

    // Only include investmentDate if it's provided
    if (input.investmentDate) {
      investmentData.investmentDate = input.investmentDate;
    }

    const result = await createInvestmentDomain(ctx.user.id, investmentData);
    return result;
  });

// Get user investments action
export const getUserInvestmentsAction = createServerAction()
  .withAuth({ optional: false })
  .handler(async ({ ctx }) => {
    if (!ctx.user) {
      throw new Error('User not authenticated');
    }

    return await getInvestmentsByUserIdDomain(ctx.user.id);
  });

// Get investment by ID action
export const getInvestmentByIdAction = createServerAction()
  .input(z.object({ investmentId: z.string() }))
  .withAuth({ optional: false })
  .handler(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new Error('User not authenticated');
    }

    const investment = await getInvestmentByIdDomain(input.investmentId);
    
    // Verify the investment belongs to the user
    if (investment && investment.userId !== ctx.user.id) {
      throw new Error('Unauthorized access to investment');
    }

    return investment;
  });

// Update investment action
export const updateInvestmentAction = createServerAction()
  .input(investmentUpdateSchema)
  .withAuth({ optional: false })
  .handler(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new Error('User not authenticated');
    }

    // Verify the investment belongs to the user
    const investment = await getInvestmentByIdDomain(input.investmentId);
    if (!investment || investment.userId !== ctx.user.id) {
      throw new Error('Unauthorized access to investment');
    }

    return await updateInvestmentDomain(input.investmentId, input.updates);
  });

// Delete investment action
export const deleteInvestmentAction = createServerAction()
  .input(z.object({ investmentId: z.string() }))
  .withAuth({ optional: false })
  .handler(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new Error('User not authenticated');
    }

    // Verify the investment belongs to the user
    const investment = await getInvestmentByIdDomain(input.investmentId);
    if (!investment || investment.userId !== ctx.user.id) {
      throw new Error('Unauthorized access to investment');
    }

    return await deleteInvestmentDomain(input.investmentId);
  });