"use client";

import { login } from "@/api/resources/sessions/login";
import { logout } from "@/api/resources/sessions/logout";
import { getCurrentUser } from "@/api/resources/sessions/getCurrentUser";
import { register } from "@/api/resources/sessions/register";
import Loader from "@/components/common/Loader";
import useAuthStore from "@/lib/stores/authStore";
import type { User } from "@/lib/types";
import { AxiosError, HttpStatusCode } from "axios";
import { redirect, usePathname } from "next/navigation";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import SetupModal from "@/components/common/SetupModal";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
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

const permittedRoutes = ['/', '/login', '/register', '/verify'];
const setupModalExcludedRoutes = ['/login', '/register', '/verify'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [openSetupModal, setOpenSetupModal] = useState<boolean>(false);

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clearSession = useAuthStore((state) => state.clearSession);

  const isPermittedRoute = permittedRoutes.includes(pathname ?? "");

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
    await register(email, password, name);
  };

  const handleUnauthorized = useCallback(() => {
    toast.error('Not authenticated');
    clearSession();

    redirect('/login');
  }, [clearSession]);

  const isAuthenticated = !!user;
  const isAdmin = user?.admin || false;

  useEffect(() => {
    if (isPermittedRoute) {
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
      })
      .finally(() => {
        setIsAuthChecking(false);
      });
  }, [isPermittedRoute, setUser, clearSession, handleUnauthorized]);

  useEffect(() => {
    const shouldShow =
      isAuthenticated &&
      !user?.setupCompleted &&
      !setupModalExcludedRoutes.includes(pathname ?? "");

    if (shouldShow) {
      queueMicrotask(() => setOpenSetupModal(true));
    } else {
      queueMicrotask(() => setOpenSetupModal(false));
    }
  }, [isAuthenticated, user?.setupCompleted, pathname]);

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    handleLogin,
    handleLogout,
    handleRegister
  };

  const showLoader = !isPermittedRoute && (isAuthChecking || !isAuthenticated);

  return (
    <AuthContext.Provider value={value}>
      {showLoader ? (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        children
      )}

      <SetupModal isOpen={openSetupModal} onClose={() => setOpenSetupModal(false)} />
    </AuthContext.Provider>
  );
};
