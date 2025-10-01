"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios, { CancelTokenSource } from "axios";
import Modal from "react-modal";
import InvestmentCalculator from "../investment/InvestmentCalculator";
import EducationalContent from "./EducationalContent";
import "./portfolio.scss";
import SearchBar from "../search/search";
import formatNumber from "@/app/helpers/formatNumbers";
import cryptocurrencyImg from "../../images/crypto.png";
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

  const handleSaveCoin = useCallback(() => {
    if (!coin || initialInvestment <= 0 || initialPrice <= 0) return;

    const newCoin: CoinWithInvestment = {
      ...coin,
      initialInvestment,
      initialPrice,
    };

    setSavedCoins((prev) => {
      const withoutCurrent = prev.filter((c) => c.id !== coin.id);
      return [...withoutCurrent, newCoin];
    });
  }, [coin, initialInvestment, initialPrice]);

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
    <svg
      className="close-button"
      onClick={closeModal}
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
      aria-label="Close modal"
      onKeyDown={(e) => e.key === "Enter" && closeModal()}
    >
      <g>
        <g>
          <path d="M284.286,256.002L506.143,34.144c7.811-7.811,7.811-20.475,0-28.285c-7.811-7.81-20.475-7.811-28.285,0L256,227.717 L34.143,5.859c-7.811-7.811-20.475-7.811-28.285,0c-7.81,7.811-7.811,20.475,0,28.285l221.857,221.857L5.858,477.859 c-7.811,7.811-7.811,20.475,0,28.285c3.905,3.905,9.024,5.857,14.143,5.857c5.119,0,10.237-1.952,14.143-5.857L256,284.287 l221.857,221.857c3.905,3.905,9.024,5.857,14.143,5.857s10.237-1.952,14.143-5.857c7.811-7.811,7.811-20.475,0-28.285 L284.286,256.002z"></path>
        </g>
      </g>
    </svg>
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

  const isSaveDisabled = !coin || initialInvestment <= 0 || initialPrice <= 0;

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
                  <>
                    <InvestmentCalculator
                      initialInvestment={initialInvestment}
                      setInitialInvestment={setInitialInvestment}
                      initialPrice={initialPrice}
                      setInitialPrice={setInitialPrice}
                      coin={coin}
                      name={coin.name}
                      price={coin.price_usd}
                    />
                    <button
                      className="save-button"
                      onClick={handleSaveCoin}
                      disabled={isSaveDisabled}
                      aria-label="Save coin with investment data"
                      title={
                        isSaveDisabled
                          ? "Enter valid investment amount and price to save"
                          : "Save coin"
                      }
                    >
                      Save Coin
                    </button>
                  </>
                ) : (
                  <div className="title red">No coin selected</div>
                )}
              </div>

              <div className="saved-coins">
                <h3>Saved Coins</h3>
                {savedCoins.length > 0 ? (
                  <ul>
                    {savedCoins.map((savedCoin) => (
                      <div key={savedCoin.id}>
                        <li onClick={() => handleSelectSavedCoin(savedCoin)}>
                          <span className="saved-coin-name">
                            {savedCoin.name}
                          </span>{" "}
                          - Initial Investment:{" "}
                          <span className="saved-value">
                            ${savedCoin.initialInvestment}
                          </span>{" "}
                          - Initial Price:{" "}
                          <span className="saved-value">
                            ${savedCoin.initialPrice}
                          </span>
                        </li>
                        <RemoveIcon onClick={() => handleRemoveCoin(savedCoin)} />
                      </div>
                    ))}
                  </ul>
                ) : (
                  <div>No coins saved.</div>
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
                {coin ? (
                  <>
                    <InvestmentCalculator
                      initialInvestment={initialInvestment}
                      setInitialInvestment={setInitialInvestment}
                      initialPrice={initialPrice}
                      setInitialPrice={setInitialPrice}
                      coin={coin}
                      name={coin.name}
                      price={coin.price_usd}
                    />
                    <button
                      className="save-button"
                      onClick={handleSaveCoin}
                      disabled={isSaveDisabled}
                      aria-label="Save coin with investment data"
                      title={
                        isSaveDisabled
                          ? "Enter valid investment amount and price to save"
                          : "Save coin"
                      }
                    >
                      Save Coin
                    </button>
                  </>
                ) : (
                  <div className="title red">No coin selected</div>
                )}
                <SearchBar setSelectedCoin={setCoin} />
              </div>

              <div className="saved-coins">
                <h3>Saved Coins</h3>
                {savedCoins.length > 0 ? (
                  <ul>
                    {savedCoins.map((savedCoin) => (
                      <div key={savedCoin.id}>
                        <li onClick={() => handleSelectSavedCoin(savedCoin)}>
                          <span className="saved-coin-name">
                            {savedCoin.name}
                          </span>{" "}
                          - Initial Investment:{" "}
                          <span className="saved-value">
                            ${savedCoin.initialInvestment}
                          </span>{" "}
                          - Initial Price:{" "}
                          <span className="saved-value">
                            ${savedCoin.initialPrice}
                          </span>
                        </li>
                        <RemoveIcon onClick={() => handleRemoveCoin(savedCoin)} />
                      </div>
                    ))}
                  </ul>
                ) : (
                  <div>No coins saved.</div>
                )}
              </div>
            </div>
            <CloseIcon />
          </Modal>
        )}

        {coin ? (
          <>
            <div className="coin-container">
              <div className="coin-details">
                <div className="coin-name">
                  <h3>Coin Name:</h3>
                  <h3 className="name">{coin.name}</h3>
                </div>
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
                    <span className="title">Change 1h:</span>
                    <span className={`result ${trendClass(coin.percent_change_1h)}`}>
                      {coin.percent_change_1h}%
                    </span>
                  </div>
                  <div>
                    <span className="title">Change 24h:</span>
                    <span className={`result ${trendClass(coin.percent_change_24h)}`}>
                      {coin.percent_change_24h}%
                    </span>
                  </div>
                  <div>
                    <span className="title">Change 7 days:</span>
                    <span className={`result ${trendClass(coin.percent_change_7d)}`}>
                      {coin.percent_change_7d}%
                    </span>
                  </div>
                </ul>
              </div>
              <div className="coin-details">
                <h3>
                  Market Statistics{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#000000"
                    height="800px"
                    width="800px"
                    version="1.1"
                    id="Capa_1"
                    viewBox="0 0 459.75 459.75"
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
                </h3>
                <ul className={`${!selectedCoinLoaded ? "loading" : ""}`}>
                  <div>
                    <span className="title">Market Cap:</span>
                    <span className="result">
                      ${formatNumber(Number(coin.market_cap_usd))}
                    </span>
                  </div>
                  <div>
                    <span className="title">Circulating Supply:</span>
                    <span className="result">
                      {formatNumber(Number(coin.csupply))}
                    </span>
                  </div>
                  <div>
                    <span className="title">24h Volume:</span>
                    <span className="result">
                      ${formatNumber(Number(coin.volume24))}
                    </span>
                  </div>
                  <div>
                    <span className="title">Total Supply:</span>
                    <span className="result">
                      {formatNumber(Number(coin.msupply))}
                    </span>
                  </div>
                </ul>
              </div>

              <div className="similar-coins">
                <h3>Similar Coins</h3>
                <ul
                  className={`custom-scrollbar ${
                    loadingCoins ? "loading" : ""
                  }`}
                >
                  {similarCoins.map((c) => (
                    <li key={c.id}>
                      <span
                        className="coin-name"
                        onClick={() => selectSimilarCoin(c)}
                      >
                        {c.name} ({c.symbol})
                      </span>
                      <span className="coin-price">${c.price_usd}</span>
                    </li>
                  ))}
                </ul>
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
