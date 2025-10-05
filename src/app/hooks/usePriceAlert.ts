'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import {
  createPriceAlertAction,
  getUserPriceAlertsAction,
  getPriceAlertByIdAction,
  updatePriceAlertAction,
  deletePriceAlertAction,
  checkPriceAlertsAction
} from '@/app/lib/data/price-alert-actions';
import { PriceAlert } from '@/app/lib/data/repositories/Investment/model';

export const usePriceAlert = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated
  const requireAuth = useCallback(() => {
    if (!currentUser) {
      throw new Error('You must be logged in to access price alert features');
    }
  }, [currentUser]);

  // Price Alert Actions
  const createPriceAlert = useCallback(async (alertData: {
    investmentId: string;
    coinSymbol: string;
    coinName: string;
    sellPrice: number;
    sellAmount: number;
    sellDate: string;
    profitEarned: number;
    currentPrice: number;
    priceDropThreshold?: number;
    priceIncreaseThreshold?: number;
    cooldownPeriod?: number;
    emailEnabled?: boolean;
    browserEnabled?: boolean;
  }) => {
    requireAuth();
    setLoading(true);
    setError(null);

    try {
      const result = await createPriceAlertAction(alertData);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create price alert';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  const getUserPriceAlerts = useCallback(async (): Promise<PriceAlert[]> => {
    requireAuth();
    setLoading(true);
    setError(null);

    try {
      const alerts = await getUserPriceAlertsAction({}) as PriceAlert[];
      return alerts;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch price alerts';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  const getPriceAlertById = useCallback(async (alertId: string): Promise<PriceAlert | null> => {
    requireAuth();
    setLoading(true);
    setError(null);

    try {
      const alert = await getPriceAlertByIdAction({ alertId }) as PriceAlert | null;
      return alert;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch price alert';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  const updatePriceAlert = useCallback(async (alertId: string, updates: any) => {
    requireAuth();
    setLoading(true);
    setError(null);

    try {
      const result = await updatePriceAlertAction({ alertId, updates });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update price alert';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  const deletePriceAlert = useCallback(async (alertId: string) => {
    requireAuth();
    setLoading(true);
    setError(null);

    try {
      const result = await deletePriceAlertAction({ alertId });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete price alert';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  const checkPriceAlerts = useCallback(async (currentPrices: Record<string, number>) => {
    requireAuth();
    setLoading(true);
    setError(null);

    try {
      const results = await checkPriceAlertsAction({ currentPrices });
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check price alerts';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  return {
    // State
    loading,
    error,
    isAuthenticated: !!currentUser,
    
    // Price Alert methods
    createPriceAlert,
    getUserPriceAlerts,
    getPriceAlertById,
    updatePriceAlert,
    deletePriceAlert,
    checkPriceAlerts,
    
    // Utility
    clearError: () => setError(null)
  };
};
