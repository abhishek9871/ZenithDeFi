import { ethers } from "ethers";
import NodeCache from "node-cache";
const PoolV3Artifact = require("@aave/core-v3/artifacts/contracts/protocol/pool/Pool.sol/Pool.json");

// --- CONFIGURATION ---
const RPC_URLS = [
  "https://polygon.drpc.org",
  "https://polygon-rpc.com",
  "https://rpc.ankr.com/polygon",
  "https://polygon.publicnode.com",
];

const AAVE_POOL_V3_ADDRESS = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";
const USDC_POLYGON_ADDRESS = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

// --- CACHE ---
const cache = new NodeCache({ stdTTL: 60 }); // Cache for 60 seconds

/**
 * Helper function to execute a blockchain operation with RPC failover.
 */
async function executeWithFailover<T>(
  operation: (provider: ethers.JsonRpcProvider) => Promise<T>
): Promise<T> {
  let lastError: any;

  for (const url of RPC_URLS) {
    try {
      // Create a fresh provider for each attempt to ensure no stale state
      const provider = new ethers.JsonRpcProvider(url);
      // Simple check to see if provider is responsive (optional, but good practice)
      // await provider.getNetwork(); 

      return await operation(provider);
    } catch (error) {
      console.warn(`RPC failed: ${url}`, error);
      lastError = error;
      // Continue to next RPC
    }
  }

  throw new Error(
    `All RPCs failed. Last error: ${lastError?.message || "Unknown error"}`
  );
}

/**
 * Fetches the latest block number from the Polygon network.
 * @returns {Promise<number>} The latest block number.
 */
export async function getLatestBlockNumber(): Promise<number> {
  return executeWithFailover(async (provider) => {
    return await provider.getBlockNumber();
  });
}

/**
 * Fetches the current supply APY for a given asset from the Aave V3 Pool.
 * @returns {Promise<number>} The calculated APY as a percentage.
 */
export async function getAaveApy(): Promise<number> {
  // 1. Check Cache
  const cachedApy = cache.get<number>("aave_apy");
  if (cachedApy !== undefined) {
    return cachedApy;
  }

  // 2. Fetch from Blockchain with Failover
  try {
    const apy = await executeWithFailover(async (provider) => {
      const aavePoolContract = new ethers.Contract(
        AAVE_POOL_V3_ADDRESS,
        PoolV3Artifact.abi,
        provider
      );

      const reserveData = await aavePoolContract.getReserveData(
        USDC_POLYGON_ADDRESS
      );

      // Convert from RAY to percentage
      const RAY = BigInt(10) ** BigInt(27);
      const depositAPY = Number(reserveData.currentLiquidityRate) / Number(RAY);

      return depositAPY * 100;
    });

    // 3. Set Cache
    cache.set("aave_apy", apy);
    return apy;
  } catch (error) {
    console.error("Failed to fetch Aave APY after retries:", error);
    throw error;
  }
}
