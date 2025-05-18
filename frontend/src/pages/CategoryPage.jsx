import React, { useEffect, useState } from 'react';
import { animeApi } from '../services/api';
import AnimeCard from '../components/AnimeCard';
import '../styles/CategoryPage.css';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await animeApi.getCategories(); // Ensure api returns { categories: [...] }
        setCategories(res.data.categories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;
    setLoading(true);
    async function fetchAnimeByCategory() {
      try {
        const res = await animeApi.getAnimeByCategory(selectedCategory);
        setAnimes(res.data.animes);
      } catch (err) {
        console.error('Failed to fetch animes by category:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnimeByCategory();
  }, [selectedCategory]);

  return (
    <div className="category-container">
      <h1 className="home-title">Browse by Category</h1>

      <div className="category-dropdown-wrapper">
        <select
          className="category-dropdown"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="center-text">Loading animes...</p>
      ) : (
        <div className="anime-grid">
          {animes.map((anime) => (
            <AnimeCard key={anime.anime_id} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
