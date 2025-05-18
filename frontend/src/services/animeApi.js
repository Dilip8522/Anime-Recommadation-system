const animeApi = {
    // Category APIs
    getCategories: async () => {
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        return data.data;
    },

    getPopularCategories: async () => {
        const response = await fetch(`${API_BASE_URL}/api/categories/popular`);
        if (!response.ok) {
            throw new Error('Failed to fetch popular categories');
        }
        const data = await response.json();
        return data.data;
    },

    getAnimeByCategory: async (category) => {
        const response = await fetch(`${API_BASE_URL}/api/categories/${encodeURIComponent(category)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch anime by category');
        }
        const data = await response.json();
        return data.data;
    },
};

export default animeApi; 