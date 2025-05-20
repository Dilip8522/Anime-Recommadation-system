import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token (stored in localStorage as `token`) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

// -------------------------------------------------------------
// Anime‑related endpoints
// -------------------------------------------------------------
export const animeApi = {
  // ---- Catalog / discovery ----
  getAllAnimes: (skip = 0) => api.get(`/animes?skip=${skip}&limit=20`),
  getPersonalizedAnimes: () => api.get('/anime/personalized-recommendations'),
  getContentBasedRecommadation: (anime_id, age = 18) =>
    api.get('/anime/content-based-recommendations', { params: { anime_id, age } }),
  searchAnimes: (query) => api.get('/search', { params: { query } }),

  // ---- Rating ----
  submitRating: (anime_id, rating) => api.post('/submit-rating', { anime_id, rating }),

  // ---- Likes ----
  checkLikeStatus: (anime_id) =>
    api.get('/is-anime-liked', { params: { anime_id } }),
  toggleLike: (anime_id) => api.post('/toggle-like', { anime_id }),

  // ---- Wishlist ----
  getWishlist: () => api.get('/get-wishlist'),
  toggleWishlist: (anime_id) => api.post('/toggle-wishlist', { anime_id }),
  getWishlistStatus: (anime_id) =>
    api.get('/is-in-wishlist', { params: { anime_id } }),

  // ---- Related / details ----
  getRelated: (anime_id, age) =>
    api.get('/anime/content-based-recommendations', { params: { anime_id, age } }),
  getAnimeDetails: (anime_id) =>
    api.get('/anime/details', { params: { anime_id } }),

  // ---- Categories ----
  getCategories: () => api.get('/get-categories'),
  getAnimeByCategory: (category, limit = 50, offset = 0) =>
    api.get('/get-anime-by-category', {
      params: { category, limit, offset }
    }),
  getPopularCategories: () => api.get('/get-popular-categories'),

  // ---- User Profile & Genre Data ----
  getProfile: () => api.get('/get-user-profile'),
  getUserGenreData: (email) => api.post('/api/user/genre-data', { email })
};

// -------------------------------------------------------------
// Auth endpoints
// -------------------------------------------------------------
export const authApi = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/signup', userData)
};

// -------------------------------------------------------------
// User profile endpoints
// -------------------------------------------------------------
export const userApi = {
  getProfile: () => api.get('/get-user-profile'),
  updateProfile: (data) => api.post('/update-user-profile', data)
};


// import axios from 'axios';

// const API_URL = 'http://localhost:8000';

// // Axios instance
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Attach JWT token (stored in localStorage as `token`) to every request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     // Backend expects the raw token in the Authorization header
//     config.headers.Authorization = `${token}`;
//   }
//   return config;
// });

// // -------------------------------------------------------------
// // Anime‑related endpoints
// // -------------------------------------------------------------
// export const animeApi = {
//   // ---- Catalog / discovery ----
//   getAllAnimes: (skip = 0) => api.get(`/animes?skip=${skip}&limit=20`),
//   getPersonalizedAnimes: () => api.get('/anime/personalized-recommendations'),
//   getContentBasedRecommadation: (anime_id, age = 18) =>
//     api.get('/anime/content-based-recommendations', { params: { anime_id, age } }),
//   searchAnimes: (query) => api.get('/search', { params: { query } }),

//   // ---- Rating ----
//   submitRating: (anime_id, rating) =>
//     api.post('/submit-rating', { anime_id, rating }),

//   // ---- Click / engagement ----
//   // trackClick: (anime_id) => api.post('/track-click', { anime_id }),

//   // ---- Likes ----
//   checkLikeStatus: (anime_id) =>
//     api.get('/is-anime-liked', { params: { anime_id } }),
//   toggleLike: (anime_id) =>
//     api.post('/toggle-like', { anime_id }),

//   // ---- Wishlist ----
//   getWishlist: () => api.get('/get-wishlist'),
//   toggleWishlist: (anime_id) => api.post('/toggle-wishlist', { anime_id }),
//   getWishlistStatus: (anime_id) =>
//     api.get('/is-in-wishlist', { params: { anime_id } }),

// // ---- Related / details ----
//   getRelated: (anime_id, age) =>
//     api.get('/anime/content-based-recommendations', { params: { anime_id, age } }),
//   getAnimeDetails: (anime_id) =>
//     api.get('/anime/details', { params: { anime_id } }),

//   // ---- Categories ----
//   getCategories: () => api.get('/get-categories'),
//   getAnimeByCategory: (category, limit = 50, offset = 0) =>
//     api.get('/get-anime-by-category', {
//       params: { category, limit, offset }
//     }),
//   getPopularCategories: () => api.get('/get-popular-categories'),
//   getProfile: () => api.get('/get-user-profile'),
//   getUserGenreData: (email, token) =>
//     axios.post(
//       `${API_URL}/user/genre-data`,
//       { email },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     )
// };

// // -------------------------------------------------------------
// // Auth endpoints
// // -------------------------------------------------------------
// export const authApi = {
//   login: (credentials) => api.post('/login', credentials),
//   register: (userData) => api.post('/signup', userData)
// };

// // -------------------------------------------------------------
// // User profile endpoints
// // -------------------------------------------------------------
// export const userApi = {
//   getProfile: (email) => api.get('/get-user-profile', { params: { email } }),
//   updateProfile: (data) => api.post('/update-user-profile', data)
// };
// export const getWishlist = (token) => {
//   return api.get('/get-wishlist', {
//     headers: {
//       Authorization: `${token}`,
//     },
//   });
// };