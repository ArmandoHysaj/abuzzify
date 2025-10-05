import { 
  InvestmentRecord, 
  CreateInvestmentInput,
  UpdateInvestmentInput
} from './model';

export interface InvestmentRepository {
  // Investment records
  createInvestment(userId: string, investment: CreateInvestmentInput): Promise<string>;
  getInvestmentsByUserId(userId: string): Promise<InvestmentRecord[]>;
  getInvestmentById(investmentId: string): Promise<InvestmentRecord | null>;
  updateInvestment(investmentId: string, updates: UpdateInvestmentInput): Promise<{ success: boolean; error?: string }>;
  deleteInvestment(investmentId: string): Promise<{ success: boolean; error?: string }>;
}
