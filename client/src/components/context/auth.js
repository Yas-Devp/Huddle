"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Connect_Auth } from "@/components/api/auth/connect_login";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const StateContext = createContext(null);

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

export function AuthProvider({ children }) {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await Connect_Auth.getMe();
      const currentUser = response.data?.user ?? null;

      setUser(currentUser);
      setIsAuthenticated(Boolean(currentUser));

      return currentUser;
    } catch (error) {
      // A 401 here is expected when no cookie exists yet.
      if (error?.response?.status !== 401) {
        console.error("Session check failed:", error);
      }

      setUser(null);
      setIsAuthenticated(false);

      return null;
    }
  }, []);

  // Restore the session from the HttpOnly cookie once on mount.
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const response = await Connect_Auth.getMe();
        if (cancelled) return;

        const currentUser = response.data?.user ?? null;
        setUser(currentUser);
        setIsAuthenticated(Boolean(currentUser));
      } catch {
        if (cancelled) return;

        setUser(null);
        setIsAuthenticated(false);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (value) => {
    try {
      const response = await Connect_Auth.postLogin({
        email: value.email,
        password: value.password,
      });

      setUser(response.data?.user ?? null);
      setIsAuthenticated(true);
      toast.success("Welcome back!");
      router.push("/");

      return response;
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Login failed. Please check your credentials."),
      );
      throw error;
    }
  };

  const signup = async (value) => {
    try {
      const response = await Connect_Auth.postRegister(value);

      toast.success("Account created. Please sign in.");
      router.push("/login");

      return response;
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Registration failed. Please try again."),
      );
      throw error;
    }
  };

  const logout = async () => {
    try {
      await Connect_Auth.postLogout();
      toast.success("Logged out successfully.");
    } catch (error) {
      // A 401 means the cookie is already gone, so local logout can continue.
      if (error?.response?.status !== 401) {
        console.error("Logout failed:", error);
        toast.error("Logout failed. Please try again.");
        return;
      }
    }

    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
    router.refresh();
  };

  return (
    <StateContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        checkAuth,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export const useAuth = () => useContext(StateContext);
