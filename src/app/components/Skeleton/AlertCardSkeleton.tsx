import React from 'react';
import Skeleton from './Skeleton';
import './alert-card-skeleton.scss';

const AlertCardSkeleton: React.FC = () => {
  return (
    <div className="alert-card-skeleton">
      <div className="skeleton-header">
        <Skeleton width="180px" height="24px" variant="rounded" />
        <Skeleton width="80px" height="24px" variant="rounded" />
      </div>
      
      <div className="skeleton-details">
        <div className="skeleton-meta">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-meta-item">
              <Skeleton width="70px" height="12px" />
              <Skeleton width="90px" height="16px" />
            </div>
          ))}
        </div>
        
        <div className="skeleton-status">
          <Skeleton width="100%" height="48px" variant="rounded" />
        </div>
        
        <div className="skeleton-notifications">
          {[1, 2].map((i) => (
            <Skeleton key={i} width="150px" height="16px" variant="rounded" />
          ))}
        </div>
        
        <div className="skeleton-actions">
          <Skeleton width="100%" height="42px" variant="rounded" />
          <Skeleton width="100%" height="42px" variant="rounded" />
        </div>
      </div>
    </div>
  );
};

export default AlertCardSkeleton;

