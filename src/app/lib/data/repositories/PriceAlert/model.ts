import z from 'zod';

// Price alert creation schema
export const createPriceAlertSchema = z.object({
  investmentId: z.string().min(1, 'Investment ID is required'),
  coinSymbol: z.string().min(1, 'Coin symbol is required'),
  coinName: z.string().min(1, 'Coin name is required'),
  sellPrice: z.number().positive('Sell price must be positive'),
  sellAmount: z.number().positive('Sell amount must be positive'),
  sellDate: z.string(), // ISO date string when sold
  profitEarned: z.number(), // Profit made from the sale
  buyBackPrice: z.number().positive('Buy back price must be positive'),
  currentPrice: z.number().positive('Current price is required'),
  priceDropThreshold: z.number().min(0.0001).max(50).default(10),
  priceIncreaseThreshold: z.number().min(0.0001).max(50).default(5),
  cooldownPeriod: z.number().min(1).default(24),
  emailEnabled: z.boolean().default(true),
  browserEnabled: z.boolean().default(true),
});

// Price alert update schema
export const updatePriceAlertSchema = z.object({
  alertStatus: z.enum(['active', 'triggered', 'paused', 'completed']).optional(),
  notifications: z.object({
    emailEnabled: z.boolean().optional(),
    browserEnabled: z.boolean().optional(),
    lastNotified: z.string().optional(),
    notificationCount: z.number().optional(),
  }).optional(),
  alertRules: z.object({
    priceDropThreshold: z.number().min(0.0001).max(50).optional(),
    priceIncreaseThreshold: z.number().min(0.0001).max(50).optional(),
    cooldownPeriod: z.number().min(1).optional(),
  }).optional(),
});

export type CreatePriceAlertInput = z.infer<typeof createPriceAlertSchema>;
export type UpdatePriceAlertInput = z.infer<typeof updatePriceAlertSchema>;
