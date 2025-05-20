import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { animeApi } from "../services/api";
import AnimeCard from "../components/AnimeCard";
import { searchAnimeOnMAL } from "../services/myanimelist";

const AnimeDetails = () => {
  const { state } = useLocation();
  const anime = state?.anime;
  const token = localStorage.getItem("token");

  const [malUrl, setMalUrl] = useState(null);
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
      console.error("Rating error:", error);
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
      console.error("Like error:", error);
    }
  };

  const handleWishlist = async () => {
    if (!token) return;
    try {
      const response = await animeApi.toggleWishlist(anime.anime_id);
      setInWishlist(response.data.in_wishlist);
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  const handleViewOnMAL = async () => {
    if (malUrl) {
      window.open(malUrl, "_blank");
      return;
    }

    const malAnime = await searchAnimeOnMAL(anime["English name"] || anime.Name);
    if (malAnime?.id) {
      const url = `https://myanimelist.net/anime/${malAnime.id}`;
      setMalUrl(url);
      window.open(url, "_blank");
    } else {
      alert("Anime not found on MyAnimeList");
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
        console.error("Init fetch error:", error);
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
        console.error("Related fetch error:", error);
        setErrorRelated("Could not load related anime. Please try again later.");
      } finally {
        setLoadingRelated(false);
      }
    };
    fetchRelatedAnime();
  }, [anime]);

  if (!anime) return <div className="text-center mt-8">Anime not found.</div>;

  return (
    <div className="bg-[#0f0f1a] text-white min-h-screen p-8 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div>
          <img
            src={anime["Image URL"] || "https://via.placeholder.com/400x600"}
            alt={anime["English name"] !== "UNKNOWN" ? anime["English name"] : anime.Name}
            className="w-full max-w-xs rounded-xl shadow-lg"
          />

          {token && (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <button
                onClick={handleLike}
                className={`px-4 py-2 font-semibold rounded-md transition-all ${
                  liked
                    ? "bg-green-500 text-white"
                    : "bg-cyan-400 text-black hover:bg-cyan-500"
                }`}
              >
                {liked ? "❤️ Liked" : "🤍 Like"}
              </button>

              <button
                onClick={handleWishlist}
                className={`px-4 py-2 font-semibold rounded-md transition-all ${
                  inWishlist
                    ? "bg-emerald-500 text-white"
                    : "bg-green-100 text-green-900 hover:bg-green-200"
                }`}
              >
                {inWishlist ? "📺 Remove from Wishlist" : "➕ Add to Wishlist"}
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-4 max-w-2xl">
          <h2 className="text-4xl font-bold text-cyan-400 drop-shadow-md font-orbitron">
            {anime["English name"] !== "UNKNOWN" ? anime["English name"] : anime.Name}
          </h2>

          <p className="text-gray-300 text-lg">Genres: {anime.Genres || "N/A"}</p>
          <p className="text-gray-300 text-lg">Source: {anime.Source || "N/A"}</p>
          <p className="text-gray-300 text-lg">Licensors: {anime.Licensors || "N/A"}</p>

          {token && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <label className="font-medium">Rate this Anime (1–10):</label>
              <select
                value={rating}
                onChange={handleRatingChange}
                disabled={ratingSubmitted}
                className="bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-1"
              >
                <option value={0}>Select</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

              <button
                onClick={submitRating}
                disabled={rating === 0 || submittingRating || ratingSubmitted}
                className={`px-4 py-2 rounded-md text-white ml-2 ${
                  rating === 0 || ratingSubmitted
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {ratingSubmitted
                  ? "Submitted"
                  : submittingRating
                  ? "Submitting..."
                  : "Submit Rating"}
              </button>
            </div>
          )}

          <p className="text-gray-200">{anime.Synopsis || "No synopsis available."}</p>

          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md w-fit"
            onClick={handleViewOnMAL}
          >
            View on MAL
          </button>
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
          </div>
        )}

        {!loadingRelated && !errorRelated && related.length === 0 && (
          <div className="text-center py-4">
            <p>No related anime found.</p>
          </div>
        )}

        {!loadingRelated && !errorRelated && related.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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


// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { animeApi } from "../services/api";
// import AnimeCard from "../components/AnimeCard";
// import "../styles/AnimeDetails.css";
// import { searchAnimeOnMAL } from "../services/myanimelist";

// const AnimeDetails = () => {
//   const { state } = useLocation();
//   const anime = state?.anime;
//   const token = localStorage.getItem("token");

//   const [malUrl, setMalUrl] = useState(null);
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
//       await animeApi.submitRating(anime.anime_id, rating);
//       setRatingSubmitted(true);
//     } catch (error) {
//       console.error("Rating error:", error);
//     } finally {
//       setSubmittingRating(false);
//     }
//   };

//   const handleLike = async () => {
//     if (!token) return;
//     try {
//       const response = await animeApi.toggleLike(anime.anime_id);
//       setLiked(response.data.liked);
//     } catch (error) {
//       console.error("Like error:", error);
//     }
//   };

//   const handleWishlist = async () => {
//     if (!token) return;
//     try {
//       const response = await animeApi.toggleWishlist(anime.anime_id);
//       setInWishlist(response.data.in_wishlist);
//     } catch (error) {
//       console.error("Wishlist error:", error);
//     }
//   };

//   const handleViewOnMAL = async () => {
//     if (malUrl) {
//       window.open(malUrl, "_blank");
//       return;
//     }

//     const malAnime = await searchAnimeOnMAL(
//       anime["English name"] || anime.Name
//     );

//     if (malAnime && malAnime.id) {
//       const url = `https://myanimelist.net/anime/${malAnime.id}`;
//       setMalUrl(url);
//       window.open(url, "_blank");
//     } else {
//       alert("Anime not found on MyAnimeList");
//     }
//   };

//   useEffect(() => {
//     const fetchInitialStates = async () => {
//       if (!token || !anime?.anime_id) return;
//       try {
//         const likeRes = await animeApi.checkLikeStatus(anime.anime_id);
//         setLiked(likeRes.data.liked);

//         const wishlistRes = await animeApi.getWishlistStatus(anime.anime_id);
//         setInWishlist(wishlistRes.data.in_wishlist);
//       } catch (error) {
//         console.error("Init fetch error:", error);
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
//         const response = await animeApi.getContentBasedRecommadation(
//           anime.anime_id
//         );
//         setRelated(response.data?.recommendations?.slice(0, 20) || []);
//       } catch (error) {
//         console.error("Related fetch error:", error);
//         setErrorRelated(
//           "Could not load related anime. Please try again later."
//         );
//       } finally {
//         setLoadingRelated(false);
//       }
//     };

//     fetchRelatedAnime();
//   }, [anime]);

//   if (!anime)
//     return <div className="text-center mt-8">Anime not found.</div>;

//   return (
//     <div className="anime-details-container">
//       <div className="anime-image-fix">
//         <div>
//           <img
//             src={anime["Image URL"] || "https://via.placeholder.com/400x600"}
//             alt={
//               anime["English name"] && anime["English name"] !== "UNKNOWN"
//                 ? anime["English name"]
//                 : anime.Name
//             }
//             className="anime-image"
//           />

//           {token && (
//             <div className="buttons-under-image">
//               <button
//                 onClick={handleLike}
//                 className={`like-button ${liked ? "liked" : ""}`}
//               >
//                 {liked ? "❤️ Liked" : "🤍 Like"}
//               </button>

//               <button
//                 onClick={handleWishlist}
//                 className={`wishlist-button ${inWishlist ? "in-wishlist" : ""}`}
//               >
//                 {inWishlist
//                   ? "📺 Remove from Wishlist"
//                   : "➕ Add to Wishlist"}
//               </button>
//             </div>
//           )}
//         </div>

//         <div className="flex-container">
//           <h2 className="anime-title">
//             {anime["English name"] && anime["English name"] !== "UNKNOWN"
//               ? anime["English name"]
//               : anime.Name}
//           </h2>
//           <p className="anime-synopsis">
//             Genres: {anime.Genres || "No synopsis available."}
//           </p>
//           <p className="anime-synopsis">
//             Source: {anime.Source || "No synopsis available."}
//           </p>
//           <p className="anime-synopsis">
//             Licensors: {anime.Licensors || "No synopsis available."}
//           </p>

//           {token && (
//             <div className="rating-section">
//               <label className="rating-label">Rate this Anime (1–10):</label>
//               <select
//                 value={rating}
//                 onChange={handleRatingChange}
//                 disabled={ratingSubmitted}
//                 className="rating-select"
//               >
//                 <option value={0}>Select</option>
//                 {[...Array(10)].map((_, i) => (
//                   <option key={i + 1} value={i + 1}>
//                     {i + 1}
//                   </option>
//                 ))}
//               </select>

//               <button
//                 onClick={submitRating}
//                 disabled={rating === 0 || submittingRating || ratingSubmitted}
//                 style={{
//                   backgroundColor:
//                     rating === 0 || ratingSubmitted ? "#a1a1aa" : "#4f46e5",
//                   color: "white",
//                   borderRadius: "6px",
//                   padding: "8px 12px",
//                   border: "none",
//                   cursor: "pointer",
//                   opacity: submittingRating ? 0.7 : 1,
//                   marginLeft: "10px",
//                 }}
//               >
//                 {ratingSubmitted
//                   ? "Submitted"
//                   : submittingRating
//                   ? "Submitting..."
//                   : "Submit Rating"}
//               </button>
//             </div>
//           )}

//           <p className="anime-synopsises">
//             {anime.Synopsis || "No synopsis available."}
//           </p>

//           <button className="view-details-btn" onClick={handleViewOnMAL}>
//             View on MAL
//           </button>
//         </div>
//       </div>

//       <section className="mt-12">
//         <h3 className="text-2xl font-semibold mb-4">You May Also Like</h3>

//         {loadingRelated && (
//           <div className="text-center py-4">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
//             <p className="mt-2">Loading recommendations...</p>
//           </div>
//         )}

//         {errorRelated && (
//           <div className="text-center py-4">
//             <p className="text-red-500">{errorRelated}</p>
//           </div>
//         )}

//         {!loadingRelated && !errorRelated && related.length === 0 && (
//           <div className="text-center py-4">
//             <p>No related anime found.</p>
//           </div>
//         )}

//         {!loadingRelated && !errorRelated && related.length > 0 && (
//           <div className="anime-grid-details">
//             {related.map((a) => (
//               <AnimeCard key={a.anime_id} anime={a} />
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };

// export default AnimeDetails;