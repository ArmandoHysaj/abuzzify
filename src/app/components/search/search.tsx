import * as React from "react";
import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import searchIcon from "../../../svgs/searchIcon.svg"; // Import SVG as a URL
// import { useDispatch } from "react-redux";
// import { setSelectedCoin } from "../../../coinSlice";
import "../search/search.scss";

const SearchBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [coinData, setCoinData] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
//   const dispatch = useDispatch();

  const handleSearchClick = () => {
    setIsExpanded(!isExpanded);
  };

  const fetchCoinData = async (query: string) => {
    console.log("check fetch coin data", process.env.REACT_APP_API_URL);
    try {
    //   const response = await axios.get(
    //     `${process.env.REACT_APP_API_URL}/api/crypto?start=0&limit=10&symbol=${query}`
    //   );
    //   setCoinData(response.data.data);
    } catch (error) {
      console.error("Error fetching data from backend:", error);
    }
  };

  const handleCoinClick = async (coinID: number) => {
    try {
    //   const response = await axios.get(
    //     `${process.env.REACT_APP_API_URL}/api/ticker/?id=${coinID}`
    //   );
    //   dispatch(setSelectedCoin(response.data[0]));
    //   console.log(response.data[0]);
    } catch (error) {
      console.error("Error fetching detailed data from backend", error);
    }
    console.log("test deploy");
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
    //   dispatch(setSelectedCoin(null));
    });
  }, []);

  const filteredCoins = coinData.filter((coin: any) =>
    coin.symbol.toUpperCase().includes(searchQuery.toUpperCase())
  );

  return (
    <div className="search-bar" ref={searchRef}>
      {isExpanded ? (
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search..."
        />
      ) : (
        <div onClick={handleSearchClick} className="search-box">
          {/* <img src={searchIcon} alt="Search Icon" /> Use img tag */}
        </div>
      )}
      {isExpanded && (
        <div className="search-results">
          {filteredCoins.map((coin) => (
            <div
              key={coin.id}
              className="coin"
              onClick={() => handleCoinClick(coin.id)}
            >
              {coin.name}: {coin.price_usd} USD
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

console.log("SearchBar component is exported");

export default SearchBar;