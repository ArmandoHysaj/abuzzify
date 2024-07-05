'use client'

import * as React from "react";
import "../header/header.scss";
import SearchBar from "../search/search";
import CryptoLyticsImage from "../../images/CryptoLytics.png"

interface HeaderProps {
    setSelectedCoin: (coin: any) => void;
    setSelectedCoinLoaded: (coin: any) => void;
  }

const Header: React.FC<HeaderProps> = ({ setSelectedCoin, setSelectedCoinLoaded }) => {
    return (
      <div className="header">
        <div className="header-logo">
          <img src={CryptoLyticsImage.src} alt="CryptoLytics Logo" />
        </div>
        <div className="header-title">
          <h1>Cryptolytics</h1>
        </div>
        <div className="header-contents">
          <div className="header-content-item search-btn">
             <SearchBar setSelectedCoin={setSelectedCoin} setSelectedCoinLoaded={setSelectedCoinLoaded}/>
          </div>
          <div className="header-content-item reset-results">Reset</div>
        </div>
      </div>
    );
  };
  
  export default Header;