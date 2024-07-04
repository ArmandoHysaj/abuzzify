import * as React from "react";
import "../header/header.scss";
import CryptoLyticsImage from "../../../images/CryptoLytics.png";
// import SearchBar from "../search/search"; // Ensure the path is correct


const Header = () => {
    return (
      <div className="header">
        <div className="header-logo">
          {/* <img src={CryptoLyticsImage} alt="CryptoLytics Logo" /> */}
        </div>
        <div className="header-title">
          <h1>Cryptolytics</h1>
        </div>
        <div className="header-contents">
          <div className="header-content-item search-btn">
            {/* <SearchBar /> */}
          </div>
          <div className="header-content-item reset-results">Reset</div>
        </div>
      </div>
    );
  };
  
  export default Header;