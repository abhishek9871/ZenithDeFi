import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "./StatCard";
import PortfolioChart from "./PortfolioChart";
import Skeleton from "./Skeleton";

interface PortfolioStats {
  portfolioValue: string;
  averageApy: string;
  dailyPl: string;
  dailyPlPercentage: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const Dashboard = () => {
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [blockNumber, setBlockNumber] = useState<number | null>(null);

  useEffect(() => {
    // Fetch portfolio stats once
    const timer = setTimeout(() => {
      // Simulate network delay
      fetch("http://localhost:3002/api/portfolio")
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch((err) => console.error("Failed to fetch portfolio stats:", err));
    }, 1000);

    // Fetch block number periodically
    const fetchBlockNumber = () => {
      fetch("http://localhost:3002/api/status")
        .then((res) => res.json())
        .then((data) => setBlockNumber(data.latestBlockNumber))
        .catch((err) => console.error("Failed to fetch block number:", err));
    };

    fetchBlockNumber(); // Fetch immediately on mount
    const intervalId = setInterval(fetchBlockNumber, 5000); // And then every 5 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <motion.div
      className="container mt-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="row mb-4">
        <motion.div className="col-12" variants={itemVariants}>
          <h2 className="mb-1" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Overview of your DeFi portfolio performance.</p>
        </motion.div>
      </div>
      <div className="row mb-4">
        {stats ? (
          <>
            <motion.div className="col-md-4" variants={itemVariants}>
              <StatCard title="Total Value" value={stats.portfolioValue} />
            </motion.div>
            <motion.div className="col-md-4" variants={itemVariants}>
              <StatCard title="Average APY" value={stats.averageApy} />
            </motion.div>
            <motion.div className="col-md-4" variants={itemVariants}>
              <StatCard
                title="Daily P/L"
                value={stats.dailyPl}
                change={stats.dailyPlPercentage}
                changeType="positive"
              />
            </motion.div>
          </>
        ) : (
          // Skeleton for Stat Cards
          Array.from({ length: 3 }).map((_, index) => (
            <div className="col-md-4" key={index}>
              <div className="card text-white bg-dark mb-3" style={{ border: 'var(--glass-border)', background: 'rgba(30, 41, 59, 0.7)' }}>
                <div className="card-body">
                  <h5 className="card-title text-muted">
                    <Skeleton style={{ width: "50%", height: "1.25rem", background: "rgba(255,255,255,0.1)" }} />
                  </h5>
                  <h3 className="card-text">
                    <Skeleton style={{ height: "2rem", background: "rgba(255,255,255,0.1)" }} />
                  </h3>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="row mb-4">
        <motion.div className="col-12" variants={itemVariants}>
          <PortfolioChart />
        </motion.div>
      </div>
      <div className="row">
        <motion.div className="col-md-4" variants={itemVariants}>
          <StatCard
            title="Polygon Network Status"
            value={blockNumber ? `Block: ${blockNumber}` : ""}
          >
            {!blockNumber && <Skeleton style={{ height: "2rem", background: "rgba(255,255,255,0.1)" }} />}
          </StatCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
