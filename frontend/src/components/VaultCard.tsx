import React from 'react';

interface VaultCardProps {
  name: string;
  assets: string[];
  risk: 'Low' | 'Medium' | 'High';
  apy: number;
}



const VaultCard: React.FC<VaultCardProps> = ({ name, assets, risk, apy }) => {
  return (
    <div className="card h-100" style={{
      background: 'var(--bg-card)',
      backdropFilter: 'var(--backdrop-blur)',
      border: 'var(--glass-border)',
      boxShadow: 'var(--glass-shadow)',
      borderRadius: '16px',
      transition: 'transform 0.2s, background 0.2s'
    }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-card)'}
    >
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5 className="card-title fw-bold mb-0" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>{name}</h5>
          <span className={`badge rounded-pill px-3 py-2 ${risk === 'Low' ? 'bg-success' : risk === 'Medium' ? 'bg-warning text-dark' : 'bg-danger'}`} style={{ opacity: 0.9 }}>
            {risk} Risk
          </span>
        </div>

        <p className="card-text mb-4" style={{ color: 'var(--text-secondary)' }}>
          Assets: <span className="text-white fw-medium">{assets.join(', ')}</span>
        </p>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="d-block small text-uppercase text-muted mb-1" style={{ letterSpacing: '1px' }}>APY</span>
              <span className="h3 fw-bold text-success mb-0" style={{ fontFamily: 'var(--font-heading)' }}>{apy.toFixed(2)}%</span>
            </div>
          </div>

          <button className="btn btn-primary w-100 py-2 fw-bold rounded-3" style={{
            background: 'var(--secondary-gradient)',
            border: 'none',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            Invest Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default VaultCard;
