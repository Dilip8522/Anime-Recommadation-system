import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const suggestionsRef = useRef(null);

  const sampleSuggestions = ['Naruto', 'Attack on Titan', 'One Piece', 'Death Note', 'Demon Slayer', 'Jujutsu Kaisen'];

  // Filter suggestions (simulate API)
  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
    } else {
      const filtered = sampleSuggestions.filter((anime) =>
        anime.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    }
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        setQuery(suggestions[activeIndex]);
        onSearch(suggestions[activeIndex]);
        setSuggestions([]);
        setActiveIndex(-1);
      }
    }
  };

  return (
    <div className="relative flex justify-center my-8 px-4 z-10">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md border-2 border-cyan-400 rounded-xl overflow-hidden bg-[#1a1a2e] shadow-lg"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search anime..."
          className="w-full px-4 py-2 text-white bg-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setActiveIndex(-1);
            }}
            className="flex items-center px-2 text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        )}

        <button
          type="submit"
          className="flex items-center gap-1 bg-cyan-400 text-[#0f0f1a] font-semibold px-4 py-2 hover:bg-cyan-300 transition"
        >
          Search
          <Search size={18} strokeWidth={2.5} />
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul
          ref={suggestionsRef}
          className="absolute top-full mt-1 w-full max-w-md bg-[#1a1a2e] border border-cyan-400 rounded-lg shadow-lg z-50"
        >
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                setQuery(item);
                onSearch(item);
                setSuggestions([]);
                setActiveIndex(-1);
              }}
              className={`px-4 py-2 cursor-pointer ${
                index === activeIndex
                  ? 'bg-cyan-400 text-[#0f0f1a]'
                  : 'text-white hover:bg-cyan-300 hover:text-[#0f0f1a]'
              }`}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


// import { useState } from 'react';
// import '../styles/SearchBar.css';

// export default function SearchBar({ onSearch }) {
//   const [query, setQuery] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSearch(query);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="search-form">
//       <div className="search-bar-container">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search anime..."
//           className="search-input"
//         />
//         <button type="submit" className="search-button">
//           Search
//         </button>
//       </div>
//     </form>
//   );
// }