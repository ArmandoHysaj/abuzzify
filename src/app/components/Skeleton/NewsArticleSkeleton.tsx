import React from 'react';
import Skeleton from './Skeleton';
import './news-article-skeleton.scss';

interface NewsArticleSkeletonProps {
  count?: number;
}

const NewsArticleSkeleton: React.FC<NewsArticleSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="news-articles-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="news-article-skeleton">
          <Skeleton width="100%" height="180px" variant="rounded" className="skeleton-image" />
          <div className="skeleton-content">
            <Skeleton width="90%" height="24px" variant="rounded" />
            <Skeleton width="100%" height="16px" />
            <Skeleton width="95%" height="16px" />
            <Skeleton width="80%" height="16px" />
            <div className="skeleton-meta">
              <Skeleton width="100px" height="14px" />
              <Skeleton width="120px" height="14px" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsArticleSkeleton;

