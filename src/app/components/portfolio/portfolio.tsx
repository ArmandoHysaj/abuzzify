// import React, { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../store";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
import "../portfolio/portfolio.scss";

// Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

const Portfolio = () => {
    // const selectedCoin = useSelector(
    //   (state: RootState) => state.coin.selectedCoin
    // );
  const selectedCoin = "" as any;
    // useEffect(() => {
    //   console.log(selectedCoin);
    // }, [selectedCoin]);
  
    const data = {
      labels: ["1h", "24h", "7d"],
      datasets: [
        {
          label: `${selectedCoin ? selectedCoin.name : "Coin"} Price Change`,
          data: selectedCoin
            ? [
                selectedCoin.percent_change_1h,
                selectedCoin.percent_change_24h,
                selectedCoin.percent_change_7d,
              ]
            : [],
          fill: true,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(75, 192, 192, 1)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
        },
      ],
    };
  
    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
  
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
                <span className="result"> {selectedCoin.volume24}%</span>
              </div>
              <div>
                <span className="title">Change 1h:</span>
                <span className="result"> {selectedCoin.percent_change_1h}%</span>
              </div>
              <div>
                <span className="title">Change 24h:</span>
                <span className="result">
                  {" "}
                  {selectedCoin.percent_change_24h}%
                </span>
              </div>
              <div>
                <span className="title">Change 7 days:</span>
                <span className="result"> {selectedCoin.percent_change_7d}%</span>
              </div>
            </div>
            <div className="coin-graph">
              {/* <Line data={data} options={options} /> */}
            </div>
          </div>
        ) : (
          <div className="title">No coin selected</div>
        )}
      </div>
    );
  };
  
  export default Portfolio;