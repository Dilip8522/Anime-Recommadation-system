import React, { useEffect, useState } from 'react'; 
import { animeApi } from '../services/api';
import AnimeCard from '../components/AnimeCard';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const res = await animeApi.getWishlist();
        setWishlist(res.data.wishlist || []);

        const animeDetailsPromises = res.data.wishlist.map((item) =>
          animeApi.getAnimeDetails(item.anime_id).then((res) => res.data)
        );

        const animeDetails = await Promise.all(animeDetailsPromises);
        setAnimes(animeDetails.map((item) => item.details));
      } catch (err) {
        console.error('Failed to load wishlist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-lg text-gray-300 bg-[#0f0f1a] min-h-screen flex items-center justify-center">
        Loading wishlist...
      </p>
    );
  }

  if (!animes.length) {
    return (
      <p className="text-center text-lg text-gray-300 bg-[#0f0f1a] min-h-screen flex items-center justify-center">
        Your wishlist is empty.
      </p>
    );
  }

  return (
    <div className="bg-[#0f0f1a] min-h-screen px-6 py-10 text-white font-orbitron">
      <h1 className="text-3xl text-center mb-10 text-[#00ffff] drop-shadow-[0_0_10px_#00ffff]">
        My Wishlist
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {animes.map((anime) => (
          <AnimeCard key={anime.anime_id} anime={anime} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;


// import React, { useEffect, useState } from 'react';
// import { animeApi } from '../services/api';
// import AnimeCard from '../components/AnimeCard';
// import '../styles/WishlistPage.css';

// const WishlistPage = () => {
//   const [wishlist, setWishlist] = useState([]);
//   const [animes, setAnimes] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       setLoading(true);
//       try {
//         // 1. Get wishlist (contains anime_id and email)
//         const res = await animeApi.getWishlist();
//         setWishlist(res.data.wishlist || []);

//         // 2. Fetch details for each anime_id in wishlist
//         const animeDetailsPromises = res.data.wishlist.map((item) =>
//           animeApi.getAnimeDetails(item.anime_id).then((res) => res.data)
//         );

//         // const animeDetails = await Promise.all(animeDetailsPromises);
//         // setAnimes(animeDetails);
//         const animeDetails = await Promise.all(animeDetailsPromises);
//         setAnimes(animeDetails.map((item) => item.details));  // <-- FIX HERE

//       } catch (err) {
//         console.error('Failed to load wishlist:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWishlist();
//   }, []);

//   if (loading) return <p className="center-text">Loading wishlist...</p>;

//   if (!animes.length) return <p className="center-text">Your wishlist is empty.</p>;

//   return (
//     <div className="wishlist-container">
//       <h1 className="page-title">My Wishlist</h1>
//       <div className="anime-grid">
//         {animes.map((anime) => (
//           <AnimeCard key={anime.anime_id} anime={anime} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default WishlistPage;
