# Zenith Development Plan

This plan is designed to elevate the Zenith prototype into a truly functional and professional dApp by integrating live on-chain data from a world-class DeFi protocol (Aave) and polishing the user interface to a high standard.

---

### **Phase 1: UI & UX Enhancement**

The goal of this phase is to fix visual bugs and implement a modern, professional user experience.

1.  **Fix StatCard UI Bug:** I will apply custom CSS to the dashboard's "StatCard" components to resolve the text-wrapping issue, ensuring all values display cleanly on a single line.
2.  **Implement Skeleton Loading:** I will create and integrate an animated "skeleton loading" component. This will replace the "Loading..." text across the application, providing a much smoother and more professional user experience while data is being fetched from the backend.

### **Phase 2: Live Blockchain Data Integration (Backend)**

This phase focuses on replacing our mock vault data with live data fetched directly from the Aave V3 protocol on the Polygon network.

1.  **Integrate Aave ABI:** I will obtain the official ABI (Application Binary Interface) for the Aave V3 Pool smart contract and add it to our backend. This ABI acts as the "instruction manual" for interacting with the contract.
2.  **Develop APY Fetching Service:** I will enhance our backend's `blockchain.ts` service. A new function will be created that uses `ethers.js` to call the Aave contract, specifically to read the `currentLiquidityRate` for a stablecoin (USDC).
3.  **Calculate Live APY:** The backend will then process the raw data returned from the Aave contract, converting it from its native "RAY" format into a human-readable APY percentage.
4.  **Update Vaults API Endpoint:** The existing `/api/vaults` endpoint will be upgraded. For the "Stablecoin Growth" vault, it will no longer return mock data. Instead, it will return the live, calculated APY from Aave, demonstrating true on-chain integration.

### **Phase 3: Display Live Data (Frontend)**

This final phase is the payoff, where the live data from the backend is displayed in the user interface.

1.  **Verify Live APY Display:** The `VaultsPage` on the frontend already fetches data from our API. Once Phase 2 is complete, it will automatically receive and display the live APY for the "Stablecoin Growth" vault, replacing the old static number. Your dashboard will reflect a real-world financial metric, updated in real-time.

---

Upon completion of these three phases, Zenith will have evolved from a prototype into a genuine, data-driven decentralized application. It will be a solid foundation for achieving the ambitious goals we have set.
