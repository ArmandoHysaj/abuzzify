export interface Coin {
  id: string;
  name: string;
  symbol: string;
  price_usd: string;
  percent_change_1h: string;
  percent_change_24h: string;
  percent_change_7d: string;
  market_cap_usd: string;
  csupply: string;
  msupply: string;
  volume24: string;
}

export interface Investment {
  id: string;
  coinSymbol: string;
  coinName: string;
  initialInvestment: number;
  initialCoinPrice: number;
  investmentDate?: string;
  monthlyContribution: number;
  investmentPeriod: number;
  expectedReturn: number;
  currentMarketPrice?: number;
  createdAt: string;
  calculatedResults: {
    totalValue: number;
    totalGain: number;
    gainPercentage: number;
    finalPrice: number;
  };
}

export interface PriceAlert {
  id: string;
  userId: string;
  investmentId: string;
  coinSymbol: string;
  coinName: string;
  alertType: 'sell-price' | 'buy-back' | 'price-monitor';
  sellPrice: number;
  sellAmount: number;
  sellDate: string;
  profitEarned: number;
  buyBackPrice: number;
  currentPrice: number;
  alertStatus: 'active' | 'triggered' | 'paused' | 'completed';
  notifications: {
    emailEnabled: boolean;
    browserEnabled: boolean;
    lastNotified?: string;
    notificationCount: number;
  };
  alertRules: {
    priceDropThreshold: number;
    priceIncreaseThreshold: number;
    cooldownPeriod: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentCalculatorProps {
  initialInvestment: number;
  setInitialInvestment: React.Dispatch<React.SetStateAction<number>>;
  initialPrice: number;
  setInitialPrice: React.Dispatch<React.SetStateAction<number>>;
  coin: Coin | null;
  name: string;
  price: string;
  onSaveScenario?: (scenario: any) => void;
}

export type TabType = 'single' | 'investments' | 'price-alerts';

