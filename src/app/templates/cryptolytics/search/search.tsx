import * as React from "react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import "../search/search.scss";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  price_usd: string;
  percent_change_24h: string;
}

interface SearchBarProps {
  setSelectedCoin: (coin: any) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ setSelectedCoin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Fetch coin data once on mount
  const fetchCoins = useCallback(async () => {
    if (coins.length > 0) return; // Already loaded
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("https://api.coinlore.net/api/tickers/");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      
      if (data && data.data && Array.isArray(data.data)) {
        setCoins(data.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching coins:", err);
      setError(err instanceof Error ? err.message : "Failed to load coins");
    } finally {
      setLoading(false);
    }
  }, [coins.length]);

  // Load coins on mount
  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  const handleSearchToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    if (newIsOpen) {
      // Focus input after state update
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      // Reset state when closing
      setQuery("");
      setSelectedIndex(-1);
    }
  };

  const handleCoinSelect = useCallback(async (coin: Coin) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.coinlore.net/api/ticker/?id=${coin.id}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data[0]) {
        localStorage.removeItem("portfolioState");
        setSelectedCoin(data[0]);
        
        // Close search
        setIsOpen(false);
        setQuery("");
        setSelectedIndex(-1);
      } else {
        throw new Error("No coin data received");
      }
    } catch (err) {
      console.error("Error selecting coin:", err);
      setError(err instanceof Error ? err.message : "Failed to select coin");
    } finally {
      setLoading(false);
    }
  }, [setSelectedCoin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSelectedIndex(-1);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || !filteredCoins.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCoins.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCoins.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredCoins.length) {
          handleCoinSelect(filteredCoins[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setQuery("");
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setQuery("");
        setSelectedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // Filter coins based on query
  const filteredCoins = useMemo(() => {
    if (!query.trim() || !coins.length) return [];
    
    const searchTerm = query.toLowerCase().trim();
    
    return coins
      .filter((coin) => {
        const name = coin.name.toLowerCase();
        const symbol = coin.symbol.toLowerCase();
        
        return name.includes(searchTerm) || symbol.includes(searchTerm);
      })
      .slice(0, 8); // Limit results for better performance
  }, [query, coins]);

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return "$0.00";
    
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: numPrice < 1 ? 6 : 2,
      minimumFractionDigits: 2,
    }).format(numPrice);
  };

  const formatChange = (change: string) => {
    const numChange = parseFloat(change);
    if (isNaN(numChange)) return "0.00%";
    
    return `${numChange >= 0 ? '+' : ''}${numChange.toFixed(2)}%`;
  };

  return (
    <div className="search-bar" ref={containerRef}>
      {isOpen ? (
        <div className="search-input-container">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search cryptocurrencies..."
            autoComplete="off"
            className="search-input"
            disabled={loading}
          />
          
          {loading && (
            <div className="search-loading">
              <div className="spinner"></div>
            </div>
          )}
          
          <button
            type="button"
            onClick={handleSearchToggle}
            className="search-close"
            aria-label="Close search"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSearchToggle}
          className="search-trigger"
        >
          <span className="search-placeholder">Search cryptocurrency</span>
          <svg
            className="search-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      )}
      
      {isOpen && (
        <div className="search-results" ref={resultsRef}>
          {error ? (
            <div className="search-error">
              <p>Error: {error}</p>
              <button 
                onClick={fetchCoins}
                className="retry-button"
              >
                Retry
              </button>
            </div>
          ) : filteredCoins.length > 0 ? (
            <>
              {filteredCoins.map((coin, index) => (
                <button
                  key={coin.id}
                  type="button"
                  className={`coin-option ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleCoinSelect(coin)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="coin-info">
                    <div className="coin-name">{coin.name}</div>
                    <div className="coin-symbol">{coin.symbol}</div>
                  </div>
                  <div className="coin-price-info">
                    <div className="coin-price">{formatPrice(coin.price_usd)}</div>
                    <div className={`coin-change ${parseFloat(coin.percent_change_24h) >= 0 ? 'positive' : 'negative'}`}>
                      {formatChange(coin.percent_change_24h)}
                    </div>
                  </div>
                </button>
              ))}
              <div className="search-help">
                <span>↑↓ Navigate • Enter Select • Esc Close</span>
              </div>
            </>
          ) : query.trim() ? (
            <div className="search-empty">
              <p>No cryptocurrencies found</p>
              <span>Try searching by name or symbol</span>
            </div>
          ) : (
            <div className="search-empty">
              <p>Start typing to search</p>
              <span>Search by cryptocurrency name or symbol</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

console.log("SearchBar component is exported");

export default SearchBar;
