'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import {
  createInvestmentAction,
  getUserInvestmentsAction,
  getInvestmentByIdAction,
  updateInvestmentAction,
  deleteInvestmentAction
} from '@/app/lib/data/investment-actions';
import {
  InvestmentRecord,
  InvestmentCalculationInput
} from '@/app/lib/data/repositories/Investment/model';

export const useInvestment = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated
  const requireAuth = useCallback(() => {
    if (!currentUser) {
      throw new Error('You must be logged in to access investment features');
    }
  }, [currentUser]);

  // Investment Actions
  const createInvestment = useCallback(async (investmentData: InvestmentCalculationInput) => {
    requireAuth();
    setLoading(true);
    setError(null);

    try {
      const result = await createInvestmentAction(investmentData);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create investment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  const getUserInvestments = useCallback(async (): Promise<InvestmentRecord[]> => {
    requireAuth();
    setLoading(true);
    setError(null);

    try {
      const investments = await getUserInvestmentsAction({}) as InvestmentRecord[];
      return investments;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch investments';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  const getInvestmentById = useCallback(async (investmentId: string): Promise<InvestmentRecord | null> => {
    requireAuth();
    setLoading(true);
    setError(null);

    try {
      const investment = await getInvestmentByIdAction({ investmentId }) as InvestmentRecord | null;
      return investment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch investment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  const updateInvestment = useCallback(async (investmentId: string, updates: any) => {
    requireAuth();
    setLoading(true);
    setError(null);

    try {
      const result = await updateInvestmentAction({ investmentId, updates });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update investment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  const deleteInvestment = useCallback(async (investmentId: string) => {
    requireAuth();
    setLoading(true);
    setError(null);

    try {
      const result = await deleteInvestmentAction({ investmentId });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete investment';
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
    
    // Investment methods
    createInvestment,
    getUserInvestments,
    getInvestmentById,
    updateInvestment,
    deleteInvestment,
    
    // Utility
    clearError: () => setError(null)
  };
};
