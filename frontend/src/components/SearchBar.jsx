import { useState } from 'react';
import '../styles/SearchBar.css';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-bar-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anime..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </div>
    </form>
  );
}

// export default function SearchBar({ onSearch }) {
//   const [query, setQuery] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSearch(query);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
//       <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search anime..."
//           className="w-full px-4 py-2 text-gray-700 focus:outline-none"
//         />
//         <button
//           type="submit"
//           className="px-6 py-2 bg-blue-500 text-white font-medium hover:bg-blue-600"
//         >
//           Search
//         </button>
//       </div>
//     </form>
//   );
// } 