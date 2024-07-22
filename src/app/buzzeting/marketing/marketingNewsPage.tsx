"use client";
import { useEffect, useState } from "react";

interface Photo {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const MarketingNewsPage: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch("/api/jsonPlaceholder");
        const data: Photo[] = await response.json();
        setPhotos(data);
      } catch (err) {
        setError("Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Photo Gallery</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {photos.slice(0, 10).map((photo) => (
          <div key={photo.id} style={{ margin: "10px" }}>
            <img
              src={photo.thumbnailUrl}
              alt={photo.title}
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <p>{photo.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketingNewsPage;
