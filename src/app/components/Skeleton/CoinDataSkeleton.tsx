import React from 'react';
import Skeleton from './Skeleton';
import './coin-data-skeleton.scss';

const CoinDataSkeleton: React.FC = () => {
  return (
    <div className="coin-data-skeleton">
      {/* Coin Header Card */}
      <div className="skeleton-coin-header-card">
        <div className="skeleton-coin-header">
          <Skeleton width="48px" height="48px" variant="circular" />
          <div className="skeleton-coin-title">
            <Skeleton width="180px" height="28px" variant="rounded" />
            <Skeleton width="80px" height="20px" variant="rounded" />
          </div>
          <div className="skeleton-coin-price">
            <Skeleton width="100px" height="16px" />
            <Skeleton width="140px" height="24px" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="skeleton-stats-grid">
        {/* Price Changes Card */}
        <div className="skeleton-stat-card">
          <Skeleton width="120px" height="22px" variant="rounded" />
          <div className="skeleton-stat-items">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-stat-item">
                <Skeleton width="70px" height="14px" />
                <Skeleton width="60px" height="18px" />
              </div>
            ))}
          </div>
        </div>

        {/* Market Statistics Card */}
        <div className="skeleton-stat-card">
          <Skeleton width="150px" height="22px" variant="rounded" />
          <div className="skeleton-stat-items">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-stat-item">
                <Skeleton width="100px" height="14px" />
                <Skeleton width="120px" height="18px" />
              </div>
            ))}
          </div>
        </div>

        {/* Similar Coins Card */}
        <div className="skeleton-stat-card">
          <Skeleton width="110px" height="22px" variant="rounded" />
          <div className="skeleton-similar-coins">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton-coin-item">
                <Skeleton width="140px" height="16px" />
                <Skeleton width="80px" height="16px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDataSkeleton;

