import z from 'zod';

// Investment calculation input schema
export const investmentCalculationSchema = z.object({
  coinSymbol: z.string().min(1, 'Coin symbol is required'),
  coinName: z.string().min(1, 'Coin name is required'),
  initialInvestment: z.number().positive('Initial investment must be positive'),
  initialCoinPrice: z.number().positive('Initial coin price must be positive'),
  investmentDate: z.string().optional(), // ISO date string
  monthlyContribution: z.number().min(0, 'Monthly contribution must be non-negative'),
  investmentPeriod: z.number().positive('Investment period must be positive'),
  expectedReturn: z.number().positive('Expected return must be positive'),
  currentMarketPrice: z.number().positive('Current market price is required'),
});

// Investment record schema (what gets stored in Firestore)
export const investmentRecordSchema = z.object({
  id: z.string(),
  userId: z.string(),
  coinSymbol: z.string(),
  coinName: z.string(),
  initialInvestment: z.number(),
  initialCoinPrice: z.number(),
  investmentDate: z.string().optional(), // ISO date string
  monthlyContribution: z.number(),
  investmentPeriod: z.number(), // in months
  expectedReturn: z.number(), // annual percentage
  calculatedResults: z.object({
    totalInvested: z.number(),
    totalValue: z.number(),
    totalGain: z.number(),
    gainPercentage: z.number(),
    finalPrice: z.number(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Investment scenario schema (for saving scenarios)
export const investmentScenarioSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1, 'Scenario name is required'),
  description: z.string().optional(),
  investments: z.array(investmentRecordSchema.omit({ id: true, userId: true, createdAt: true, updatedAt: true })),
  totalPortfolioValue: z.number(),
  totalInvested: z.number(),
  totalGain: z.number(),
  gainPercentage: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Form data types
export type InvestmentCalculationInput = z.infer<typeof investmentCalculationSchema>;
export type InvestmentRecord = z.infer<typeof investmentRecordSchema>;
export type InvestmentScenario = z.infer<typeof investmentScenarioSchema>;

// Repository input types
export type CreateInvestmentInput = Omit<InvestmentRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type CreateScenarioInput = Omit<InvestmentScenario, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type UpdateInvestmentInput = Partial<Omit<InvestmentRecord, 'id' | 'userId' | 'createdAt'>>;
export type UpdateScenarioInput = Partial<Omit<InvestmentScenario, 'id' | 'userId' | 'createdAt'>>;
