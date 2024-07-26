"use client";


import React, { useState, useEffect } from "react";
import "./investment.scss";

interface InvestmentCalculatorProps {
  initialInvestment: number;
  setInitialInvestment: React.Dispatch<React.SetStateAction<number>>;
  initialPrice: number;
  setInitialPrice: React.Dispatch<React.SetStateAction<number>>;
  coin: any;
}

const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({
  initialInvestment,
  setInitialInvestment,
  initialPrice,
  setInitialPrice,
  coin,
}) => {
  const [numberOfCoins, setNumberOfCoins] = useState<number>(0);
  const [profitLoss, setProfitLoss] = useState<number>(0);
  const [percentageChange, setPercentageChange] = useState<number>(0);

  useEffect(() => {
    if (initialInvestment && initialPrice && coin) {
      const numberOfCoins = initialInvestment / initialPrice;
      setNumberOfCoins(parseFloat(numberOfCoins.toFixed(6)));

      const currentPrice = parseFloat(coin.price_usd);
      const currentValue = numberOfCoins * currentPrice;
      const profitLoss = currentValue - initialInvestment;
      const percentageChange = ((currentPrice - initialPrice) / initialPrice) * 100;

      setProfitLoss(parseFloat(profitLoss.toFixed(2)));
      setPercentageChange(parseFloat(percentageChange.toFixed(2)));
    }
  }, [initialInvestment, initialPrice, coin]);

  return (
    <div className="investment-calculator">
      <h3>Investment Calculator</h3>
      <div>
        <label>Initial Amount Invested ($):</label>
        <input
          type="number"
          value={initialInvestment}
          onChange={(e) => setInitialInvestment(parseFloat(e.target.value))}
        />
        <label>Initial Coin Price ($):</label>
        <input
          type="number"
          value={initialPrice}
          onChange={(e) => setInitialPrice(parseFloat(e.target.value))}
        />
        <div>
          <label>Number of Coins Bought:</label>
          <input type="number" value={numberOfCoins} readOnly />
        </div>
      </div>
      <div>
        <p>Profit/Loss: ${profitLoss}</p>
        <p>Percentage Change: {percentageChange}%</p>
      </div>
    </div>
  );
};

export default InvestmentCalculator;
