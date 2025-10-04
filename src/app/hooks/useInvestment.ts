'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import {
  createInvestmentAction,
  getUserInvestmentsAction,
  getInvestmentByIdAction,
  updateInvestmentAction,
  deleteInvestmentAction,
  createScenarioAction,
  getUserScenariosAction,
  getScenarioByIdAction,
  updateScenarioAction,
  deleteScenarioAction
} from '@/app/lib/data/investment-actions';
import {
  InvestmentRecord,
  InvestmentScenario,
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

  // Scenario Actions
  const createScenario = useCallback(async (scenarioData: { name: string; description?: string; investments: any[] }) => {
    requireAuth();
    setLoading(true);
    setError(null);

    try {
      const result = await createScenarioAction(scenarioData);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create scenario';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  const getUserScenarios = useCallback(async (): Promise<InvestmentScenario[]> => {
    requireAuth();
    setLoading(true);
    setError(null);

    try {
      const scenarios = await getUserScenariosAction({}) as InvestmentScenario[];
      return scenarios;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch scenarios';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  const getScenarioById = useCallback(async (scenarioId: string): Promise<InvestmentScenario | null> => {
    requireAuth();
    setLoading(true);
    setError(null);

    try {
      const scenario = await getScenarioByIdAction({ scenarioId }) as InvestmentScenario | null;
      return scenario;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch scenario';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  const updateScenario = useCallback(async (scenarioId: string, updates: any) => {
    requireAuth();
    setLoading(true);
    setError(null);

    try {
      const result = await updateScenarioAction({ scenarioId, updates });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update scenario';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  const deleteScenario = useCallback(async (scenarioId: string) => {
    requireAuth();
    setLoading(true);
    setError(null);

    try {
      const result = await deleteScenarioAction({ scenarioId });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete scenario';
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
    
    // Scenario methods
    createScenario,
    getUserScenarios,
    getScenarioById,
    updateScenario,
    deleteScenario,
    
    // Utility
    clearError: () => setError(null)
  };
};
