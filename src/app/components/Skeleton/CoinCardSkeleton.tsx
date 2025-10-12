import React from 'react';
import Skeleton from './Skeleton';
import './coin-card-skeleton.scss';

interface CoinCardSkeletonProps {
  count?: number;
}

const CoinCardSkeleton: React.FC<CoinCardSkeletonProps> = ({ count = 5 }) => {
  return (
    <div className="coin-cards-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="coin-card-skeleton">
          <div className="skeleton-header">
            <div className="skeleton-coin-info">
              <Skeleton width="120px" height="20px" variant="rounded" />
              <Skeleton width="50px" height="16px" variant="rounded" />
            </div>
            <Skeleton width="80px" height="28px" variant="rounded" />
          </div>
          
          <div className="skeleton-stats">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="skeleton-stat">
                <Skeleton width="60px" height="12px" />
                <Skeleton width="80px" height="18px" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoinCardSkeleton;

