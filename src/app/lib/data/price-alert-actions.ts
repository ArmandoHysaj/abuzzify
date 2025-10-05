'use server';

import { createServerAction } from '@/app/lib/server-actions/server-action';
import { z } from 'zod';
import { PriceAlertDomain } from './domain/priceAlert';
import { PriceAlertRepository } from './repositories/PriceAlert/priceAlertRepository';
import { requireAuth } from '@/app/lib/auth/server';
import { PriceAlert, CreatePriceAlertInput, UpdatePriceAlertInput } from './repositories/Investment/model';

// Initialize domain
const priceAlertRepository = new PriceAlertRepository();
const priceAlertDomain = new PriceAlertDomain(priceAlertRepository);

// Schemas
const createPriceAlertSchema = z.object({
  investmentId: z.string().min(1, 'Investment ID is required'),
  coinSymbol: z.string().min(1, 'Coin symbol is required'),
  coinName: z.string().min(1, 'Coin name is required'),
  sellPrice: z.number().positive('Sell price must be positive'),
  sellAmount: z.number().positive('Sell amount must be positive'),
  sellDate: z.string(), // ISO date string when sold
  profitEarned: z.number(), // Profit made from the sale
  currentPrice: z.number().positive('Current price is required'),
  priceDropThreshold: z.number().min(1).max(50).default(10),
  priceIncreaseThreshold: z.number().min(1).max(50).default(5),
  cooldownPeriod: z.number().min(1).default(24),
  emailEnabled: z.boolean().default(true),
  browserEnabled: z.boolean().default(true),
});

const updatePriceAlertSchema = z.object({
  alertId: z.string(),
  updates: z.object({
    alertStatus: z.enum(['active', 'triggered', 'paused', 'completed']).optional(),
    notifications: z.object({
      emailEnabled: z.boolean().optional(),
      browserEnabled: z.boolean().optional(),
    }).optional(),
    alertRules: z.object({
      priceDropThreshold: z.number().min(1).max(50).optional(),
      priceIncreaseThreshold: z.number().min(1).max(50).optional(),
      cooldownPeriod: z.number().min(1).optional(),
    }).optional(),
  }),
});

const deletePriceAlertSchema = z.object({
  alertId: z.string(),
});

const getPriceAlertsSchema = z.object({});

const getPriceAlertByIdSchema = z.object({
  alertId: z.string(),
});

const checkPriceAlertsSchema = z.object({
  currentPrices: z.record(z.string(), z.number()),
});

// Server Actions
export const createPriceAlertAction = createServerAction()
  .input(createPriceAlertSchema)
  .withAuth()
  .handler(async ({ input, ctx }) => {
    const result = await priceAlertDomain.createPriceAlert(ctx.user!.id, input);
    return result;
  });

export const updatePriceAlertAction = createServerAction()
  .input(updatePriceAlertSchema)
  .withAuth()
  .handler(async ({ input, ctx }) => {
    await priceAlertDomain.updatePriceAlert(input.alertId, input.updates);
    return { success: true };
  });

export const deletePriceAlertAction = createServerAction()
  .input(deletePriceAlertSchema)
  .withAuth()
  .handler(async ({ input, ctx }) => {
    await priceAlertDomain.deletePriceAlert(input.alertId);
    return { success: true };
  });

export const getUserPriceAlertsAction = createServerAction()
  .input(getPriceAlertsSchema)
  .withAuth()
  .handler(async ({ input, ctx }) => {
    const alerts = await priceAlertDomain.getUserPriceAlerts(ctx.user!.id);
    return alerts;
  });

export const getPriceAlertByIdAction = createServerAction()
  .input(getPriceAlertByIdSchema)
  .withAuth()
  .handler(async ({ input, ctx }) => {
    const alert = await priceAlertDomain.getPriceAlertById(input.alertId);
    return alert;
  });

export const checkPriceAlertsAction = createServerAction()
  .input(checkPriceAlertsSchema)
  .withAuth()
  .handler(async ({ input, ctx }) => {
    const results = await priceAlertDomain.checkPriceAlerts(input.currentPrices);
    return results;
  });

// Helper function to get current prices (you'll need to implement this based on your price data source)
export const getCurrentPricesAction = createServerAction()
  .input(z.object({ coinSymbols: z.array(z.string()) }))
  .withAuth()
  .handler(async ({ input, ctx }) => {
    // This is a placeholder - you'll need to implement this based on your price data source
    // For now, returning mock data
    const mockPrices: Record<string, number> = {};
    input.coinSymbols.forEach((symbol: string) => {
      mockPrices[symbol] = Math.random() * 100; // Mock price
    });
    return mockPrices;
  });
