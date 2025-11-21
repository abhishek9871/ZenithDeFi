import React from "react";
import { motion } from "framer-motion";
import VaultCard from "./VaultCard";
import Skeleton from "./Skeleton";
import { useVaultData } from "../hooks/useVaultData";

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

const VaultsPage: React.FC = () => {
  const { data: vaults, isLoading, isError } = useVaultData();

  if (isError) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          Failed to load vaults. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row mb-3">
        <div className="col-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="fw-bold text-white">Investment Vaults</h2>
            <p className="text-muted">
              Browse and invest in curated DeFi strategies.
            </p>
          </motion.div>
        </div>
      </div>
      <motion.div
        className="row"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {!isLoading && vaults
          ? vaults.map((vault) => (
            <motion.div className="col-md-6 col-lg-4" key={vault.name} variants={itemVariants}>
              <VaultCard {...vault} />
            </motion.div>
          ))
          : // Skeleton for Vault Cards
          Array.from({ length: 4 }).map((_, index) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <div
                className="card text-white bg-dark mb-4"
                style={{
                  border: "var(--glass-border)",
                  background: "rgba(30, 41, 59, 0.7)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="card-body">
                  <h5 className="card-title">
                    <Skeleton style={{ width: "70%", height: "1.25rem", background: "rgba(255,255,255,0.1)" }} />
                  </h5>
                  <p className="card-text text-muted">
                    <Skeleton style={{ width: "50%", height: "1rem", background: "rgba(255,255,255,0.1)" }} />
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <Skeleton style={{ width: "40px", height: "1.5rem", background: "rgba(255,255,255,0.1)" }} />
                    </div>
                    <div>
                      <Skeleton style={{ width: "60px", height: "1.5rem", background: "rgba(255,255,255,0.1)" }} />
                    </div>
                  </div>
                  <div className="mt-3 w-100">
                    <Skeleton style={{ height: "38px", background: "rgba(255,255,255,0.1)" }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </motion.div>
    </div>
  );
};

export default VaultsPage;
