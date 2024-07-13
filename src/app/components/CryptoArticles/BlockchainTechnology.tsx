// src/app/components/BlockchainTechnology.tsx
import React from "react";

const BlockchainTechnology: React.FC = () => {
  return (
    <div className="educational-content">
      <h2>Understanding Blockchain Technology</h2>
      <p>
        Blockchain is a decentralized technology that underpins cryptocurrencies
        like Bitcoin. It is essentially a distributed ledger that records
        transactions across multiple computers in a secure and transparent
        manner.
      </p>
      <h3>Key Concepts</h3>
      <ul>
        <li>
          <strong>Decentralization:</strong> Unlike traditional centralized
          systems, blockchain operates on a decentralized network of nodes.
        </li>
        <li>
          <strong>Cryptographic Security:</strong> Transactions on the
          blockchain are secured using cryptographic techniques.
        </li>
      </ul>
      <h3>Applications</h3>
      <ul>
        <li>
          <strong>Smart Contracts:</strong> Self-executing contracts with terms
          directly written into code.
        </li>
        <li>
          <strong>Supply Chain Management:</strong> Tracking and verifying the
          origins of goods.
        </li>
      </ul>
      <p>
        Explore more about Blockchain technology{" "}
        <a href="/articles/blockchain-technology">Read more</a>
      </p>
    </div>
  );
};

export default BlockchainTechnology;
