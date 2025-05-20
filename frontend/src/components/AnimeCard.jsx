import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import { searchAnimeOnMAL } from "../services/myanimelist";

const AnimeCard = ({ anime }) => {
  const navigate = useNavigate();
  const [malUrl, setMalUrl] = useState(null);

  const handleViewDetails = () => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
    } else {
      navigate(`/anime/${anime.anime_id}`, { state: { anime } });
    }
  };

  const handleViewOnMAL = async () => {
    if (malUrl) {
      window.open(malUrl, "_blank");
      return;
    }

    const malAnime = await searchAnimeOnMAL(anime["English name"] || anime.Name);
    if (malAnime && malAnime.id) {
      const url = `https://myanimelist.net/anime/${malAnime.id}`;
      setMalUrl(url);
      window.open(url, "_blank");
    } else {
      alert("Anime not found on MyAnimeList");
    }
  };

  return (
    <div
      className="w-[220px] flex flex-col bg-[#1a1a2e] rounded-lg overflow-hidden shadow-[0_0_10px_rgba(0,255,255,0.15)] hover:scale-[1.03] hover:shadow-[0_0_15px_#00ffff] transition-transform duration-300 cursor-pointer"
    >
      <img
        src={anime["Image URL"] || "https://via.placeholder.com/300x400"}
        alt={
          anime["English name"] && anime["English name"] !== "UNKNOWN"
            ? anime["English name"]
            : anime.Name
        }
        className="w-full h-[300px] object-cover"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300x400";
        }}
      />
      <div className="p-4 text-white">
        <div className="text-[1rem] font-semibold mb-2 text-cyan-300 truncate" style={{ textShadow: "0 0 4px #00ffff" }}>
          {anime["English name"] && anime["English name"] !== "UNKNOWN"
            ? anime["English name"]
            : anime.Name}
        </div>
        <p className="text-sm text-gray-400 leading-tight max-h-[2.4em] overflow-hidden text-ellipsis">
          {anime.Synopsis
            ? `${anime.Synopsis.substring(0, 150)}...`
            : "No synopsis available"}
        </p>
        <div className="flex justify-between gap-2 mt-4">
          <button
            className="mt-3 px-3 py-1.5 text-sm font-medium text-cyan-300 border border-cyan-300 rounded hover:bg-cyan-300 hover:text-[#1a1a2e] hover:shadow-[0_0_8px_#00ffff] transition-all"
            style={{ textShadow: "0 0 4px #00ffff" }}
            onClick={handleViewDetails}
          >
            View Details
          </button>
          {/* Uncomment below to enable MAL button */}
          {/* 
          <button
            className="mt-3 px-3 py-1.5 text-sm font-medium text-cyan-300 border border-cyan-300 rounded hover:bg-cyan-300 hover:text-[#1a1a2e] hover:shadow-[0_0_8px_#00ffff] transition-all"
            style={{ textShadow: "0 0 4px #00ffff" }}
            onClick={handleViewOnMAL}
          >
            View on MAL
          </button> 
          */}
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;


// //-----------------this is my animedetaails page ---------------------
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/AnimeCard.css";
// import { authService } from "../services/auth";
// import { searchAnimeOnMAL } from "../services/myanimelist";

// const AnimeCard = ({ anime }) => {
//   const navigate = useNavigate();
//   const [malUrl, setMalUrl] = useState(null);

//   const handleViewDetails = () => {
//     if (!authService.isAuthenticated()) {
//       navigate("/login");
//     } else {
//       navigate(`/anime/${anime.anime_id}`, { state: { anime } });
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

//   return (
//     <div className="anime-card">
//       <img
//         src={anime["Image URL"] || "https://via.placeholder.com/300x400"}
//         alt={
//           anime["English name"] && anime["English name"] !== "UNKNOWN"
//             ? anime["English name"]
//             : anime.Name
//         }
//         onError={(e) => {
//           e.target.src = "https://via.placeholder.com/300x400";
//         }}
//       />
//       <div className="anime-card-content">
//         <div className="anime-titles">
//           {anime["English name"] && anime["English name"] !== "UNKNOWN"
//             ? anime["English name"]
//             : anime.Name}
//         </div>
//         <p className="anime-synopsis-card">
//           {anime.Synopsis
//             ? `${anime.Synopsis.substring(0, 150)}...`
//             : "No synopsis available"}
//         </p>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             gap: "10px",
//             marginTop: "10px",
//           }}
//         >
//           <button className="view-details-btn" onClick={handleViewDetails}>
//             View Details
//           </button>
//           {/* <button className="view-details-btn" onClick={handleViewOnMAL}>
//             View on MAL
//           </button> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnimeCard;