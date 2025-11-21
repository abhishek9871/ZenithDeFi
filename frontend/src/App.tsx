import { useState } from "react";
import { ethers } from "ethers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "react-error-boundary";
import VaultsPage from "./components/VaultsPage";
import Dashboard from "./components/Dashboard";

// --- Configuration ---
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

type View = "dashboard" | "vaults";

declare global {
  interface Window {
    ethereum: any;
  }
}

// --- Components ---
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-white" style={{ background: '#0f172a' }}>
      <h2 className="text-danger mb-3">Something went wrong</h2>
      <p className="text-muted mb-4">{error.message}</p>
      <button className="btn btn-primary" onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  );
}

function AppContent() {
  const [address, setAddress] = useState<string | null>(null);
  const [view, setView] = useState<View>("dashboard");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAddress(accounts[0]);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const renderContent = () => {
    if (!address) {
      return (
        <div className="container mt-5 text-center">
          <h1 className="display-4 fw-bold mb-3" style={{
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Welcome to Zenith</h1>
          <p className="lead text-muted mb-5">
            Your journey into simplified DeFi starts here.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button
              className="btn btn-primary btn-lg px-4 fw-bold"
              onClick={connectWallet}
              style={{ background: 'var(--primary-gradient)', border: 'none' }}
            >
              Connect Wallet to Begin
            </button>
            <button
              className="btn btn-outline-secondary btn-lg px-4"
              onClick={() => setAddress("0x1234...5678")}
            >
              Demo Login
            </button>
          </div>
        </div>
      );
    }

    switch (view) {
      case "dashboard":
        return <Dashboard />;
      case "vaults":
        return <VaultsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top" style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: 'var(--glass-border)',
        zIndex: 1000
      }}>
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <span style={{
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>Zenith</span>
          </a>

          <div className="collapse navbar-collapse" id="navbarNav">
            {address && (
              <ul className="navbar-nav me-auto ms-4">
                <li className="nav-item">
                  <button
                    className={`nav-link px-3 btn btn-link text-decoration-none ${view === "dashboard" ? "active text-white fw-bold" : "text-secondary"}`}
                    onClick={() => setView("dashboard")}
                  >
                    Dashboard
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link px-3 btn btn-link text-decoration-none ${view === "vaults" ? "active text-white fw-bold" : "text-secondary"}`}
                    onClick={() => setView("vaults")}
                  >
                    Vaults
                  </button>
                </li>
              </ul>
            )}

            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                {address ? (
                  <div className="d-flex align-items-center px-3 py-2 rounded-pill" style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: 'var(--glass-border)'
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', marginRight: 8 }}></div>
                    <span className="small font-monospace text-white">
                      {`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
                    </span>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary rounded-pill px-4 fw-bold"
                    onClick={connectWallet}
                    style={{ background: 'var(--primary-gradient)', border: 'none' }}
                  >
                    Connect Wallet
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>{renderContent()}</main>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
