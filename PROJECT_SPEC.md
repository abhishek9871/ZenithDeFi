
# Project Specification: Zenith

## 1. Product Requirements Document (PRD)

### 1.1. Introduction & Vision
Zenith is a web-based platform that democratizes Decentralized Finance (DeFi). The core vision is to abstract away the complexity of blockchain technology, allowing non-technical users to participate in and benefit from sophisticated investment strategies that are typically only accessible to crypto experts. The platform will provide a secure, intuitive, and transparent experience, making high-yield finance as easy as using a traditional savings account.

### 1.2. User Personas

*   **Priya, The Novice Investor (28):**
    *   **Background:** A marketing professional who has heard about the high returns in cryptocurrency but is intimidated by the jargon and technical hurdles.
    *   **Goals:** Wants to grow her savings faster than a traditional bank account. She is risk-averse and needs to trust the platform.
    *   **Frustrations:** Finds existing DeFi platforms confusing and overwhelming. Worries about security and the potential for losing her investment.

*   **David, The Tech-Savvy Explorer (35):**
    *   **Background:** A software developer who understands blockchain basics but doesn't have the time to research and manage complex, multi-step DeFi strategies continuously.
    *   **Goals:** Wants to efficiently allocate a portion of his portfolio to high-yield, automated strategies. Values performance and data transparency.
    *   **Frustrations:** Juggling multiple platforms and protocols is time-consuming. He wants a single, reliable dashboard to manage his DeFi holdings.

### 1.3. High-Level Goals
*   **Q1:** Launch a prototype with user onboarding, a portfolio dashboard, and at least two investment "Vaults".
*   **Q2:** Implement full backend integration with a Layer 2 blockchain (Polygon) to ensure low transaction fees.
*   **Q3:** Introduce social features and a referral program.
*   **Q4:** Achieve compliance with relevant financial regulations and expand the number of investment Vaults.

---

## 2. Functional Requirements Specification (FRS)

The system's functionality is described through user stories.

### 2.1. User Authentication & Wallet Management
*   **FR1:** As a new user, I can create an account using my email and password or by connecting my existing Web3 wallet (e.g., MetaMask).
*   **FR2:** As a user, I can securely connect and disconnect my wallet to the platform.
*   **FR3:** As a user, I can view my connected wallet address and its balance of native tokens.

### 2.2. Portfolio & Dashboard
*   **FR4:** As a user, I can view a dashboard that displays my total portfolio value, overall profit/loss, and a historical performance chart.
*   **FR5:** As a user, my dashboard will show a breakdown of my investments across different Vaults.

### 2.3. Investment Vaults
*   **FR6:** As a user, I can browse a list of available "Investment Vaults".
*   **FR7:** As a user, I can see key details for each Vault, including its name, strategy description, risk level (Low, Medium, High), and projected annual percentage yield (APY).
*   **FR8:** As a user, I can enter the amount I want to invest and deposit funds into a selected Vault with a single confirmation step.
*   **FR9:** As a user, I can withdraw my funds (principal + earnings) from a Vault, subject to the protocol's terms.

### 2.4. Educational Content
*   **FR10:** As a user, I can access a "Learn" section with simple articles and FAQs explaining DeFi concepts.

---

## 3. Software Requirements Specification (SRS) & Design

### 3.1. Non-Functional Requirements
*   **NFR1 (Security):** All communication between the client and server must be encrypted via HTTPS. Private keys and sensitive user data will never be stored on platform servers. Smart contract interactions must be audited.
*   **NFR2 (Performance):** The web application must load in under 3 seconds. Dashboard data should refresh every 60 seconds. Transactions should be processed on-chain in a timely manner, with clear feedback provided to the user.
*   **NFR3 (Usability):** The user interface must be intuitive and require no prior knowledge of DeFi. All actions should be completable in 3 clicks or less. The design must be responsive and functional on all modern web browsers (Chrome, Firefox, Safari, Edge) and screen sizes.
*   **NFR4 (Reliability):** The platform shall aim for 99.9% uptime.

### 3.2. Technical Architecture & Specification

*   **Frontend:**
    *   **Framework:** React v18+ with TypeScript
    *   **State Management:** React Context or Zustand for global state (e.g., user session, wallet connection).
    *   **Styling:** Bootstrap 5 with Material Design principles for a clean, responsive layout.
    *   **Blockchain Interaction:** `ethers.js` library to interact with the connected wallet and smart contracts.
    *   **Charts:** `Recharts` or `Chart.js` for data visualization.

*   **Backend:**
    *   **Framework:** Node.js with Express.js and TypeScript.
    *   **Blockchain Interaction:** A service layer using `ethers.js` will manage interactions with DeFi smart contracts on the Polygon network. This includes depositing, withdrawing, and checking Vault balances.
    *   **API:** A RESTful API will expose endpoints for user data, portfolio information, and Vault details.
    *   **Database:** A PostgreSQL database to store off-chain data like user profiles and cached metadata. (Initially, may be mocked).

*   **Blockchain:**
    *   **Network:** Polygon (for low fees and fast transactions).
    *   **Smart Contracts:** The backend will interact with established and audited DeFi protocols (e.g., Aave, Curve, Yearn Finance) via their public smart contract interfaces. Zenith will not deploy its own core financial strategy contracts initially, acting as an aggregator.

### 3.3. High-Level Data Models

*   **User:**
    *   `userId` (Primary Key)
    *   `email` (Optional)
    *   `walletAddress` (Unique)
    *   `createdAt`

*   **Vault:**
    *   `vaultId` (Primary Key)
    *   `name` (e.g., "Stablecoin Growth")
    *   `description`
    *   `riskLevel` ("Low", "Medium", "High")
    *   `apy` (Number, updated periodically)
    *   `contractAddress` (Address of the vault's smart contract)

*   **Investment:**
    *   `investmentId` (Primary Key)
    *   `userId` (Foreign Key to User)
    *   `vaultId` (Foreign Key to Vault)
    *   `amount` (Number)
    *   `startDate`
    *   `currentValue` (Number)
