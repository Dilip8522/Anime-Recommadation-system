const API_TIMEOUT = 5000; // 5 seconds
const BACKEND_URL = 'http://localhost:8000'; // Adjust if deployed

export const searchAnimeOnMAL = async (query) => {
  const url = `${BACKEND_URL}/search-anime?q=${encodeURIComponent(query)}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Flask API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data?.id ? data : null;
  } catch (err) {
    console.error('Flask MAL fetch error:', err);
    return null;
  }
};
