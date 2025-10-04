// src/app/articles/ArticleList.tsx

import "./articles.scss";
import ArticleCard from "./ArticleCard";

interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  time: string;
}

interface ArticleListProps {
  articles: Article[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  return (
    <div className="article-list">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
