import React, { useEffect, useState } from "react";
import axios from "axios";
import EducationalContent from "./EducationalContent";
import "./portfolio.scss";
import CustomScrollbar from "../../../utils/customScrollbar";

interface PortfolioProps {
  selectedCoin: any;
}

const Portfolio: React.FC<PortfolioProps> = ({ selectedCoin }) => {
  const [similarCoins, setSimilarCoins] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingCoins, setLoadingCoins] = useState(true);
  const [newsActive, setNewsActive] = useState(false);
  const [coin, setCoin] = useState(selectedCoin);
  const [selectedCoinLoaded, setSelectedCoinLoaded] = useState(false);

  const [initialInvestment, setInitialInvestment] = useState<number>(0);
  const [initialPrice, setInitialPrice] = useState<number>(0);
  const [numberOfCoins, setNumberOfCoins] = useState<number>(0);
  const [profitLoss, setProfitLoss] = useState<number>(0);
  const [percentageChange, setPercentageChange] = useState<number>(0);

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("portfolioState") || "{}");
    if (savedState && savedState.selectedCoin) {
      setCoin(savedState.selectedCoin);
      setSimilarCoins(savedState.similarCoins || []);
      setNews(savedState.news || []);
      setLoadingNews(savedState.loadingNews !== undefined ? savedState.loadingNews : true);
      setLoadingCoins(savedState.loadingCoins !== undefined ? savedState.loadingCoins : true);
      setNewsActive(savedState.newsActive !== undefined ? savedState.newsActive : false);
      setSelectedCoinLoaded(true);
      setInitialInvestment(savedState.initialInvestment || 0);
      setInitialPrice(savedState.initialPrice || 0);
      setNumberOfCoins(savedState.numberOfCoins || 0);
    }
  }, []);

  useEffect(() => {
    if (selectedCoin) {
      setCoin(selectedCoin);
      setSelectedCoinLoaded(true);
    }
  }, [selectedCoin]);

  useEffect(() => {
    if (coin) {
      const stateToSave = {
        similarCoins,
        news,
        loadingNews,
        loadingCoins,
        newsActive,
        selectedCoin: coin,
        initialInvestment,
        initialPrice,
        numberOfCoins,
      };
      localStorage.setItem("portfolioState", JSON.stringify(stateToSave));
    }
  }, [similarCoins, news, loadingNews, loadingCoins, newsActive, coin, initialInvestment, initialPrice, numberOfCoins]);

  useEffect(() => {
    if (initialInvestment && initialPrice && coin) {
      // Calculate the number of coins bought initially
      const numberOfCoins = initialInvestment / initialPrice;
      setNumberOfCoins(parseFloat(numberOfCoins.toFixed(6))); // Fixed precision for readability

      // Calculate profit/loss and percentage change
      const currentPrice = parseFloat(coin.price_usd);
      const currentValue = numberOfCoins * currentPrice;
      const profitLoss = currentValue - initialInvestment;
      const percentageChange = ((currentPrice - initialPrice) / initialPrice) * 100;

      setProfitLoss(parseFloat(profitLoss.toFixed(2)));
      setPercentageChange(parseFloat(percentageChange.toFixed(2)));
    }
  }, [initialInvestment, initialPrice, coin]);

  const fetchSimilarCoins = async () => {
    if (!coin) return;
    try {
      const response = await axios.get(`https://api.coinlore.net/api/tickers/`);
      setSimilarCoins(response.data.data.filter((c: any) => c.id !== coin.id));
      setLoadingCoins(false);
    } catch (error) {
      console.error("Error fetching similar coins", error);
    }
  };

  const fetchNews = async () => {
    if (!coin) return;
    setNewsActive(true);
    try {
      const response = await axios.get("/api/fetchNews", {
        params: {
          coinName: coin.name,
        },
      });
      setNews(response.data.articles);
      setLoadingNews(false);
    } catch (error) {
      console.error("Error fetching news", error);
    }
  };

  return (
    <div className="portfolio-section container">
      {coin ? (
        <>
          <div className="coin-container">
            <div className="coin-details">
              <h3>{coin.name}</h3>
              <ul className={`${!selectedCoinLoaded ? "loading" : ""}`}>
                <div>
                  <span className="title">Symbol:</span>
                  <span className="result"> {coin.symbol}</span>
                </div>
                <div>
                  <span className="title">Price:</span>
                  <span className="result">${coin.price_usd}</span>
                </div>
                <div>
                  <span className="title">Market Cap:</span>
                  <span className="result">${coin.market_cap_usd}</span>
                </div>
                <div>
                  <span className="title">24h Volume:</span>
                  <span className="result">${coin.volume24}</span>
                </div>
                <div>
                  <span className="title">Change 1h:</span>
                  <span
                    className={`result ${
                      coin.percent_change_1h > 0 ? "green" : "red"
                    }`}
                  >
                    {coin.percent_change_1h}%
                  </span>
                </div>
                <div>
                  <span className="title">Change 24h:</span>
                  <span
                    className={`result ${
                      coin.percent_change_24h > 0 ? "green" : "red"
                    }`}
                  >
                    {coin.percent_change_24h}%
                  </span>
                </div>
                <div>
                  <span className="title">Change 7 days:</span>
                  <span
                    className={`result ${
                      coin.percent_change_7d > 0 ? "green" : "red"
                    }`}
                  >
                    {coin.percent_change_7d}%
                  </span>
                </div>
              </ul>
            </div>

            <div className="investment-calculator">
              <h3>Investment Calculator</h3>
              <div>
                <label>Initial Amount Invested ($):</label>
                <input
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(parseFloat(e.target.value))}
                />
                <label>Initial Coin Price ($):</label>
                <input
                  type="number"
                  value={initialPrice}
                  onChange={(e) => setInitialPrice(parseFloat(e.target.value))}
                />
                {/* Number of Coins is derived from the initial investment and price */}
                <div>
                  <label>Number of Coins Bought:</label>
                  <input
                    type="number"
                    value={numberOfCoins}
                    readOnly
                  />
                </div>
              </div>
              <div>
                <p>Profit/Loss: ${profitLoss}</p>
                <p>Percentage Change: {percentageChange}%</p>
              </div>
            </div>

            <div className="similar-coins">
              <h3>Similar Coins</h3>
              <ul className={`${loadingCoins ? "loading" : ""}`}>
                <CustomScrollbar>
                  {similarCoins.map((c) => (
                    <li key={c.id}>
                      <span className="coin-name">
                        {c.name} ({c.symbol})
                      </span>
                      <span className="coin-price">${c.price_usd}</span>
                    </li>
                  ))}
                </CustomScrollbar>
              </ul>
            </div>

            {newsActive && (
              <div className="news-container">
                <h3>Latest News</h3>
                <ul className={`${loadingNews ? "loading" : ""}`}>
                  <CustomScrollbar>
                    {news.length > 0 ? (
                      news.map((article, index) => (
                        <li key={index}>
                          <a
                            className="cp-link"
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {article.title}
                          </a>
                          <p className="cp-text">{article.description}</p>
                        </li>
                      ))
                    ) : (
                      <p className="cp-text">No news available</p>
                    )}
                  </CustomScrollbar>
                </ul>
              </div>
            )}
          </div>
          <EducationalContent />
        </>
      ) : (
        <div className="title">No coin selected</div>
      )}
    </div>
  );
};

export default Portfolio;
