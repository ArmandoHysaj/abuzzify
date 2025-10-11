import React from 'react';
import { TabType } from '../../types/investment.types';
import './investment-tabs.scss';

interface InvestmentTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const InvestmentTabs: React.FC<InvestmentTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="investment-tabs">
      <button 
        className={`investment-tab ${activeTab === 'single' ? 'active' : ''}`}
        onClick={() => onTabChange('single')}
        type="button"
      >
        <span className="tab-icon">💰</span>
        <span className="tab-label">Single Investment</span>
      </button>
      <button 
        className={`investment-tab ${activeTab === 'investments' ? 'active' : ''}`}
        onClick={() => onTabChange('investments')}
        type="button"
      >
        <span className="tab-icon">📊</span>
        <span className="tab-label">My Investments</span>
      </button>
      <button 
        className={`investment-tab ${activeTab === 'price-alerts' ? 'active' : ''}`}
        onClick={() => onTabChange('price-alerts')}
        type="button"
      >
        <span className="tab-icon">🔔</span>
        <span className="tab-label">Price Alerts</span>
      </button>
    </div>
  );
};

export default InvestmentTabs;

