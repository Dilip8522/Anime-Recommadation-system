import { useState, useEffect, useCallback } from 'react';
import { animeApi } from '../services/api';
import AnimeCard from '../components/AnimeCard';
import SearchBar from '../components/SearchBar';

export default function Home() {
  const [animes, setAnimes] = useState([]);
  const [personalizedAnimes, setPersonalizedAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const fetchAnimes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await animeApi.getAllAnimes(page * 20);
      setAnimes(response.data.animes);

      if (isLoggedIn) {
        const personalizedResponse = await animeApi.getPersonalizedAnimes();
        const recs = personalizedResponse.data.recommendations || [];
        setPersonalizedAnimes(recs);
      } else {
        setPersonalizedAnimes([]);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching animes:', err);
      setLoading(false);
    }
  }, [page, isLoggedIn]);

  useEffect(() => {
    fetchAnimes();
  }, [fetchAnimes]);

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      const response = await animeApi.searchAnimes(query);
      setAnimes(response.data.animes);
      setLoading(false);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed');
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f0f1a] min-h-screen p-8 text-white">
      <h1 className="text-4xl text-center font-bold text-cyan-300 font-orbitron drop-shadow-[0_0_10px_#00ffff] mb-6">
        Discover Anime
      </h1>

      <SearchBar onSearch={handleSearch} />

      {loading && <div className="text-center text-lg mt-4">Loading...</div>}
      {error && <div className="text-center text-lg text-red-500 mt-4">{error}</div>}

      {/* Personalized Recommendations (only show if user is logged in and has recommendations) */}
      {isLoggedIn && personalizedAnimes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Your Personalized Recommendations</h2>
          <div className="flex overflow-x-auto gap-10 py-2 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
            {personalizedAnimes.map((anime) => (
              <div key={anime.anime_id} className="flex-shrink-0 w-[200px]">
                <AnimeCard anime={anime} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Public Anime List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Public Anime List</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mt-4">
          {animes.map((anime) => (
            <AnimeCard key={anime.anime_id} anime={anime} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="bg-cyan-300 text-[#0f0f1a] px-4 py-2 rounded hover:bg-cyan-400 hover:shadow-[0_0_10px_#00ffff] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="bg-cyan-300 text-[#0f0f1a] px-4 py-2 rounded hover:bg-cyan-400 hover:shadow-[0_0_10px_#00ffff] transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}



// import { useState, useEffect, useCallback } from 'react';
// import { animeApi } from '../services/api';
// import AnimeCard from '../components/AnimeCard';
// import SearchBar from '../components/SearchBar';
// import '../styles/Home.css';

// export default function Home() {
//   const [animes, setAnimes] = useState([]);
//   const [personalizedAnimes, setPersonalizedAnimes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(0);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Check login status
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     setIsLoggedIn(!!token);
//   }, []);

//   // Fetch public anime list and personalized recommendations
//   const fetchAnimes = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Fetch public animes
//       const response = await animeApi.getAllAnimes(page * 20);
//       setAnimes(response.data.animes);

//       // Fetch personalized only if logged in
//       if (isLoggedIn) {
//         const personalizedResponse = await animeApi.getPersonalizedAnimes();
//         setPersonalizedAnimes(personalizedResponse.data.recommendations || []);
//       } else {
//         setPersonalizedAnimes([]); // Clear if logged out
//       }

//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching animes:', err);
//       setLoading(false);
//     }
//   }, [page, isLoggedIn]);

//   useEffect(() => {
//     fetchAnimes();
//   }, [fetchAnimes]);

//   // Handle search
//   const handleSearch = async (query) => {
//     try {
//       setLoading(true);
//       const response = await animeApi.searchAnimes(query);
//       setAnimes(response.data.animes);
//       setLoading(false);
//     } catch (err) {
//       console.error('Search error:', err);
//       setError('Search failed');
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="home-container">
//       <h1 className="home-title">Discover Anime</h1>
//       <SearchBar onSearch={handleSearch} />

//       {loading && <div className="center-text">Loading...</div>}
//       {error && <div className="center-text error-text">{error}</div>}

//       {/* Personalized Anime Recommendations - Horizontal Scroll */}
//       <div className="anime-section">
//         <h2>Your Personalized Recommendations</h2>
//         <div className="anime-scroll">
//           {!isLoggedIn ? (
//             <p>Login to get personalized Animes.</p>
//           ) : personalizedAnimes.length === 0 ? (
//             <p>Search for your favorite animes to get recommendations.</p>
//           ) : (
//             personalizedAnimes.map((anime) => (
//               <AnimeCard key={anime.anime_id} anime={anime} />
//             ))
//           )}
//         </div>
//       </div>

//       {/* Public Anime List - Vertical Grid */}
//       <div className="anime-section">
//         <h2>Public Anime List</h2>
//         <div className="anime-grid">
//           {animes.map((anime) => (
//             <AnimeCard key={anime.anime_id} anime={anime} />
//           ))}
//         </div>
//       </div>

//       {/* Pagination */}
//       <div className="pagination">
//         <button
//           onClick={() => setPage((p) => Math.max(0, p - 1))}
//           disabled={page === 0}
//           className="page-button"
//         >
//           Previous
//         </button>
//         <button
//           onClick={() => setPage((p) => p + 1)}
//           className="page-button"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }