import { 
  InvestmentRecord, 
  InvestmentScenario, 
  CreateInvestmentInput, 
  CreateScenarioInput,
  UpdateInvestmentInput,
  UpdateScenarioInput
} from './model';

export interface InvestmentRepository {
  // Investment records
  createInvestment(userId: string, investment: CreateInvestmentInput): Promise<string>;
  getInvestmentsByUserId(userId: string): Promise<InvestmentRecord[]>;
  getInvestmentById(investmentId: string): Promise<InvestmentRecord | null>;
  updateInvestment(investmentId: string, updates: UpdateInvestmentInput): Promise<{ success: boolean; error?: string }>;
  deleteInvestment(investmentId: string): Promise<{ success: boolean; error?: string }>;
  
  // Investment scenarios
  createScenario(userId: string, scenario: CreateScenarioInput): Promise<string>;
  getScenariosByUserId(userId: string): Promise<InvestmentScenario[]>;
  getScenarioById(scenarioId: string): Promise<InvestmentScenario | null>;
  updateScenario(scenarioId: string, updates: UpdateScenarioInput): Promise<{ success: boolean; error?: string }>;
  deleteScenario(scenarioId: string): Promise<{ success: boolean; error?: string }>;
}
