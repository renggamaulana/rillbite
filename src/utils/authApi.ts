// src/utils/authApi.ts

import axios from "axios";

console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
  },
});

// Auto attach token jika ada
API.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== AUTH FUNCTIONS ==========

// Login user
export const login = async (email: string, password: string) => {
  const response = await API.post("/auth/login", { email, password });
  return response.data; // { user, access_token }
};

// Register user
export const register = async (name: string, email: string, password: string) => {
  const response = await API.post("/auth/register", {
    name,
    email,
    password,
    password_confirmation: password,
  });
  return response.data;
};

// Logout user
export const logout = async () => {
  const response = await API.post("/auth/logout");
  return response.data;
};

// Get current authenticated user
export const getCurrentUser = async () => {
  const response = await API.get("/auth/user");
  return response.data; // { user }
};
