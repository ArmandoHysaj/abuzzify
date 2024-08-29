"use client";
import CoinCarouselBar from "@/app/components/CoinCarouselBar/CoinCarouselBar";
import "../../components/CoinCarouselBar/coin-carousel-bar.scss";

// src/app/articles/page.tsx

import { useState } from "react";
import "./articles.scss";
import ArticleList from "./ArticleList";
import { articlesData } from "./articlesData";

const INITIAL_PAGE_SIZE = 8;
const LOAD_MORE_SIZE = 4;

export default function ArticlesPage() {
  const [visibleArticles, setVisibleArticles] = useState(
    articlesData.slice(0, INITIAL_PAGE_SIZE)
  );
  const [loadedAll, setLoadedAll] = useState(false);

  const loadMoreArticles = () => {
    const nextArticles = articlesData.slice(
      visibleArticles.length,
      visibleArticles.length + LOAD_MORE_SIZE
    );
    setVisibleArticles([...visibleArticles, ...nextArticles]);

    if (visibleArticles.length + nextArticles.length >= articlesData.length) {
      setLoadedAll(true);
    }
  };

  const progressPercentage = Math.min(
    (visibleArticles.length / articlesData.length) * 100,
    100
  );

  return (
    <>
      <CoinCarouselBar />
      <div className="article-section container">
        <h1 className="heading">Latest Crypto Articles</h1>
        <ArticleList articles={visibleArticles} />
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="indicator-bar">
          {`Loaded ${visibleArticles.length} of ${articlesData.length} articles`}
        </div>
        {!loadedAll && (
          <button
            className="load-more-button cp-text"
            onClick={loadMoreArticles}
          >
            Load More
          </button>
        )}
      </div>
    </>
  );
}
