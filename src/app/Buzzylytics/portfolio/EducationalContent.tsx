// src/app/Buzzylytics/portfolio/EducationalContent.tsx
import React from "react";
import Link from "next/link";

const EducationalContent: React.FC = () => {
  return (
    <div className="educational-content">
      <h2>Educational Content</h2>
      <ul>
        <p>
          Welcome to our educational content section! Here, you can find
          articles, guides, and tutorials to help you understand
          cryptocurrencies and blockchain technology.
        </p>
        <div className="article">
          <h3>Understanding Blockchain Technology</h3>
          <p>
            Blockchain is a decentralized technology that underpins
            cryptocurrencies like Bitcoin. Learn more about its applications and
            potential impact on various industries.
          </p>
          <Link href="buzzylytics/articles/blockchain-technology">
            Read more
          </Link>
        </div>
        <div className="article">
          <h3>Introduction to Cryptocurrency Trading</h3>
          <p>
            New to cryptocurrency trading? Explore our beginner&apos;s guide to
            trading strategies, market analysis, and essential tips for
            successful trading.
          </p>
          <Link href="buzzylytics/articles/crypto-trading">Read more</Link>
        </div>
      </ul>
    </div>
  );
};

export default EducationalContent;
