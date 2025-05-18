import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AnimeCard.css';

const AnimeCard = ({ anime }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/anime/${anime.anime_id}`, { state: { anime } });
  };

  return (
    <div className="anime-card" onClick={handleClick}>
      <img
        src={anime['Image URL'] || 'https://via.placeholder.com/300x400'}
        alt={anime['English name'] || anime.Name}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x400';
        }}
      />
      <div className="anime-card-content">
        <div className="anime-titles">
          {anime['English name'] || anime.Name}
        </div>
        <p className="anime-synopsis-card">
          {anime.Synopsis
            ? `${anime.Synopsis.substring(0, 150)}...`
            : 'No synopsis available'}
        </p>
      </div>
    </div>
  );
};

export default AnimeCard;
