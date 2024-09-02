// src/app/crypto-exchange-overview/VolumeTrendChart.tsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const VolumeTrendChart: React.FC<{ exchanges: any[] }> = ({ exchanges }) => {
  const data = exchanges.map((exchange) => ({
    name: exchange.name,
    volume: exchange.volume_usd,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="volume" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default VolumeTrendChart;
