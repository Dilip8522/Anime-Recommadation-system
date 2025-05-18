import React, { useEffect, useState } from 'react';
import { animeApi } from '../services/api';
import AnimeCard from '../components/AnimeCard';
import '../styles/WishlistPage.css';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        // 1. Get wishlist (contains anime_id and email)
        const res = await animeApi.getWishlist();
        setWishlist(res.data.wishlist || []);

        // 2. Fetch details for each anime_id in wishlist
        const animeDetailsPromises = res.data.wishlist.map((item) =>
          animeApi.getAnimeDetails(item.anime_id).then((res) => res.data)
        );

        // const animeDetails = await Promise.all(animeDetailsPromises);
        // setAnimes(animeDetails);
        const animeDetails = await Promise.all(animeDetailsPromises);
        setAnimes(animeDetails.map((item) => item.details));  // <-- FIX HERE

      } catch (err) {
        console.error('Failed to load wishlist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) return <p className="center-text">Loading wishlist...</p>;

  if (!animes.length) return <p className="center-text">Your wishlist is empty.</p>;

  return (
    <div className="wishlist-container">
      <h1 className="page-title">My Wishlist</h1>
      <div className="anime-grid">
        {animes.map((anime) => (
          <AnimeCard key={anime.anime_id} anime={anime} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
