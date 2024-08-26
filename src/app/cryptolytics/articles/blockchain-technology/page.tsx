// src/app/components/BlockchainTechnology.tsx
import React from "react";
import "./blockchain-technology.scss";
import "../articles.scss";
import blockchain from "./blockchain.png";

const BlockchainTechnology: React.FC = () => {
  return (
    <>
      <div className="stage">
        <div className="media">
          <img src={blockchain.src} alt="" />
        </div>
      </div>
      <div className="container educational-header">
        <div className="header-title">
          <h3>Understanding Blockchain Technology</h3>
        </div>
      </div>
      <div className="educational-content container">
        <p className="cp-text">
          Blockchain is a decentralized technology that underpins
          cryptocurrencies like Bitcoin. It is essentially a distributed ledger
          that records transactions across multiple computers in a secure and
          transparent manner.
        </p>
        <div className="wrapper">
          <div className="description">
            <h3>Key Concepts</h3>
            <ul className="cp-text">
              <li>
                <strong>Decentralization:</strong> Unlike traditional
                centralized systems, blockchain operates on a decentralized
                network of nodes.
              </li>
              <li>
                <strong>Cryptographic Security:</strong> Transactions on the
                blockchain are secured using cryptographic techniques.
              </li>
            </ul>
            <h3>Applications</h3>
            <ul>
              <li>
                <strong>Smart Contracts:</strong> Self-executing contracts with
                terms directly written into code.
              </li>
              <li>
                <strong>Supply Chain Management:</strong> Tracking and verifying
                the origins of goods.
              </li>
            </ul>
            {/* <p>
              Explore more about Blockchain technology{" "}
              <a className="cp-link" href="/articles/blockchain-technology">
                Read more
              </a>
            </p> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlockchainTechnology;
