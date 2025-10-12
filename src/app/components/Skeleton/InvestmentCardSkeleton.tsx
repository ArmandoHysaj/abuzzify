import React from 'react';
import Skeleton from './Skeleton';
import './investment-card-skeleton.scss';

const InvestmentCardSkeleton: React.FC = () => {
  return (
    <div className="investment-card-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-coin-info">
          <Skeleton width="150px" height="24px" variant="rounded" />
          <Skeleton width="60px" height="20px" variant="rounded" />
        </div>
        <Skeleton width="80px" height="18px" variant="rounded" />
      </div>

      <div className="skeleton-content">
        <div className="skeleton-performance">
          <Skeleton width="120px" height="16px" variant="rounded" />
          <Skeleton width="100px" height="28px" variant="rounded" />
          <Skeleton width="140px" height="24px" variant="rounded" />
        </div>

        <div className="skeleton-details">
          <div className="skeleton-detail-row">
            <Skeleton width="80px" height="14px" />
            <Skeleton width="100px" height="14px" />
          </div>
          <div className="skeleton-detail-row">
            <Skeleton width="90px" height="14px" />
            <Skeleton width="120px" height="14px" />
          </div>
          <div className="skeleton-detail-row">
            <Skeleton width="95px" height="14px" />
            <Skeleton width="110px" height="14px" />
          </div>
        </div>
      </div>

      <div className="skeleton-actions">
        <Skeleton width="100%" height="40px" variant="rounded" />
        <Skeleton width="100%" height="40px" variant="rounded" />
      </div>
    </div>
  );
};

export default InvestmentCardSkeleton;

