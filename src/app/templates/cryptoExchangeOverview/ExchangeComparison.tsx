// src/app/crypto-exchange-overview/ExchangeComparison.tsx
"use client";

import React, { useState } from "react";

const ExchangeComparison: React.FC<{ exchanges: any[] }> = ({ exchanges }) => {
  const [selectedExchanges, setSelectedExchanges] = useState<string[]>([]);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedExchanges((prev) =>
      prev.includes(value)
        ? prev.filter((id) => id !== value)
        : [...prev, value]
    );
  };

  const comparisonData = selectedExchanges.map((id) =>
    exchanges.find((exchange) => exchange.id === id)
  );

  return (
    <div>
      <h3>Compare Exchanges</h3>
      <select multiple onChange={handleSelectionChange}>
        {exchanges.map((exchange) => (
          <option key={exchange.id} value={exchange.id}>
            {exchange.name}
          </option>
        ))}
      </select>
      {comparisonData.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Exchange</th>
              <th>Volume (USD)</th>
              <th>Active Pairs</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((exchange) => (
              <tr key={exchange.id}>
                <td>{exchange.name}</td>
                <td>${exchange.volume_usd.toLocaleString()}</td>
                <td>{exchange.active_pairs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExchangeComparison;
