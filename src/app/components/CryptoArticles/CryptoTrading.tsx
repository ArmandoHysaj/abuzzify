// src/app/components/CryptoTrading.tsx
import React from "react";

const CryptoTrading: React.FC = () => {
  return (
    <div className="educational-content">
      <h2>Introduction to Cryptocurrency Trading</h2>
      <p>
        Cryptocurrency trading involves buying, selling, and exchanging digital
        assets like Bitcoin, Ethereum, and others.
      </p>
      <h3>Market Analysis</h3>
      <ul>
        <li>
          <strong>Technical Analysis:</strong> Analyzing historical price data
          and chart patterns.
        </li>
        <li>
          <strong>Fundamental Analysis:</strong> Evaluating the underlying
          factors of a cryptocurrency.
        </li>
      </ul>
      <h3>Strategies</h3>
      <ul>
        <li>
          <strong>Day Trading:</strong> Buying and selling cryptocurrencies
          within the same day.
        </li>
        <li>
          <strong>Hodling:</strong> Long-term holding of cryptocurrencies.
        </li>
      </ul>
      <p>
        Learn more about Cryptocurrency Trading{" "}
        <a href="/articles/cryptocurrency-trading">Read more</a>
      </p>
    </div>
  );
};

export default CryptoTrading;
