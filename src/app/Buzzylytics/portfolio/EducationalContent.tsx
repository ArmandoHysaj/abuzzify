// src/app/components/EducationalContent.tsx
import React from "react";

const EducationalContent: React.FC = () => {
  return (
    <div className="educational-content">
      <h2>Educational Content</h2>
      <p>
        Welcome to our educational content section! Here, you can find articles,
        guides, and tutorials to help you understand cryptocurrencies and
        blockchain technology.
      </p>
      <div className="article">
        <h3>Understanding Blockchain Technology</h3>
        <p>
          Blockchain is a decentralized technology that underpins
          cryptocurrencies like Bitcoin. Learn more about its applications and
          potential impact on various industries.
        </p>
        <a href="/articles/blockchain-technology">Read more</a>
      </div>
      <div className="article">
        <h3>Introduction to Cryptocurrency Trading</h3>
        <p>
          New to cryptocurrency trading? Explore our beginner's guide to trading
          strategies, market analysis, and essential tips for successful
          trading.
        </p>
        <a href="/articles/cryptocurrency-trading">Read more</a>
      </div>
      {/* Add more articles or sections as needed */}
    </div>
  );
};

export default EducationalContent;
