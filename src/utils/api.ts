import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://katalisdev.space/api";
// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Create axios instance with auth header
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============ Recipe APIs ============

export const fetchRecipes = async (category: string) => {
  try {
    const response = await axios.get(`${API_BASE}/recipes/complexSearch`, {
      params: {
        query: category,
        number: 12
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};

export const searchRecipes = async (query: string, number: number = 12) => {
  try {
    const response = await axios.get(`${API_BASE}/recipes/complexSearch`, {
      params: { query, number },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error searching recipes:", error);
    throw error;
  }
};

export const fetchRecipeDetail = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE}/recipes/${id}/information`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recipe detail:", error);
    throw error;
  }
};

// ============ Auth APIs ============

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE}/auth/login`, {
    email,
    password,
  }, {
    withCredentials: false
  });
  return response.data;
};

export const register = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_BASE}/auth/register`, {
    name,
    email,
    password,
    password_confirmation: password,
  });
  return response.data;
};

export const logout = async () => {
  const response = await apiClient.post('/auth/logout');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/user');
  return response.data;
};

// ============ Favorite APIs ============

export const getFavorites = async () => {
  const response = await apiClient.get('/favorites');
  return response.data;
};

export const toggleFavorite = async (recipeId: number) => {
  const response = await apiClient.post(`/favorites/toggle/${recipeId}`);
  return response.data;
};

export const checkFavorite = async (recipeId: number) => {
  const response = await apiClient.get(`/favorites/check/${recipeId}`);
  return response.data;
};

export const addToFavorites = async (recipeId: number) => {
  const response = await apiClient.post(`/favorites/${recipeId}`);
  return response.data;
};

export const removeFromFavorites = async (recipeId: number) => {
  const response = await apiClient.delete(`/favorites/${recipeId}`);
  return response.data;
};

// ============ Diet Plan APIs ============

export const getDietPlan = async (week: number = 1) => {
  const response = await apiClient.get('/diet-plans', {
    params: { week }
  });
  return response.data;
};

export const addToDietPlan = async (
  recipeId: number,
  dayOfWeek: string,
  mealType: string,
  weekNumber: number = 1
) => {
  const response = await apiClient.post('/diet-plans', {
    recipe_id: recipeId,
    day_of_week: dayOfWeek,
    meal_type: mealType,
    week_number: weekNumber,
  });
  return response.data;
};

export const removeMealFromPlan = async (id: number) => {
  const response = await apiClient.delete(`/diet-plans/${id}`);
  return response.data;
};

export const clearDietPlan = async (week: number = 1) => {
  const response = await apiClient.delete('/diet-plans/clear', {
    params: { week }
  });
  return response.data;
};

export const getDayNutrition = async (day: string, week: number = 1) => {
  const response = await apiClient.get(`/diet-plans/nutrition/${day}`, {
    params: { week }
  });
  return response.data;
};

// ============ User Recipe APIs (Admin Only) ============

export const getUserRecipes = async () => {
  const response = await apiClient.get('/user-recipes');
  return response.data;
};

export const createUserRecipe = async (recipeData: {
  title: string;
  summary?: string;
  image?: string;
  ready_in_minutes?: number;
  servings?: number;
  health_score?: number;
  price_per_serving?: number;
  instructions?: string;
  categories?: string[];
  vegetarian?: boolean;
  vegan?: boolean;
  gluten_free?: boolean;
  dairy_free?: boolean;
}) => {
  const response = await apiClient.post('/user-recipes', recipeData);
  return response.data;
};

export const updateUserRecipe = async (id: number, recipeData: any) => {
  const response = await apiClient.put(`/user-recipes/${id}`, recipeData);
  return response.data;
};

export const deleteUserRecipe = async (id: number) => {
  const response = await apiClient.delete(`/user-recipes/${id}`);
  return response.data;
};

export const getUserRecipeDetail = async (id: number) => {
  const response = await apiClient.get(`/user-recipes/${id}`);
  return response.data;
};