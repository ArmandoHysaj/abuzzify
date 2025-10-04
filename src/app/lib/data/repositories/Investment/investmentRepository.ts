import {
  CollectionReference,
  Timestamp
} from 'firebase-admin/firestore';
import { InvestmentRepository } from './interface';
import {
  InvestmentRecord,
  InvestmentScenario,
  CreateInvestmentInput,
  CreateScenarioInput,
  UpdateInvestmentInput,
  UpdateScenarioInput,
  investmentRecordSchema,
  investmentScenarioSchema
} from './model';
import { firestore } from '../../../firestoreConnection';
import { serializeFirestoreData } from '../../../data/helpers';
import { logger } from '../../../utils/logger';

export class InvestmentRepo implements InvestmentRepository {
  private get investmentsCollection(): CollectionReference {
    if (!firestore) {
      throw new Error('Firestore not initialized');
    }
    return firestore.collection('investments');
  }

  private get scenariosCollection(): CollectionReference {
    if (!firestore) {
      throw new Error('Firestore not initialized');
    }
    return firestore.collection('investment_scenarios');
  }

  // Investment Records
  async createInvestment(userId: string, investment: CreateInvestmentInput): Promise<string> {
    if (!this.investmentsCollection) throw new Error('Firestore collection not available');
    
    try {
      const docRef = this.investmentsCollection.doc();
      const investmentData = {
        ...investment,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await docRef.set(investmentData);
      
      logger.info('✅ Investment created successfully', { 
        userId, 
        investmentId: docRef.id,
        coinSymbol: investment.coinSymbol 
      });

      return docRef.id;
    } catch (error) {
      logger.error('❌ Failed to create investment', { 
        userId, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  }

  async getInvestmentsByUserId(userId: string): Promise<InvestmentRecord[]> {
    if (!this.investmentsCollection) return [];
    
    try {
      const query = await this.investmentsCollection
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      const investments: InvestmentRecord[] = [];

      query.forEach(doc => {
        const rawData = doc.data();
        const serializedData = serializeFirestoreData(rawData) as Record<string, unknown>;
        serializedData.id = doc.id;

        const parseResult = investmentRecordSchema.safeParse(serializedData);
        if (parseResult.success) {
          investments.push(parseResult.data);
        } else {
          logger.warn('Invalid investment data', { 
            investmentId: doc.id, 
            error: parseResult.error 
          });
        }
      });

      return investments;
    } catch (error) {
      logger.error('❌ Failed to get investments by user ID', { 
        userId, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  }

  async getInvestmentById(investmentId: string): Promise<InvestmentRecord | null> {
    if (!this.investmentsCollection) return null;
    
    try {
      const doc = await this.investmentsCollection.doc(investmentId).get();

      if (!doc.exists) {
        return null;
      }

      const rawData = doc.data();
      if (!rawData) return null;

      const serializedData = serializeFirestoreData(rawData) as Record<string, unknown>;
      serializedData.id = doc.id;

      const parseResult = investmentRecordSchema.safeParse(serializedData);
      if (parseResult.success) {
        return parseResult.data;
      } else {
        logger.warn('Invalid investment data', { 
          investmentId, 
          error: parseResult.error 
        });
        return null;
      }
    } catch (error) {
      logger.error('❌ Failed to get investment by ID', { 
        investmentId, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  }

  async updateInvestment(investmentId: string, updates: UpdateInvestmentInput): Promise<{ success: boolean; error?: string }> {
    if (!this.investmentsCollection) {
      return { success: false, error: 'Firestore not available' };
    }

    try {
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now()
      };

      await this.investmentsCollection.doc(investmentId).update(updateData);
      
      logger.info('✅ Investment updated successfully', { investmentId });
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('❌ Failed to update investment', { investmentId, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }

  async deleteInvestment(investmentId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.investmentsCollection) {
      return { success: false, error: 'Firestore not available' };
    }

    try {
      await this.investmentsCollection.doc(investmentId).delete();
      
      logger.info('✅ Investment deleted successfully', { investmentId });
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('❌ Failed to delete investment', { investmentId, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }

  // Investment Scenarios
  async createScenario(userId: string, scenario: CreateScenarioInput): Promise<string> {
    if (!this.scenariosCollection) throw new Error('Firestore collection not available');
    
    try {
      const docRef = this.scenariosCollection.doc();
      const scenarioData = {
        ...scenario,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await docRef.set(scenarioData);
      
      logger.info('✅ Investment scenario created successfully', { 
        userId, 
        scenarioId: docRef.id,
        scenarioName: scenario.name 
      });

      return docRef.id;
    } catch (error) {
      logger.error('❌ Failed to create investment scenario', { 
        userId, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  }

  async getScenariosByUserId(userId: string): Promise<InvestmentScenario[]> {
    if (!this.scenariosCollection) return [];
    
    try {
      const query = await this.scenariosCollection
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      const scenarios: InvestmentScenario[] = [];

      query.forEach(doc => {
        const rawData = doc.data();
        const serializedData = serializeFirestoreData(rawData) as Record<string, unknown>;
        serializedData.id = doc.id;

        const parseResult = investmentScenarioSchema.safeParse(serializedData);
        if (parseResult.success) {
          scenarios.push(parseResult.data);
        } else {
          logger.warn('Invalid scenario data', { 
            scenarioId: doc.id, 
            error: parseResult.error 
          });
        }
      });

      return scenarios;
    } catch (error) {
      logger.error('❌ Failed to get scenarios by user ID', { 
        userId, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  }

  async getScenarioById(scenarioId: string): Promise<InvestmentScenario | null> {
    if (!this.scenariosCollection) return null;
    
    try {
      const doc = await this.scenariosCollection.doc(scenarioId).get();

      if (!doc.exists) {
        return null;
      }

      const rawData = doc.data();
      if (!rawData) return null;

      const serializedData = serializeFirestoreData(rawData) as Record<string, unknown>;
      serializedData.id = doc.id;

      const parseResult = investmentScenarioSchema.safeParse(serializedData);
      if (parseResult.success) {
        return parseResult.data;
      } else {
        logger.warn('Invalid scenario data', { 
          scenarioId, 
          error: parseResult.error 
        });
        return null;
      }
    } catch (error) {
      logger.error('❌ Failed to get scenario by ID', { 
        scenarioId, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  }

  async updateScenario(scenarioId: string, updates: UpdateScenarioInput): Promise<{ success: boolean; error?: string }> {
    if (!this.scenariosCollection) {
      return { success: false, error: 'Firestore not available' };
    }

    try {
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now()
      };

      await this.scenariosCollection.doc(scenarioId).update(updateData);
      
      logger.info('✅ Investment scenario updated successfully', { scenarioId });
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('❌ Failed to update scenario', { scenarioId, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }

  async deleteScenario(scenarioId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.scenariosCollection) {
      return { success: false, error: 'Firestore not available' };
    }

    try {
      await this.scenariosCollection.doc(scenarioId).delete();
      
      logger.info('✅ Investment scenario deleted successfully', { scenarioId });
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('❌ Failed to delete scenario', { scenarioId, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }
}

export const investmentRepository = new InvestmentRepo();
