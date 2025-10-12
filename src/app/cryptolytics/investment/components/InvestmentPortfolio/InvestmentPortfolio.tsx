import React from 'react';
import { Investment, PriceAlert } from '../../types/investment.types';
import PortfolioStats from '../PortfolioStats/PortfolioStats';
import InvestmentCard from '../InvestmentCard/InvestmentCard';
import { InvestmentCardSkeleton, PortfolioStatsSkeleton } from '@/app/components/Skeleton';
import './investment-portfolio.scss';

interface InvestmentPortfolioProps {
  investments: Investment[];
  priceAlerts: PriceAlert[];
  loading?: boolean;
  calculateCurrentInvestmentValue: (investment: Investment) => {
    currentValue: number;
    profitLoss: number;
    percentageChange: number;
  };
  getCurrentPrice: (coinSymbol: string) => number;
  onLoadInvestment: (investment: Investment) => void;
  onCreateAlert: (investment: Investment) => void;
  onSwitchToSingle: () => void;
}

const InvestmentPortfolio: React.FC<InvestmentPortfolioProps> = ({
  investments,
  priceAlerts,
  loading = false,
  calculateCurrentInvestmentValue,
  getCurrentPrice,
  onLoadInvestment,
  onCreateAlert,
  onSwitchToSingle,
}) => {
  const totalInvested = investments.reduce((sum, inv) => sum + inv.initialInvestment, 0);
  const totalValue = investments.reduce((sum, inv) => sum + calculateCurrentInvestmentValue(inv).currentValue, 0);
  const totalProfitLoss = investments.reduce((sum, inv) => sum + calculateCurrentInvestmentValue(inv).profitLoss, 0);

  return (
    <div className="investment-portfolio">
      <div className="portfolio-header">
        <div className="header-content">
          <h3>📊 My Investment Portfolio</h3>
          <p className="header-description">
            Track and manage your cryptocurrency investments with real-time performance data.
          </p>
        </div>
        
        {loading ? (
          <PortfolioStatsSkeleton />
        ) : (
          <PortfolioStats
            totalInvested={totalInvested}
            totalValue={totalValue}
            totalProfitLoss={totalProfitLoss}
          />
        )}
      </div>

      <div className="investments-section">
        {loading ? (
          <div className="investments-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <InvestmentCardSkeleton key={i} />
            ))}
          </div>
        ) : investments.length > 0 ? (
          <div className="investments-grid">
            {investments.map((investment) => {
              const realTimeValues = calculateCurrentInvestmentValue(investment);
              const currentPrice = getCurrentPrice(investment.coinSymbol);
              
              // Check if this investment has an active price alert
              const relatedAlert = priceAlerts.find(alert => alert.investmentId === investment.id);
              const hasAlert = !!relatedAlert;
              const alertInfo = relatedAlert ? {
                soldPrice: relatedAlert.sellPrice,
                alertCreatedDate: relatedAlert.createdAt,
                buyBackTarget: relatedAlert.buyBackPrice,
              } : undefined;
              
              return (
                <InvestmentCard
                  key={investment.id}
                  investment={investment}
                  currentValue={realTimeValues.currentValue}
                  profitLoss={realTimeValues.profitLoss}
                  percentageChange={realTimeValues.percentageChange}
                  currentPrice={currentPrice}
                  hasAlert={hasAlert}
                  alertInfo={alertInfo}
                  onLoad={onLoadInvestment}
                  onCreateAlert={onCreateAlert}
                />
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h4>No investments yet</h4>
            <p>Create your first investment to start tracking your portfolio performance.</p>
            <button 
              className="cta-button"
              onClick={onSwitchToSingle}
              type="button"
            >
              <span className="btn-icon">➕</span>
              <span>Create First Investment</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentPortfolio;

