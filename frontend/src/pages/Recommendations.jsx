// src/pages/Recommendations.jsx
import { useState, useEffect } from 'react';
import { animeApi } from '../services/api';
import AnimeCard from '../components/AnimeCard';

export default function Recommendations() {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await animeApi.getPersonalizedAnimes();
        setRecs(response.data.recommendations || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (recs.length === 0)
    return (
      <div className="text-center mt-8">
        No recommendations found. Try rating some anime!
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Your Personalized Recommendations
      </h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {recs.map((anime) => (
          <AnimeCard key={anime.anime_id} anime={anime} />
        ))}
      </div>
    </div>
  );
}
