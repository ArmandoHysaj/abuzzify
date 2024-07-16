import * as React from "react";
import { useState, useEffect, useRef } from "react";
import "../search/search.scss";
import CustomScrollbar from "../../../utils/customScrollbar";

interface SearchBarProps {
  setSelectedCoin: (coin: any) => void;
  setSelectedCoinLoaded: (coin: any) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  setSelectedCoin,
  setSelectedCoinLoaded,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [coinData, setCoinData] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearchClick = () => {
    setIsExpanded(!isExpanded);
  };

  const fetchCoinData = async (query: string) => {
    try {
      const response = await fetch("https://api.coinlore.net/api/tickers/");
      const data = await response.json();
      setCoinData(data.data);
    } catch (error) {
      console.error("Error fetching data from backend:", error);
    }
  };

  const handleCoinClick = async (coinID: number) => {
    try {
      const response = await fetch(
        `https://api.coinlore.net/api/ticker/?id=${coinID}`
      );
      const data = await response.json();
      setSelectedCoin(data[0]);
      setSelectedCoinLoaded(true);
    } catch (error) {
      console.error("Error fetching detailed data from backend", error);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      fetchCoinData(query);
    } else {
      setCoinData([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
        setCoinData([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const resetBtn = searchRef.current
      ?.closest(".header-contents")
      ?.querySelector(".reset-results");

    resetBtn?.addEventListener("click", () => {
      setSelectedCoin(null);
    });
  }, [setSelectedCoin]);

  const filteredCoins = coinData.filter((coin: any) =>
    coin.symbol.toUpperCase().includes(searchQuery.toUpperCase())
  );

  return (
    <div className="search-bar" ref={searchRef}>
      {isExpanded ? (
        <input
          className="cp-text"
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search..."
        />
      ) : (
        <div onClick={handleSearchClick} className="search-box">
          <p className="cp-text-s">Search coin</p>
          <svg
            className="ltr-search-icon"
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="15.4549"
              cy="16.3636"
              r="11.8182"
              stroke="#223341"
            ></circle>
            <path d="M23.6367 24.5454L33.6367 34.5454" stroke="#223341"></path>
            <path
              d="M22.6614 16.3635C22.7039 16.6604 22.7259 16.964 22.7259
         17.2726C22.7259 18.9637 22.0663 20.5006 20.9903
         21.6403C19.8301 22.8693 18.1857 23.6363 16.3622 23.6363C16.0536 23.6363
          15.75 23.6143 15.4531 23.5718"
              stroke="#223341"
            ></path>
          </svg>
        </div>
      )}
      {isExpanded && (
        <div className="search-results">
          <CustomScrollbar>
            {filteredCoins.map((coin) => (
              <div
                key={coin.id}
                className="coin"
                onClick={() => handleCoinClick(coin.id)}
              >
                {coin.name}: {coin.price_usd} USD
              </div>
            ))}
          </CustomScrollbar>
        </div>
      )}
    </div>
  );
};

console.log("SearchBar component is exported");

export default SearchBar;
