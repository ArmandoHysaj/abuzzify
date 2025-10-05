import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./coin-carousel-bar.scss";

interface Coin {
  id: string;
  name: string;
  price_usd: string;
  percent_change_24h: string;
}

const CoinCarouselBar = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasAnimationStarted = useRef(false);

  // Fetch coins only once on mount
  useEffect(() => {
    const fetchSimilarCoins = async () => {
      try {
        const response = await axios.get(`https://api.coinlore.net/api/tickers/`, {
          timeout: 10000
        });
        
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setCoins(response.data.data);
          setError(null);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error: any) {
        console.error("Error fetching similar coins", error);
        setError(error.message || 'Failed to load coin data');
        setCoins([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarCoins();
  }, []); // Empty dependency array - fetch only once

  // Start animation only after coins are loaded
  useEffect(() => {
    if (coins.length > 0 && !hasAnimationStarted.current) {
      const track = document.querySelector(".coin-carousel-track") as HTMLElement;
      if (track) {
        requestAnimationFrame(() => {
          track.style.animation = "scroll 350s linear infinite";
        });
        hasAnimationStarted.current = true;
      }
    }
  }, [coins.length]); // Only depend on coins.length, not the entire array

  return (
    <div className="coin-carousel-bar">
      {isLoading ? (
        <div className="loading container" aria-label="Loading cryptocurrency data"></div>
      ) : error ? (
        <div className="error-message">
          <p>Unable to load cryptocurrency data</p>
        </div>
      ) : coins.length > 0 ? (
        <div className="coin-carousel-track" role="marquee" aria-label="Cryptocurrency price ticker">
          {coins.map((coin) => (
            <div key={coin.id} className="coin-bar" title={`${coin.name}: $${coin.price_usd} (${coin.percent_change_24h}%)`}>
              <span className="coin-name">{coin.name}</span>
              <span className="coin-price">${parseFloat(coin.price_usd).toFixed(2)}</span>
              <span
                className={`coin-change ${
                  Number(coin.percent_change_24h) >= 0 ? "green" : "red"
                }`}
              >
                {Number(coin.percent_change_24h) >= 0 ? '+' : ''}{coin.percent_change_24h}%
              </span>
            </div>
          ))}
          {/* Duplicate for seamless scrolling */}
          {coins.map((coin) => (
            <div key={`dup-${coin.id}`} className="coin-bar" title={`${coin.name}: $${coin.price_usd} (${coin.percent_change_24h}%)`}>
              <span className="coin-name">{coin.name}</span>
              <span className="coin-price">${parseFloat(coin.price_usd).toFixed(2)}</span>
              <span
                className={`coin-change ${
                  Number(coin.percent_change_24h) >= 0 ? "green" : "red"
                }`}
              >
                {Number(coin.percent_change_24h) >= 0 ? '+' : ''}{coin.percent_change_24h}%
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data-message">
          <p>No cryptocurrency data available</p>
        </div>
      )}
    </div>
  );
};

export default CoinCarouselBar;