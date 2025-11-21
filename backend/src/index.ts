import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import winston from "winston";
import { getLatestBlockNumber, getAaveApy } from "./blockchain";

// --- Logger Configuration ---
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

const app = express();
const port = 3002;

// --- Security Middleware ---
app.use(helmet()); // Security Headers
app.use(
  cors({
    origin: "http://localhost:5173", // Strict CORS
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// --- Rate Limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// --- Mock Data ---
const mockPortfolio = {
  portfolioValue: "$10,450.78",
  averageApy: "12.5%",
  dailyPl: "+$56.24",
  dailyPlPercentage: "+0.54%",
};

const mockPortfolioHistory = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 4250 },
  { name: "Mar", value: 4100 },
  { name: "Apr", value: 4800 },
  { name: "May", value: 5100 },
  { name: "Jun", value: 5300 },
  { name: "Jul", value: 5850 },
];

const mockVaults = [
  { name: "Stablecoin Growth", assets: ["USDC", "DAI"], risk: "Low", apy: 8.2 },
  { name: "Ethereum Yield Farm", assets: ["WETH"], risk: "Medium", apy: 15.6 },
  { name: "BTC Optimizer", assets: ["WBTC"], risk: "Medium", apy: 12.1 },
  {
    name: "High-Yield DeFi Basket",
    assets: ["ETH", "UNI", "AAVE"],
    risk: "High",
    apy: 25.9,
  },
];
// --------------------

app.get("/", (req, res) => {
  res.send("Hello from the Zenith Backend!");
});

// --- API Endpoints ---
app.get("/api/portfolio", (req, res) => {
  res.json(mockPortfolio);
});

app.get("/api/portfolio/history", (req, res) => {
  res.json(mockPortfolioHistory);
});

app.get("/api/vaults", async (req, res, next) => {
  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 20000)
    );

    const liveApy = await Promise.race([getAaveApy(), timeout]);

    const updatedVaults = mockVaults.map((vault) => {
      if (vault.name === "Stablecoin Growth") {
        return { ...vault, apy: liveApy as number };
      }
      return vault;
    });
    res.json(updatedVaults);
  } catch (error) {
    logger.error("Error fetching vaults:", error);
    // Fallback to mock data on error, but log it
    res.json(mockVaults);
  }
});

app.get("/api/status", async (req, res, next) => {
  try {
    const blockNumber = await getLatestBlockNumber();
    res.json({ latestBlockNumber: blockNumber });
  } catch (error) {
    next(error); // Pass to error handler
  }
});

// --- Centralized Error Handling ---
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// --------------------

app.listen(port, () => {
  logger.info(`Backend server listening at http://localhost:${port}`);
});
