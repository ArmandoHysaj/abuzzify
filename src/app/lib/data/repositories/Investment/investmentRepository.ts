import {
  CollectionReference,
  Timestamp
} from 'firebase-admin/firestore';
import { InvestmentRepository } from './interface';
import {
  InvestmentRecord,
  CreateInvestmentInput,
  UpdateInvestmentInput,
  investmentRecordSchema
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
    if (!this.investmentsCollection) {
      logger.error('❌ Investments collection not initialized');
      return [];
    }
    
    try {
      logger.info('🔍 Fetching investments for user:', { userId });
      
      const query = await this.investmentsCollection
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      logger.info('📊 Query executed, found documents:', { count: query.size });

      const investments: InvestmentRecord[] = [];

      query.forEach(doc => {
        const rawData = doc.data();
        const serializedData = serializeFirestoreData(rawData) as Record<string, unknown>;
        serializedData.id = doc.id;

        const parseResult = investmentRecordSchema.safeParse(serializedData);
        if (parseResult.success) {
          investments.push(parseResult.data);
          logger.info('✅ Valid investment parsed:', { investmentId: doc.id });
        } else {
          logger.warn('❌ Invalid investment data', { 
            investmentId: doc.id, 
            error: parseResult.error.errors
          });
        }
      });

      logger.info('📋 Total valid investments:', { count: investments.length });
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

}

export const investmentRepository = new InvestmentRepo();
