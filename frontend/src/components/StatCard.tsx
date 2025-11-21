import React from "react";
import "./StatCard.css";

interface StatCardProps {
  title: string;
  value: string;
  change?: string; // Optional for showing change (e.g., +5.2%)
  changeType?: "positive" | "negative"; // To color the change
  children?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  children,
}) => {

  return (
    <div className="card mb-3 h-100" style={{
      background: 'var(--bg-card)',
      backdropFilter: 'var(--backdrop-blur)',
      border: 'var(--glass-border)',
      boxShadow: 'var(--glass-shadow)',
      borderRadius: '16px'
    }}>
      <div className="card-body p-4">
        <h6 className="card-title text-uppercase fw-bold mb-3" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', letterSpacing: '1px' }}>{title}</h6>
        {value && <h2 className="card-text stat-value fw-bold mb-0" style={{ fontFamily: 'var(--font-heading)' }}>{value}</h2>}
        {children}
        {change && (
          <div className="mt-2 d-flex align-items-center">
            <span className={`fw-bold ${changeType === 'positive' ? 'text-success' : 'text-danger'}`} style={{ fontSize: '0.9rem' }}>
              {change}
            </span>
            <span className="ms-2 text-muted small">vs last 24h</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
