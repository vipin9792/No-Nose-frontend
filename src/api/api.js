const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const REQUEST_TIMEOUT = 15000; // 15 seconds timeout

// Helper function to handle API calls with timeout
const apiCall = async (endpoint, options = {}) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server took too long to respond');
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (email, password) => 
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email, password) => 
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// Posts API
export const postsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/posts?${queryString}`);
  },

  getById: (id) => 
    apiCall(`/posts/${id}`),

  create: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Something went wrong');
    }

    return await response.json();
  },

  update: async (id, formData) => {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Something went wrong');
    }

    return await response.json();
  },

  delete: (id) => 
    apiCall(`/posts/${id}`, { method: 'DELETE' }),
};

// Section-based APIs (custom fetch per section)
export const sectionAPI = {
  getHero: () => apiCall('/posts/hero'),
  getTrending: () => apiCall('/posts/trending'),
  getEntertainment: () => apiCall('/posts/category/entertainment'),
  getLifestyle: () => apiCall('/posts/category/lifestyle'),
  getExperience: () => apiCall('/posts/category/experience'),
  getHumanStory: () => apiCall('/posts/category/humanStory'),
  getTech: () => apiCall('/posts/category/tech'),
  getDocumentary: () => apiCall('/posts/category/documentary'),
};

// Social Media API
export const socialAPI = {
  getSocialMedia: () => 
    apiCall('/social')
      .catch(() => {
        // Fallback to default data if API fails
        return [
          { icon: 'Instagram', color: "#E1306C", name: "Instagram", handle: "@kaivailayam" },
          { icon: 'Twitter', color: "#1DA1F2", name: "Twitter", handle: "@kaivailayam" },
          { icon: 'Facebook', color: "#4267B2", name: "Facebook", handle: "kaivailayam" },
          { icon: 'Youtube', color: "#FF0000", name: "YouTube", handle: "@kaivailayam" }
        ];
      }),
};

export default { authAPI, postsAPI, sectionAPI, socialAPI };

