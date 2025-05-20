import React, { useEffect, useState } from 'react';
import { animeApi } from '../services/api';
import AnimeCard from '../components/AnimeCard';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Action');
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await animeApi.getCategories();
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
    <div className="min-h-screen bg-[#0f0f1a] text-white font-orbitron p-8">
      <h1 className="text-3xl text-center mb-8 text-cyan-400 drop-shadow-[0_0_10px_#00ffff]">
        Browse by Category
      </h1>

      <div className="flex justify-row mb-8">
        <select
          className="bg-[#111111] border border-cyan-400 px-4 py-2 text-cyan-400 text-base rounded-md shadow-md hover:bg-[#1c1c2e] focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300 font-orbitron"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {/* Optional: remove this if "Action" is always default */}
          {/* <option value="">Select a category</option> */}
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-lg text-gray-300">Loading animes...</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
          {animes.map((anime) => (
            <AnimeCard key={anime.anime_id} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;


// import React, { useEffect, useState } from 'react';
// import { animeApi } from '../services/api';
// import AnimeCard from '../components/AnimeCard';
// import '../styles/CategoryPage.css';

// const CategoryPage = () => {
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [animes, setAnimes] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     async function fetchCategories() {
//       try {
//         const res = await animeApi.getCategories(); // Ensure api returns { categories: [...] }
//         setCategories(res.data.categories);
//       } catch (err) {
//         console.error('Failed to fetch categories:', err);
//       }
//     }
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (!selectedCategory) return;
//     setLoading(true);
//     async function fetchAnimeByCategory() {
//       try {
//         const res = await animeApi.getAnimeByCategory(selectedCategory);
//         setAnimes(res.data.animes);
//       } catch (err) {
//         console.error('Failed to fetch animes by category:', err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchAnimeByCategory();
//   }, [selectedCategory]);

//   return (
//     <div className="category-container">
//       <h1 className="home-title">Browse by Category</h1>

//       <div className="category-dropdown-wrapper">
//         <select
//           className="category-dropdown"
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//         >
//           <option value="">Select a category</option>
//           {categories.map((category) => (
//             <option key={category} value={category}>
//               {category}
//             </option>
//           ))}
//         </select>
//       </div>

//       {loading ? (
//         <p className="center-text">Loading animes...</p>
//       ) : (
//         <div className="anime-grid">
//           {animes.map((anime) => (
//             <AnimeCard key={anime.anime_id} anime={anime} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CategoryPage;
