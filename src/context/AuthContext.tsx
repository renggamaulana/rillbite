"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
  updateProfile,
  UpdateProfilePayload,
  User, // ← single source of truth dari api.ts
} from '@/utils/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Update profile and sync user state in context */
  updateUser: (payload: UpdateProfilePayload) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const response = await getCurrentUser(); // returns { user: User }
        setUser(response.user);
      }
    } catch (error) {
      localStorage.removeItem('auth_token');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiLogin(email, password); // returns { access_token, user: User }
    localStorage.setItem('auth_token', response.access_token);
    setUser(response.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await apiRegister(name, email, password); // returns { access_token, user: User }
    localStorage.setItem('auth_token', response.access_token);
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  /**
   * Call API to update profile, then sync the returned user
   * into context so all components reflect the new data instantly.
   */
  const updateUser = async (payload: UpdateProfilePayload) => {
    const response = await updateProfile(payload); // returns { message, user: User }
    setUser(response.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}