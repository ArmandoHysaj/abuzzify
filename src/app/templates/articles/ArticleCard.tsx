// src/app/articles/ArticleCard.tsx

import { useEffect, useState } from "react";
import "./articles.scss";
import ArticleContent from "./ArticleContent";

interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  time: string;
}

interface ArticleCardProps {
  article: Article;
}

const LOCAL_STORAGE_KEY = "selectedTeasers";

export default function ArticleCard({ article }: ArticleCardProps) {
  const [showContent, setShowContent] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    // Check if the article ID is in localStorage on component mount
    const selectedTeasers = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"
    );
    setIsSelected(selectedTeasers.includes(article.id));
  }, [article.id]);

  const handleTeaserClick = () => {
    if (!isSelected) {
      // Add to selected teasers if not already selected
      const selectedTeasers = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"
      );
      const updatedTeasers = [...selectedTeasers, article.id];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTeasers));
      setIsSelected(true);
    }

    setShowContent((prevShowContent) => !prevShowContent);
  };

  return (
    <div
      className={`article-card ${isSelected ? "selected" : ""} ${
        showContent ? "active" : ""
      }`}
      onClick={handleTeaserClick}
    >
      <span className="active-bubble"></span>
      <div className="reading-time">
        <span className="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            viewBox="0 0 122.88 122.88"
            xmlSpace="preserve"
          >
            <style type="text/css">{`.st0{fill-rule:evenodd;clip-rule:evenodd;}`}</style>
            <g>
              <path
                className="st0"
                d="M61.44,0c33.93,0,61.44,27.51,61.44,61.44c0,33.93-27.51,61.44-61.44,61.44C27.51,122.88,0,95.37,0,61.44 C0,27.51,27.51,0,61.44,0L61.44,0z M52.92,30.52h7.51c1.37,0,2.5,1.13,2.5,2.5v28.94h26.41c1.38,0,2.5,1.13,2.5,2.5v7.51 c0,1.38-1.13,2.5-2.5,2.5H50.41V33.02C50.41,31.64,51.54,30.52,52.92,30.52L52.92,30.52z M61.44,13.95 c26.23,0,47.49,21.26,47.49,47.49c0,26.23-21.26,47.49-47.49,47.49c-26.23,0-47.49-21.26-47.49-47.49 C13.95,35.22,35.21,13.95,61.44,13.95L61.44,13.95z"
              />
            </g>
          </svg>
        </span>
        <span className="text cp-text-s">{article.time}</span>
      </div>
      <h3 className="article-title">{article.title}</h3>
      <p className="article-summary cp-text">{article.summary}</p>
      {showContent && <ArticleContent content={article.content} />}
    </div>
  );
}
