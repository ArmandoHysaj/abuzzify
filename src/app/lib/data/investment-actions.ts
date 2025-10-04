'use server';

import { z } from 'zod';
import { createServerAction } from '../server-actions/server-action';
import {
  createInvestmentDomain,
  getInvestmentsByUserIdDomain,
  getInvestmentByIdDomain,
  updateInvestmentDomain,
  deleteInvestmentDomain,
  createScenarioDomain,
  getScenariosByUserIdDomain,
  getScenarioByIdDomain,
  updateScenarioDomain,
  deleteScenarioDomain,
  calculateInvestmentResults
} from './domain/investment';
import {
  InvestmentCalculationInput,
  CreateInvestmentInput,
  CreateScenarioInput,
  UpdateInvestmentInput,
  UpdateScenarioInput
} from './repositories/Investment/model';

// Investment calculation schema
const investmentCalculationSchema = z.object({
  coinSymbol: z.string().min(1, 'Coin symbol is required'),
  coinName: z.string().min(1, 'Coin name is required'),
  initialInvestment: z.number().positive('Initial investment must be positive'),
  monthlyContribution: z.number().min(0, 'Monthly contribution must be non-negative'),
  investmentPeriod: z.number().positive('Investment period must be positive'),
  expectedReturn: z.number().positive('Expected return must be positive'),
  currentPrice: z.number().positive('Current price must be positive'),
});

// Investment update schema
const investmentUpdateSchema = z.object({
  investmentId: z.string().min(1, 'Investment ID is required'),
  updates: z.object({
    coinSymbol: z.string().optional(),
    coinName: z.string().optional(),
    initialInvestment: z.number().positive().optional(),
    monthlyContribution: z.number().min(0).optional(),
    investmentPeriod: z.number().positive().optional(),
    expectedReturn: z.number().positive().optional(),
    currentPrice: z.number().positive().optional(),
  })
});

// Scenario creation schema
const scenarioCreationSchema = z.object({
  name: z.string().min(1, 'Scenario name is required'),
  description: z.string().optional(),
  investments: z.array(z.object({
    coinSymbol: z.string(),
    coinName: z.string(),
    initialInvestment: z.number(),
    monthlyContribution: z.number(),
    investmentPeriod: z.number(),
    expectedReturn: z.number(),
    currentPrice: z.number(),
    calculatedResults: z.object({
      totalInvested: z.number(),
      totalValue: z.number(),
      totalGain: z.number(),
      gainPercentage: z.number(),
      finalPrice: z.number(),
    }),
  }))
});

// Scenario update schema
const scenarioUpdateSchema = z.object({
  scenarioId: z.string().min(1, 'Scenario ID is required'),
  updates: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    investments: z.array(z.any()).optional(),
  })
});

// Create investment action
export const createInvestmentAction = createServerAction()
  .input(investmentCalculationSchema)
  .withAuth({ optional: false })
  .handler(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new Error('User not authenticated');
    }

    const investmentData: CreateInvestmentInput = {
      ...input,
      calculatedResults: {
        totalInvested: 0,
        totalValue: 0,
        totalGain: 0,
        gainPercentage: 0,
        finalPrice: 0,
      }
    };

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

// Create scenario action
export const createScenarioAction = createServerAction()
  .input(scenarioCreationSchema)
  .withAuth({ optional: false })
  .handler(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new Error('User not authenticated');
    }

    // Calculate individual investment results first
    const investmentsWithCalculatedResults = input.investments.map((inv: any) => {
      const calculatedResults = calculateInvestmentResults(
        inv.initialInvestment,
        inv.monthlyContribution,
        inv.investmentPeriod,
        inv.expectedReturn,
        inv.currentPrice
      );
      
      return {
        ...inv,
        calculatedResults
      };
    });

    // Calculate portfolio totals
    const totalPortfolioValue = investmentsWithCalculatedResults.reduce((sum: number, inv: any) => sum + inv.calculatedResults.totalValue, 0);
    const totalInvested = investmentsWithCalculatedResults.reduce((sum: number, inv: any) => sum + inv.calculatedResults.totalInvested, 0);
    const totalGain = totalPortfolioValue - totalInvested;
    const gainPercentage = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

    const scenarioData: CreateScenarioInput = {
      ...input,
      investments: investmentsWithCalculatedResults,
      totalPortfolioValue,
      totalInvested,
      totalGain,
      gainPercentage
    };

    const result = await createScenarioDomain(ctx.user.id, scenarioData);
    return result;
  });

// Get user scenarios action
export const getUserScenariosAction = createServerAction()
  .withAuth({ optional: false })
  .handler(async ({ ctx }) => {
    if (!ctx.user) {
      throw new Error('User not authenticated');
    }

    return await getScenariosByUserIdDomain(ctx.user.id);
  });

// Get scenario by ID action
export const getScenarioByIdAction = createServerAction()
  .input(z.object({ scenarioId: z.string() }))
  .withAuth({ optional: false })
  .handler(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new Error('User not authenticated');
    }

    const scenario = await getScenarioByIdDomain(input.scenarioId);
    
    // Verify the scenario belongs to the user
    if (scenario && scenario.userId !== ctx.user.id) {
      throw new Error('Unauthorized access to scenario');
    }

    return scenario;
  });

// Update scenario action
export const updateScenarioAction = createServerAction()
  .input(scenarioUpdateSchema)
  .withAuth({ optional: false })
  .handler(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new Error('User not authenticated');
    }

    // Verify the scenario belongs to the user
    const scenario = await getScenarioByIdDomain(input.scenarioId);
    if (!scenario || scenario.userId !== ctx.user.id) {
      throw new Error('Unauthorized access to scenario');
    }

    return await updateScenarioDomain(input.scenarioId, input.updates);
  });

// Delete scenario action
export const deleteScenarioAction = createServerAction()
  .input(z.object({ scenarioId: z.string() }))
  .withAuth({ optional: false })
  .handler(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new Error('User not authenticated');
    }

    // Verify the scenario belongs to the user
    const scenario = await getScenarioByIdDomain(input.scenarioId);
    if (!scenario || scenario.userId !== ctx.user.id) {
      throw new Error('Unauthorized access to scenario');
    }

    return await deleteScenarioDomain(input.scenarioId);
  });
