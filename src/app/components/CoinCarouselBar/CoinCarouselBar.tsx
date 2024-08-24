import React, { useState, useEffect } from "react";
import axios from "axios";
import "./coin-carousel-bar.scss";

const CoinCarouselBar = () => {
  const [coins, setCoins] = useState<any[]>([]);

  useEffect(() => {
    fetchSimilarCoins();

    const startAnimation = () => {
      const track = document.querySelector(
        ".coin-carousel-track"
      ) as HTMLElement;
      if (track) {
        track.style.animation = "scroll 350s linear infinite";
      }
    };

    requestAnimationFrame(startAnimation);
  }, []);

  const fetchSimilarCoins = async () => {
    try {
      const response = await axios.get(`https://api.coinlore.net/api/tickers/`);
      setCoins(response.data.data);
    } catch (error) {
      console.error("Error fetching similar coins", error);
    }
  };

  return (
    <div className="coin-carousel-bar">
      <div className="coin-carousel-track">
        {coins.length > 0 ? (
          <>
            {coins.map((coin) => (
              <div key={coin.id} className="coin-bar">
                <span className="coin-name">{coin.name}</span>
                <span className="coin-price">${coin.price_usd}</span>
                <span
                  className={`coin-change ${
                    coin.percent_change_24h > 0 ? "green" : "red"
                  }`}
                >
                  {coin.percent_change_24h}%
                </span>
              </div>
            ))}
            {coins.map((coin) => (
              <div key={`dup-${coin.id}`} className="coin-bar">
                <span className="coin-name">{coin.name}</span>
                <span className="coin-price">${coin.price_usd}</span>
                <span
                  className={`coin-change ${
                    coin.percent_change_24h > 0 ? "green" : "red"
                  }`}
                >
                  {coin.percent_change_24h}%
                </span>
              </div>
            ))}
          </>
        ) : (
          <div className="loading"></div>
        )}
      </div>
    </div>
  );
};

export default CoinCarouselBar;
