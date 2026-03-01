import axios, { AxiosError } from "axios";

/* =========================================================
   CONFIG
========================================================= */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
};

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/* =========================================================
   INTERCEPTORS
========================================================= */

// Inject token
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto logout on 401
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

/* =========================================================
   AUTH TYPES
========================================================= */

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
  message?: string;
}

/* =========================================================
   AUTH APIs
========================================================= */

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await apiClient.post("/auth/login", {
    email,
    password,
  });

  if (typeof window !== "undefined" && data.token) {
    localStorage.setItem("auth_token", data.token);
  }

  return data;
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await apiClient.post("/auth/register", {
    name,
    email,
    password,
    password_confirmation: password,
  });

  return data;
};

export const logout = async () => {
  const { data } = await apiClient.post("/auth/logout");

  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }

  return data;
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  const { data } = await apiClient.get("/auth/user");
  return data;
};

/* =========================================================
   UPDATE PROFILE
========================================================= */

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: AuthUser;
}

export const updateProfile = async (
  payload: UpdateProfilePayload
): Promise<UpdateProfileResponse> => {
  const { data } = await apiClient.put("/auth/update-profile", payload);
  return data;
};

/* =========================================================
   RECIPE APIs
========================================================= */

export const fetchRecipes = async (category: string) => {
  const { data } = await apiClient.get("/recipes/complexSearch", {
    params: { query: category, number: 12 },
  });
  return data.results;
};

export const searchRecipes = async (query: string, number = 12) => {
  const { data } = await apiClient.get("/recipes/complexSearch", {
    params: { query, number },
  });
  return data.results;
};

export const fetchRecipeDetail = async (id: number) => {
  const { data } = await apiClient.get(`/recipes/${id}/information`);
  return data;
};

/* =========================================================
   FAVORITES APIs
========================================================= */

export const getFavorites = async () => {
  const { data } = await apiClient.get("/favorites");
  return data;
};

export const toggleFavorite = async (recipeId: number) => {
  const { data } = await apiClient.post(`/favorites/toggle/${recipeId}`);
  return data;
};

export const checkFavorite = async (recipeId: number) => {
  const { data } = await apiClient.get(`/favorites/check/${recipeId}`);
  return data;
};

export const addToFavorites = async (recipeId: number) => {
  const { data } = await apiClient.post(`/favorites/${recipeId}`);
  return data;
};

export const removeFromFavorites = async (recipeId: number) => {
  const { data } = await apiClient.delete(`/favorites/${recipeId}`);
  return data;
};

/* =========================================================
   DIET PLAN APIs
========================================================= */

export const getDietPlan = async (week = 1) => {
  const { data } = await apiClient.get("/diet-plans", {
    params: { week },
  });
  return data;
};

export const addToDietPlan = async (
  recipeId: number,
  dayOfWeek: string,
  mealType: string,
  weekNumber = 1
) => {
  const { data } = await apiClient.post("/diet-plans", {
    recipe_id: recipeId,
    day_of_week: dayOfWeek,
    meal_type: mealType,
    week_number: weekNumber,
  });
  return data;
};

export const removeMealFromPlan = async (id: number) => {
  const { data } = await apiClient.delete(`/diet-plans/${id}`);
  return data;
};

export const clearDietPlan = async (week = 1) => {
  const { data } = await apiClient.delete("/diet-plans/clear", {
    params: { week },
  });
  return data;
};

export const getDayNutrition = async (day: string, week = 1) => {
  const { data } = await apiClient.get(`/diet-plans/nutrition/${day}`, {
    params: { week },
  });
  return data;
};

/* =========================================================
   ADMIN - USER RECIPES
========================================================= */

export const getUserRecipes = async () => {
  const { data } = await apiClient.get("/user-recipes");
  return data;
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
  const { data } = await apiClient.post("/user-recipes", recipeData);
  return data;
};

export const updateUserRecipe = async (id: number, recipeData: any) => {
  const { data } = await apiClient.put(`/user-recipes/${id}`, recipeData);
  return data;
};

export const deleteUserRecipe = async (id: number) => {
  const { data } = await apiClient.delete(`/user-recipes/${id}`);
  return data;
};

export const getUserRecipeDetail = async (id: number) => {
  const { data } = await apiClient.get(`/user-recipes/${id}`);
  return data;
};