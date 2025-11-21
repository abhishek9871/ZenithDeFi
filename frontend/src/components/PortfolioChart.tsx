import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Skeleton from "./Skeleton";

interface ChartData {
  name: string;
  value: number;
}

const PortfolioChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate network delay
      fetch("http://localhost:3001/api/portfolio/history")
        .then((res) => res.json())
        .then((chartData) => setData(chartData))
        .catch((err) =>
          console.error("Failed to fetch portfolio history:", err),
        );
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="card text-white bg-dark">
      <div className="card-body">
        <h5 className="card-title text-muted mb-3">Portfolio Performance</h5>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#333",
                  border: "1px solid #555",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Skeleton style={{ width: "100%", height: "300px" }} />
        )}
      </div>
    </div>
  );
};

export default PortfolioChart;
