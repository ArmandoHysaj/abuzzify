import React from 'react';
import Skeleton from './Skeleton';
import './portfolio-stats-skeleton.scss';

const PortfolioStatsSkeleton: React.FC = () => {
  return (
    <div className="portfolio-stats-skeleton">
      {[1, 2, 3].map((i) => (
        <div key={i} className="stat-card-skeleton">
          <Skeleton width="32px" height="32px" variant="circular" />
          <div className="stat-content-skeleton">
            <Skeleton width="100px" height="14px" variant="rounded" />
            <Skeleton width="120px" height="24px" variant="rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioStatsSkeleton;

