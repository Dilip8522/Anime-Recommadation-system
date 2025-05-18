import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { animeApi } from '../services/api';
import AnimeCard from '../components/AnimeCard';
import '../styles/AnimeDetails.css';

const AnimeDetails = () => {
  const { state } = useLocation();
  const anime = state?.anime;
  const token = localStorage.getItem('token');

  const [rating, setRating] = useState(0);
  const [liked, setLiked] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [related, setRelated] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [errorRelated, setErrorRelated] = useState(null);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const handleRatingChange = (e) => {
    if (ratingSubmitted) return;
    setRating(Number(e.target.value));
  };

  const submitRating = async () => {
    if (!token || rating === 0 || ratingSubmitted) return;
    setSubmittingRating(true);
    try {
      await animeApi.submitRating(anime.anime_id, rating);
      setRatingSubmitted(true);
    } catch (error) {
      console.error('Rating error:', error);
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleLike = async () => {
    if (!token) return;
    try {
      const response = await animeApi.toggleLike(anime.anime_id);
      setLiked(response.data.liked);
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleWishlist = async () => {
    if (!token) return;
    try {
      const response = await animeApi.toggleWishlist(anime.anime_id);
      setInWishlist(response.data.in_wishlist);
    } catch (error) {
      console.error('Wishlist error:', error);
    }
  };

  useEffect(() => {
    const fetchInitialStates = async () => {
      if (!token || !anime?.anime_id) return;
      try {
        const likeRes = await animeApi.checkLikeStatus(anime.anime_id);
        setLiked(likeRes.data.liked);

        const wishlistRes = await animeApi.getWishlistStatus(anime.anime_id);
        setInWishlist(wishlistRes.data.in_wishlist);
      } catch (error) {
        console.error('Init fetch error:', error);
      }
    };
    fetchInitialStates();
  }, [token, anime]);

  useEffect(() => {
    const fetchRelatedAnime = async () => {
      if (!anime?.anime_id) return;

      setLoadingRelated(true);
      setErrorRelated(null);

      try {
        const response = await animeApi.getContentBasedRecommadation(anime.anime_id);
        setRelated(response.data?.recommendations?.slice(0, 20) || []);
      } catch (error) {
        console.error('Related fetch error:', error);
        setErrorRelated('Could not load related anime. Please try again later.');
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedAnime();
  }, [anime]);

  if (!anime) return <div className="text-center mt-8">Anime not found.</div>;

  return (
    <div className="anime-details-container">
      <div className = "anime-image-fix">
        <img
          src={anime['Image URL'] || 'https://via.placeholder.com/400x600'}
          alt={anime['English name'] || anime.Name}
          className="anime-image"
        />
        <div className="flex-container">
          <h2 className="anime-title">{anime['English name'] || anime.Name}</h2>

          {token && (
            <div className="rating-section">
              <label className="rating-label">Rate this Anime (1–10):</label>
              <select
                value={rating}
                onChange={handleRatingChange}
                disabled={ratingSubmitted}
                className="rating-select"
              >
                <option value={0}>Select</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                <button
                  onClick={submitRating}
                  disabled={rating === 0 || submittingRating || ratingSubmitted}
                  style={{
                    backgroundColor: rating === 0 || ratingSubmitted ? '#a1a1aa' : '#4f46e5',
                    color: 'white',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: submittingRating ? 0.7 : 1,
                  }}
                >
                  {ratingSubmitted ? 'Submitted' : submittingRating ? 'Submitting...' : 'Submit Rating'}
                </button>
                <button
                  onClick={handleLike}
                  style={{
                    backgroundColor: liked ? '#ef4444' : '#e5e7eb',
                    color: liked ? 'white' : '#111827',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {liked ? '❤️ Liked' : '🤍 Like'}
                </button>

                <button
                  onClick={handleWishlist}
                  style={{
                    backgroundColor: inWishlist ? '#10b981' : '#d1fae5',
                    color: inWishlist ? 'white' : '#065f46',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {inWishlist ? '📺 Remove from Wishlist' : '➕ Add to Wishlist'}
                </button>
              </div>
            </div>
          )}

          <p className="anime-synopsis">{anime.Synopsis || 'No synopsis available.'}</p>
        </div>
      </div>
      <section className="mt-12">
          <h3 className="text-2xl font-semibold mb-4">You May Also Like</h3>

          {loadingRelated && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Loading recommendations...</p>
            </div>
          )}

          {errorRelated && (
            <div className="text-center py-4">
              <p className="text-red-500">{errorRelated}</p>
              {/* <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Try Again
              </button> */}
            </div>
          )}

          {!loadingRelated && !errorRelated && related.length === 0 && (
            <div className="text-center py-4">
              <p>No related anime found.</p>
            </div>
          )}

          {!loadingRelated && !errorRelated && related.length > 0 && (
            <div className="anime-grid-details">
              {related.map((a) => (
                <AnimeCard key={a.anime_id} anime={a} />
              ))}
            </div>
          )}
        </section>
    </div>
  );
};

export default AnimeDetails;


// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { animeApi } from '../services/api';
// import AnimeCard from '../components/AnimeCard';
// import '../styles/AnimeDetails.css';

// const AnimeDetails = () => {
//   const { state } = useLocation();
//   const anime = state?.anime;
//   const token = localStorage.getItem('token');

//   const [rating, setRating] = useState(0);
//   const [liked, setLiked] = useState(false);
//   const [inWishlist, setInWishlist] = useState(false);
//   const [related, setRelated] = useState([]);
//   const [loadingRelated, setLoadingRelated] = useState(false);
//   const [errorRelated, setErrorRelated] = useState(null);
//   const [submittingRating, setSubmittingRating] = useState(false);
//   const [ratingSubmitted, setRatingSubmitted] = useState(false);

//   const handleRatingChange = (e) => {
//     if (ratingSubmitted) return;
//     setRating(Number(e.target.value));
//   };

//   const submitRating = async () => {
//     if (!token || rating === 0 || ratingSubmitted) return;
//     setSubmittingRating(true);
//     try {
//       await animeApi.submitRating(anime.anime_id, rating, token);
//       setRatingSubmitted(true);
//     } catch (error) {
//       console.error('Rating error:', error);
//     } finally {
//       setSubmittingRating(false);
//     }
//   };

//   const handleLike = async () => {
//     if (!token) return;
//     try {
//       const likedStatus = await animeApi.toggleLike(anime.anime_id, token);
//       setLiked(likedStatus);
//     } catch (error) {
//       console.error('Like error:', error);
//     }
//   };

//   const handleWishlist = async () => {
//     if (!token) return;
//     try {
//       const result = await animeApi.toggleWishlist(anime.anime_id, token);
//       setInWishlist(result.data.in_wishlist);
//     } catch (error) {
//       console.error('Wishlist error:', error);
//     }
//   };

//   useEffect(() => {
//     const fetchInitialStates = async () => {
//       if (!token || !anime?.anime_id) return;
//       try {
//         const likeRes = await animeApi.checkLikeStatus(anime.anime_id, token);
//         setLiked(likeRes);

//         const wishlistRes = await animeApi.getWishlistStatus(anime.anime_id, token);
//         setInWishlist(wishlistRes.data.in_wishlist);
//       } catch (error) {
//         console.error('Init fetch error:', error);
//       }
//     };
//     fetchInitialStates();
//   }, [token, anime]);

//   useEffect(() => {
//     const fetchRelatedAnime = async () => {
//       if (!anime?.anime_id) return;

//       setLoadingRelated(true);
//       setErrorRelated(null);

//       try {
//         const response = await animeApi.getContentBasedRecommadation(anime.anime_id);
//         if (response.data?.recommendations) {
//           setRelated(response.data.recommendations.slice(0, 20));
//         } else {
//           setRelated([]);
//         }
//       } catch (error) {
//         console.error('Related fetch error:', error);
//         setErrorRelated('Could not load related anime. Please try again later.');
//       } finally {
//         setLoadingRelated(false);
//       }
//     };

//     fetchRelatedAnime();
//   }, [anime]);

//   if (!anime) return <div className="text-center mt-8">Anime not found.</div>;

//   return (
//     <div className="anime-details-container">
//       <img
//         src={anime['Image URL'] || 'https://via.placeholder.com/400x600'}
//         alt={anime['English name'] || anime.Name}
//         className="anime-image"
//       />
//       <div className="flex-container">
//         <h2 className="anime-title">{anime['English name'] || anime.Name}</h2>
//         {token && (
//           <div className="rating-section">
//             <label className="rating-label">Rate this Anime (1–10):</label>
//             <select
//               value={rating}
//               onChange={handleRatingChange}
//               disabled={ratingSubmitted}
//               className="rating-select"
//             >
//               <option value={0}>Select</option>
//               {[...Array(10)].map((_, i) => (
//                 <option key={i + 1} value={i + 1}>{i + 1}</option>
//               ))}
//             </select>
//             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
//               <button
//                 onClick={submitRating}
//                 disabled={rating === 0 || submittingRating || ratingSubmitted}
//                 style={{
//                   backgroundColor: rating === 0 || ratingSubmitted ? '#a1a1aa' : '#4f46e5',
//                   color: 'white',
//                   borderRadius: '6px',
//                   padding: '8px 12px',
//                   border: 'none',
//                   cursor: rating === 0 || ratingSubmitted ? 'not-allowed' : 'pointer',
//                   opacity: submittingRating ? 0.7 : 1,
//                 }}
//               >
//                 {ratingSubmitted ? 'Submitted' : submittingRating ? 'Submitting...' : 'Submit Rating'}
//               </button>

//               <button
//                 onClick={handleLike}
//                 style={{
//                   backgroundColor: liked ? '#ef4444' : '#e5e7eb',
//                   color: liked ? 'white' : '#111827',
//                   borderRadius: '6px',
//                   padding: '8px 12px',
//                   border: 'none',
//                   cursor: 'pointer',
//                   transition: 'background-color 0.3s',
//                 }}
//               >
//                 {liked ? '❤️ Liked' : '🤍 Like'}
//               </button>

//               <button
//                 onClick={handleWishlist}
//                 style={{
//                   backgroundColor: inWishlist ? '#10b981' : '#d1fae5',
//                   color: inWishlist ? 'white' : '#065f46',
//                   borderRadius: '6px',
//                   padding: '8px 12px',
//                   border: 'none',
//                   cursor: 'pointer',
//                   transition: 'background-color 0.3s',
//                 }}
//               >
//                 {inWishlist ? '📺 Remove from Wishlist' : '➕ Add to Wishlist'}
//               </button>
//             </div>
//           </div>
//         )}

//         <p className="anime-synopsis">
//           {anime.Synopsis || 'No synopsis available.'}
//         </p>

//         <section className="mt-12">
//           <h3 className="text-2xl font-semibold mb-4">You May Also Like</h3>

//           {loadingRelated && (
//             <div className="text-center py-4">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
//               <p className="mt-2">Loading recommendations...</p>
//             </div>
//           )}

//           {errorRelated && (
//             <div className="text-center py-4">
//               <p className="text-red-500">{errorRelated}</p>
//               <button
//                 onClick={() => window.location.reload()}
//                 className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Try Again
//               </button>
//             </div>
//           )}

//           {!loadingRelated && !errorRelated && related.length === 0 && (
//             <div className="text-center py-4">
//               <p>No related anime found.</p>
//             </div>
//           )}

//           {!loadingRelated && !errorRelated && related.length > 0 && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {related.map((a) => (
//                 <AnimeCard key={a.anime_id} anime={a} />
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// };

// export default AnimeDetails;