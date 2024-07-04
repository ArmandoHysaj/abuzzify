import "../portfolio/portfolio.scss";

interface PortfolioProps {
  selectedCoin: any;
}

const Portfolio: React.FC<PortfolioProps> = ({ selectedCoin }) => {
  return (
    <div className="portfolio-section container">
      {selectedCoin ? (
        <div className="coin-container">
          <div className="coin-details">
            <h2>{selectedCoin.name}</h2>
            <div>
              <span className="title">Symbol:</span>
              <span className="result"> {selectedCoin.symbol}</span>
            </div>
            <div>
              <span className="title">Price:</span>
              <span className="result"> {selectedCoin.price_usd}</span>
            </div>
            <div>
              <span className="title">Market Cap:</span>
              <span className="result"> {selectedCoin.market_cap_usd}</span>
            </div>
            <div>
              <span className="title">24h Volume:</span>
              <span className="result"> {selectedCoin.volume24}</span>
            </div>
            <div>
              <span className="title">Change 1h:</span>
              <span className="result"> {selectedCoin.percent_change_1h}%</span>
            </div>
            <div>
              <span className="title">Change 24h:</span>
              <span className="result"> {selectedCoin.percent_change_24h}%</span>
            </div>
            <div>
              <span className="title">Change 7 days:</span>
              <span className="result"> {selectedCoin.percent_change_7d}%</span>
            </div>
          </div>
          <div className="coin-graph"></div>
        </div>
      ) : (
        <div className="title">No coin selected</div>
      )}
    </div>
  );
};

export default Portfolio;
