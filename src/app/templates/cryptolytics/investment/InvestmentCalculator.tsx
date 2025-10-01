"use client";

import React, { useState, useEffect, useMemo } from "react";
import "./investment.scss";

interface Coin {
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

interface InvestmentCalculatorProps {
  initialInvestment: number;
  setInitialInvestment: React.Dispatch<React.SetStateAction<number>>;
  initialPrice: number;
  setInitialPrice: React.Dispatch<React.SetStateAction<number>>;
  coin: Coin | null;
  name: string;
  price: string;
}

const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({
  initialInvestment,
  setInitialInvestment,
  initialPrice,
  setInitialPrice,
  coin,
  name,
  price,
}) => {
  const [initialInvestmentInput, setInitialInvestmentInput] =
    useState<string>("");
  const [initialPriceInput, setInitialPriceInput] = useState<string>("");

  useEffect(() => {
    setInitialInvestmentInput(
      initialInvestment === 0 ? "" : initialInvestment.toString()
    );
  }, [initialInvestment]);

  useEffect(() => {
    setInitialPriceInput(initialPrice === 0 ? "" : initialPrice.toString());
  }, [initialPrice]);

  const toNum = (v: string | number | undefined | null): number => {
    const n = typeof v === "string" ? parseFloat(v) : v ?? 0;
    return Number.isFinite(n) ? n : 0;
  };

  const investment = toNum(initialInvestmentInput);
  const paidPrice = toNum(initialPriceInput);
  const currentPrice = toNum(coin?.price_usd);

  const numberOfCoins = useMemo(
    () => (paidPrice > 0 ? investment / paidPrice : 0),
    [investment, paidPrice]
  );

  const currentValue = useMemo(
    () => numberOfCoins * currentPrice,
    [numberOfCoins, currentPrice]
  );

  const profitLoss = useMemo(
    () => currentValue - investment,
    [currentValue, investment]
  );

  const percentageChange = useMemo(
    () => (paidPrice > 0 ? ((currentPrice / paidPrice) - 1) * 100 : 0),
    [currentPrice, paidPrice]
  );

  const handleInitialInvestmentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setInitialInvestmentInput(value);
    setInitialInvestment(value === "" ? 0 : toNum(value));
  };

  const handleInitialPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInitialPriceInput(value);
    setInitialPrice(value === "" ? 0 : toNum(value));
  };

  const trendClass = (n: number): string => 
    n > 0 ? "green" : n < 0 ? "red" : "neutral";

  const fmtCurrency = (n: number): string =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(n);

  const fmtNumber = (n: number, max = 8): string =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: max }).format(n);

  const fmtPercent = (n: number): string =>
    `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n)}%`;

  return (
    <div className="investment-calculator">
      <div className="investments-wrapper">
        <div className="coin-name cp-text cp-text--semi-bold">
          {name}{" "}
          <span className="cp-text-s">
            (current price: <span className="cp-text-bold">${price}</span>)
          </span>
        </div>
        <div className="input-container">
          <input
            type="number"
            inputMode="decimal"
            step="any"
            min="0"
            value={initialInvestmentInput}
            onChange={handleInitialInvestmentChange}
            placeholder="Initial Amount Invested ($)"
            aria-label="Initial amount invested in dollars"
          />
        </div>
        <div className="input-container">
          <input
            type="number"
            inputMode="decimal"
            step="any"
            min="0"
            value={initialPriceInput}
            onChange={handleInitialPriceChange}
            placeholder="Initial Coin Price ($)"
            aria-label="Initial coin price in dollars"
          />
        </div>
        {investment > 0 && paidPrice > 0 && (
          <span className="coin-number-amount cp-text-m">
            You have {fmtNumber(numberOfCoins)} {name}
          </span>
        )}
      </div>
      <div className="profit-loses">
        <p>
          Profit/Loss:{" "}
          <span className={trendClass(profitLoss)}>{fmtCurrency(profitLoss)}</span>
        </p>
        <p>
          Percentage Change:{" "}
          <span className={trendClass(percentageChange)}>
            {fmtPercent(percentageChange)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default InvestmentCalculator;
