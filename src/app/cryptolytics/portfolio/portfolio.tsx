"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios, { CancelTokenSource } from "axios";
import Modal from "react-modal";
import InvestmentCalculator from "../investment/InvestmentCalculatorNew";
import EducationalContent from "./EducationalContent";
import PriceAlerts from "@/app/components/PriceAlerts/PriceAlerts";
import { CoinCardSkeleton, NewsArticleSkeleton, CoinDataSkeleton } from "@/app/components/Skeleton";
import { CoinIcon } from "@/app/components/Icons/Icons";
import "./portfolio.scss";
import SearchBar from "../search/search";
import formatNumber from "@/app/helpers/formatNumbers";
import cryptocurrencyImg from "@/app/images/crypto.png";
import ReactGA from "react-ga4";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  price_usd: string;
  percent_change_1h: string;
  percent_change_24h: string;
  percent_change_7d: string;
  market_cap_usd: string;
  csupply: string;
  msupply: string;
  volume24: string;
}

interface CoinWithInvestment extends Coin {
  initialInvestment: number;
  initialPrice: number;
}

interface NewsArticle {
  author: string | null;
  url: string;
  urlToImage?: string | null;
  publishedAt?: string | null;
  title: string;
  description?: string | null;
}

interface PortfolioState {
  similarCoins: Coin[];
  news: NewsArticle[];
  loadingNews: boolean;
  loadingCoins: boolean;
  newsActive: boolean;
  selectedCoin?: { id: string } | null;
  initialInvestment: number;
  initialPrice: number;
  savedCoins: CoinWithInvestment[];
}

interface PortfolioProps {
  selectedCoin?: Coin;
}

