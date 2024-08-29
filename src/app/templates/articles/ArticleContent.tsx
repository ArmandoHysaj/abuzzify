// src/app/articles/ArticleContent.tsx

import "./articles.scss";

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="article-content cp-text">
      <p>{content}</p>
    </div>
  );
}
