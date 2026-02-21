"use client";

import { login } from "@/api/resources/sessions/login";
import { logout } from "@/api/resources/sessions/logout";
import { getCurrentUser } from "@/api/resources/sessions/getCurrentUser";
import { register } from "@/api/resources/sessions/register";
import useAuthStore from "@/lib/stores/authStore";
import type { User } from "@/lib/types";
import { AxiosError, HttpStatusCode } from "axios";
import { redirect } from "next/navigation";
import { createContext, ReactNode, useCallback, useContext, useEffect } from "react";
import toast from "react-hot-toast";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  handleRegister: (email: string, password: string, name: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const permittedRoutes = ['/login', '/register'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  
  const setUser = useAuthStore((state) => state.setUser);
  const clearSession = useAuthStore((state) => state.clearSession);

  const handleLogin = async (email: string, password: string) => {
    const response = await login(email, password);
    setUser(response.user);
  };

  const handleLogout = async () => {
    await logout();
    clearSession();

    redirect('/login');
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    const response = await register(email, password, name);
    setUser(response.user);
  };

  const handleUnauthorized = useCallback(() => {
    toast.error('Not authenticated');
    clearSession();

    redirect('/login');
  }, [clearSession]);

  const isAuthenticated = !!user;

  useEffect(() => {
    if (permittedRoutes.includes(window.location.pathname)) {
      return;
    }

    getCurrentUser()
      .then((response) => {
        if ("user" in response) {
          setUser(response.user);
        } else {
          handleUnauthorized();
        }
      })
      .catch((error) => {
        if (error instanceof AxiosError && error.response?.status === HttpStatusCode.Unauthorized) {
          handleUnauthorized();
        } else {
          throw error;
        }
      });
  }, [setUser, clearSession, handleUnauthorized]);

  const value = {
    user,
    isAuthenticated,
    handleLogin,
    handleLogout,
    handleRegister
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