const Portfolio: React.FC<PortfolioProps> = ({ selectedCoin }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [similarCoins, setSimilarCoins] = useState<Coin[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingCoins, setLoadingCoins] = useState(true);
  const [newsActive, setNewsActive] = useState(false);
  const [coin, setCoin] = useState<Coin | null>(selectedCoin || null);
  const [selectedCoinLoaded, setSelectedCoinLoaded] = useState(false);

  const [initialInvestment, setInitialInvestment] = useState<number>(0);
  const [initialPrice, setInitialPrice] = useState<number>(0);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [coinId, setCoinId] = useState<string | null>(null);
  const [savedCoins, setSavedCoins] = useState<CoinWithInvestment[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 960);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const coinParam = params.get("coin");
      setCoinId(coinParam);
    }
  }, []);

  useEffect(() => {
    if (coinId) {
      fetchCoinData(coinId);
    }
  }, [coinId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedState = JSON.parse(
        localStorage.getItem("portfolioState") || "{}"
      ) as Partial<PortfolioState>;
      if (
        savedState &&
        !new URLSearchParams(window.location.search).get("coin")
      ) {
        setSavedCoins(savedState.savedCoins || []);
        const savedCoinId = savedState.selectedCoin?.id;
        if (savedCoinId) {
          fetchCoinData(savedCoinId);
        }
        setSimilarCoins(savedState.similarCoins || []);
        setNews(savedState.news || []);
        setLoadingNews(
          savedState.loadingNews !== undefined ? savedState.loadingNews : true
        );
        setLoadingCoins(
          savedState.loadingCoins !== undefined ? savedState.loadingCoins : true
        );
        setNewsActive(
          savedState.newsActive !== undefined ? savedState.newsActive : false
        );
        setInitialInvestment(savedState.initialInvestment || 0);
        setInitialPrice(savedState.initialPrice || 0);
        setSelectedCoinLoaded(!!savedState.selectedCoin);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedCoin) {
      setCoin(selectedCoin);
      setSelectedCoinLoaded(true);
    }
  }, [selectedCoin]);

  const persistState = useMemo(() => {
    let handle: number | null = null;
    return (state: PortfolioState) => {
      if (handle) cancelAnimationFrame(handle);
      handle = requestAnimationFrame(() => {
        localStorage.setItem("portfolioState", JSON.stringify(state));
        handle = null;
      });
    };
  }, []);

  useEffect(() => {
    if (coin) {
      const stateToSave: PortfolioState = {
        similarCoins,
        news,
        loadingNews,
        loadingCoins,
        newsActive,
        selectedCoin: { id: coin.id },
        initialInvestment,
        initialPrice,
        savedCoins,
      };
      persistState(stateToSave);
    }
  }, [
    coin,
    similarCoins,
    news,
    loadingNews,
    loadingCoins,
    newsActive,
    initialInvestment,
    initialPrice,
    savedCoins,
    persistState,
  ]);

  useEffect(() => {
    if (coin) {
      fetchSimilarCoins();
      fetchNews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coin]);

  const removeCoinParam = useCallback(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("coin")) {
        url.searchParams.delete("coin");
        window.history.replaceState({}, document.title, url.toString());
      }
    }
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem("portfolioState");
    setCoin(null);
    setCoinId(null);
    removeCoinParam();
  }, [removeCoinParam]);

  const fetchCoinData = async (coinId: string) => {
    try {
      const response = await axios.get<Coin[]>(
        `https://api.coinlore.net/api/ticker/?id=${coinId}`
      );
      setCoin(response.data[0]);
      setSelectedCoinLoaded(true);
    } catch (error) {
      console.error("Error fetching coin data", error);
      setSelectedCoinLoaded(false);
    }
  };

  const fetchSimilarCoins = async () => {
    if (!coin) return;
    const source = axios.CancelToken.source();
    try {
      const response = await axios.get<{ data: Coin[] }>(
        "https://api.coinlore.net/api/tickers/",
        { cancelToken: source.token }
      );
      setSimilarCoins(response.data.data.filter((c: Coin) => c.id !== coin.id));
      setLoadingCoins(false);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Error fetching similar coins", error);
        setLoadingCoins(false);
      }
    }
    return () => source.cancel();
  };

  const fetchNews = async () => {
    if (!coin) return;
    setNewsActive(true);
    const source = axios.CancelToken.source();
    try {
      const response = await axios.get<{ articles: NewsArticle[] }>(
        "/api/fetchNews",
        {
          params: { coinName: coin.name },
          cancelToken: source.token,
        }
      );
      setNews(response.data.articles);
      setLoadingNews(false);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Error fetching news", error);
        setLoadingNews(false);
      }
    }
    return () => source.cancel();
  };

  // Remove handleSaveCoin since we're using scenario saving now

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    ReactGA.event({
      category: "User",
      action: "Open Investment Calculator Modal",
      label: "Investment Modal",
    });
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    ReactGA.event({
      category: "User",
      action: "Close Investment Calculator Modal",
      label: "Investment Modal",
    });
  }, []);

  const handleSelectSavedCoin = useCallback((savedCoin: CoinWithInvestment) => {
    setCoin(savedCoin);
    setInitialInvestment(savedCoin.initialInvestment);
    setInitialPrice(savedCoin.initialPrice);
    setSelectedCoinLoaded(true);
  }, []);

  const handleRemoveCoin = useCallback((coinToRemove: CoinWithInvestment) => {
    setSavedCoins((prev) => prev.filter((c) => c.id !== coinToRemove.id));
  }, []);

  const selectSimilarCoin = useCallback(
    (c: Coin) => {
      removeCoinParam();
      setCoinId(c.id);
    },
    [removeCoinParam]
  );

  const trendClass = (value: string | number): string => {
    const n = Number(value);
    return n > 0 ? "green" : n < 0 ? "red" : "neutral";
  };

  const CloseIcon = () => (
    <button
      className="close-button"
      onClick={closeModal}
      aria-label="Close modal"
      type="button"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 6L6 18M6 6L18 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );

  const RemoveIcon = ({ onClick }: { onClick: () => void }) => (
    <svg
      className="remove-button"
      onClick={onClick}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 512.001 512.001"
      width="16"
      fill="#333"
      role="button"
      tabIndex={0}
      aria-label="Remove coin"
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <g>
        <g>
          <path d="M284.286,256.002L506.143,34.144c7.811-7.811,7.811-20.475,0-28.285c-7.811-7.81-20.475-7.811-28.285,0L256,227.717 L34.143,5.859c-7.811-7.811-20.475-7.811-28.285,0c-7.81,7.811-7.811,20.475,0,28.285l221.857,221.857L5.858,477.859 c-7.811,7.811-7.811,20.475,0,28.285c3.905,3.905,9.024,5.857,14.143,5.857c5.119,0,10.237-1.952,14.143-5.857L256,284.287 l221.857,221.857c3.905,3.905,9.024,5.857,14.143,5.857s10.237-1.952,14.143-5.857c7.811-7.811,7.811-20.475,0-28.285 L284.286,256.002z"></path>
        </g>
      </g>
    </svg>
  );

  // Remove isSaveDisabled since we're not using save button anymore

  return (
    <>
      <div className="portfolio-section container">
        <div className="modal-btn-wrapper">
          <button
            className="modal-button default-button"
            onClick={openModal}
            aria-label="Open investment calculator"
          >
            Open Investment Calculator
          </button>
        </div>
        {isMobile ? (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Investment Calculator"
            className="investment-calculator-modal custom-scrollbar"
            overlayClassName="investment-calculator-overlay"
            bodyOpenClassName="body-lock"
          >
            <h3>
              Crypto Coin Calculator: Calculate Your{" "}
              <span className="green">Profits</span> and{" "}
              <span className="red">Losses</span>
            </h3>
            <p className="cp-text-m description">
              Enter your investment amount and the initial coin price at the
              time of investment. Instantly see your profits or losses based on
              the current coin price:
            </p>
            <SearchBar setSelectedCoin={setCoin} />
            <div className="investment-modal">
                     <div className="modal-wrapper">
                       {coin ? (
                         <InvestmentCalculator
                           initialInvestment={initialInvestment}
                           setInitialInvestment={setInitialInvestment}
                           initialPrice={initialPrice}
                           setInitialPrice={setInitialPrice}
                           coin={coin}
                           name={coin.name}
                           price={coin.price_usd}
                           onSaveScenario={(scenario) => {
                             // Handle scenario saving through the calculator
                             console.log('Scenario saved:', scenario);
                           }}
                         />
                       ) : (
                         <div className="title red">No coin selected</div>
                       )}
                     </div>
            </div>
            <CloseIcon />
          </Modal>
        ) : (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Investment Calculator"
            className="investment-calculator-modal custom-scrollbar"
            overlayClassName="investment-calculator-overlay"
            bodyOpenClassName="body-lock"
          >
            <h3>
              Crypto Coin Calculator: Calculate Your{" "}
              <span className="green">Profits</span> and{" "}
              <span className="red">Losses</span>
            </h3>
            <p className="cp-text-m description">
              Enter your investment amount and the initial coin price at the
              time of investment. Instantly see your profits or losses based on
              the current coin price:
            </p>
            <div className="investment-modal">
              <div className="modal-wrapper">
              <SearchBar setSelectedCoin={setCoin} />

                {coin ? (
                  <InvestmentCalculator
                    initialInvestment={initialInvestment}
                    setInitialInvestment={setInitialInvestment}
                    initialPrice={initialPrice}
                    setInitialPrice={setInitialPrice}
                    coin={coin}
                    name={coin.name}
                    price={coin.price_usd}
                    onSaveScenario={(scenario) => {
                      // Handle scenario saving through the calculator
                      console.log('Scenario saved:', scenario);
                    }}
                  />
                ) : (
                  <div className="title red">No coin selected</div>
                )}
              </div>
            </div>
            <CloseIcon />
          </Modal>
        )}

        {coin ? (
          <>
            <div className="coin-container">
              <div className="coin-header-card">
                <div className="coin-header">
                  <div className="coin-icon">
                    <CoinIcon size={48} />
                  </div>
                  <div className="coin-title">
                    <h2 className="coin-name">{coin.name}</h2>
                    <span className="coin-symbol">{coin.symbol}</span>
                  </div>
                  <div className="coin-price-main">
                    <span className="price-label">Current Price</span>
                    <span className="price-value">${coin.price_usd}</span>
                  </div>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header">
                    <h3>Price Changes</h3>
                  </div>
                  <div className="stat-content">
                    <div className="stat-item">
                      <span className="stat-label">1 Hour</span>
                      <span className={`stat-value ${trendClass(coin.percent_change_1h)}`}>
                        {coin.percent_change_1h}%
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">24 Hours</span>
                      <span className={`stat-value ${trendClass(coin.percent_change_24h)}`}>
                        {coin.percent_change_24h}%
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">7 Days</span>
                      <span className={`stat-value ${trendClass(coin.percent_change_7d)}`}>
                        {coin.percent_change_7d}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <h3>Market Statistics</h3>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      height="20px"
                      width="20px"
                      viewBox="0 0 459.75 459.75"
                      className="stat-icon"
                    >
                      <g>
                        <path d="M447.652,304.13h-40.138c-6.681,0-12.097,5.416-12.097,12.097v95.805c0,6.681,5.416,12.098,12.097,12.098h40.138   c6.681,0,12.098-5.416,12.098-12.098v-95.805C459.75,309.546,454.334,304.13,447.652,304.13z"></path>
                        <path d="M348.798,258.13H308.66c-6.681,0-12.098,5.416-12.098,12.097v141.805c0,6.681,5.416,12.098,12.098,12.098h40.138   c6.681,0,12.097-5.416,12.097-12.098V270.228C360.896,263.546,355.48,258.13,348.798,258.13z"></path>
                        <path d="M151.09,304.13h-40.138c-6.681,0-12.097,5.416-12.097,12.097v95.805c0,6.681,5.416,12.098,12.097,12.098h40.138   c6.681,0,12.098-5.416,12.098-12.098v-95.805C163.188,309.546,157.771,304.13,151.09,304.13z"></path>
                        <path d="M52.236,258.13H12.098C5.416,258.13,0,263.546,0,270.228v141.805c0,6.681,5.416,12.098,12.098,12.098h40.138   c6.681,0,12.097-5.416,12.097-12.098V270.228C64.333,263.546,58.917,258.13,52.236,258.13z"></path>
                        <path d="M249.944,196.968h-40.138c-6.681,0-12.098,5.416-12.098,12.098v202.967c0,6.681,5.416,12.098,12.098,12.098h40.138   c6.681,0,12.098-5.416,12.098-12.098V209.066C262.042,202.384,256.625,196.968,249.944,196.968z"></path>
                        <path d="M436.869,244.62c8.14,0,15-6.633,15-15v-48.479c0-8.284-6.716-15-15-15c-8.284,0-15,6.716-15,15v12.119L269.52,40.044   c-3.148-3.165-7.536-4.767-11.989-4.362c-4.446,0.403-8.482,2.765-11.011,6.445L131.745,209.185L30.942,144.969   c-6.987-4.451-16.26-2.396-20.71,4.592c-4.451,6.987-2.396,16.259,4.592,20.71l113.021,72c2.495,1.589,5.286,2.351,8.046,2.351   c4.783,0,9.475-2.285,12.376-6.507L261.003,74.025L400.8,214.62h-12.41c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15   c6.71,0,41.649,0,48.443,0H436.869z"></path>
                      </g>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-item">
                      <span className="stat-label">Market Cap</span>
                      <span className="stat-value">
                        ${formatNumber(Number(coin.market_cap_usd))}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Circulating Supply</span>
                      <span className="stat-value">
                        {formatNumber(Number(coin.csupply))}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">24h Volume</span>
                      <span className="stat-value">
                        ${formatNumber(Number(coin.volume24))}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Supply</span>
                      <span className="stat-value">
                        {formatNumber(Number(coin.msupply))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="stat-card similar-coins-card">
                  <div className="stat-header">
                    <h3>Similar Coins</h3>
                  </div>
                  <div className="similar-coins-list">
                    <ul className={`custom-scrollbar ${loadingCoins ? "loading" : ""}`}>
                      {similarCoins.map((c) => (
                        <li key={c.id} className="similar-coin-item" onClick={() => selectSimilarCoin(c)}>
                          <div className="coin-info">
                            <span className="coin-name">{c.name}</span>
                            <span className="coin-symbol">({c.symbol})</span>
                          </div>
                          <span className="coin-price">${c.price_usd}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Price Alerts Component */}
                {coin && (
                  <div className="price-alerts-container">
                    <PriceAlerts
                      coinId={coin.id}
                      coinName={coin.name}
                      coinSymbol={coin.symbol}
                      currentPrice={parseFloat(coin.price_usd)}
                    />
                  </div>
                )}
              </div>
            </div>
            {newsActive && (
              <div className="news-container">
                <h3>Latest News</h3>
                <div className="portfolio-news-wrapper">
                  <ul className={`${loadingNews ? "loading" : ""}`}>
                    {news.length > 0 ? (
                      news.map((article, index) => (
                        <li key={index}>
                          <img
                            loading="lazy"
                            src={article.urlToImage || "/placeholder-news.jpg"}
                            alt={article.title}
                          />
                          <div className="news-description">
                            <div className="news-author cp-text-s">
                              <span className="author">{article.author}</span>
                              <span className="date">
                                {article.publishedAt}
                              </span>
                            </div>
                            <a
                              className="cp-link"
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {article.title}
                            </a>
                            <p className="cp-text">{article.description}</p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p className="cp-text">No news available</p>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="title red">No coin selected</div>
        )}
      </div>
    </>
  );
};

export default Portfolio;
