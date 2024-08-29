// src/app/articles/ArticleCard.tsx

import { useState } from "react";
import "./articles.scss";
import ArticleContent from "./ArticleContent";

interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
}

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const [showContent, setShowContent] = useState(false);

  return (
    <div className="article-card" onClick={() => setShowContent(!showContent)}>
      <h3 className="article-title">{article.title}</h3>
      <p className="article-summary cp-text">{article.summary}</p>
      {showContent && <ArticleContent content={article.content} />}
    </div>
  );
}
