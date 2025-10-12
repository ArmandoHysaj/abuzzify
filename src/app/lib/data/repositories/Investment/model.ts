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

// Price alert schema for buy/sell notifications
export const priceAlertSchema = z.object({
  id: z.string(),
  userId: z.string(),
  investmentId: z.string(), // Reference to the investment this alert is based on
  coinSymbol: z.string().min(1, 'Coin symbol is required'),
  coinName: z.string().min(1, 'Coin name is required'),
  alertType: z.enum(['sell-price', 'buy-back', 'price-monitor']),
  sellPrice: z.number().positive('Sell price must be positive'),
  sellAmount: z.number().positive('Sell amount must be positive'),
  sellDate: z.string(), // ISO date string when sold
  profitEarned: z.number(), // Profit made from the sale
  buyBackPrice: z.number().positive('Buy back price must be positive'), // Target price to buy back
  currentPrice: z.number().positive('Current price is required'),
  alertStatus: z.enum(['active', 'triggered', 'paused', 'completed']),
  notifications: z.object({
    emailEnabled: z.boolean().default(true),
    browserEnabled: z.boolean().default(true),
    lastNotified: z.string().optional(),
    notificationCount: z.number().default(0),
  }),
  alertRules: z.object({
    priceDropThreshold: z.number().min(1).max(50).default(10), // % drop to trigger buy back alert
    priceIncreaseThreshold: z.number().min(1).max(50).default(5), // % increase to warn against buying
    cooldownPeriod: z.number().min(1).default(24), // Hours between notifications
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Form data types
export type InvestmentCalculationInput = z.infer<typeof investmentCalculationSchema>;
export type InvestmentRecord = z.infer<typeof investmentRecordSchema>;
export type PriceAlert = z.infer<typeof priceAlertSchema>;

// Repository input types
export type CreateInvestmentInput = Omit<InvestmentRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type CreatePriceAlertInput = Omit<PriceAlert, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'alertType' | 'alertStatus' | 'notifications' | 'alertRules'> & {
  priceDropThreshold?: number;
  priceIncreaseThreshold?: number;
  cooldownPeriod?: number;
  emailEnabled?: boolean;
  browserEnabled?: boolean;
  buyBackPrice?: number; // Optional - will be calculated if not provided
};
export type UpdateInvestmentInput = Partial<Omit<InvestmentRecord, 'id' | 'userId' | 'createdAt'>>;
export type UpdatePriceAlertInput = Partial<Omit<PriceAlert, 'id' | 'userId' | 'createdAt'>>;
