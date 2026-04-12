/**
 * Pocket Auth Context
 *
 * Provides authentication state and methods for Rovi Pocket app.
 * Handles persistent sessions, login, logout, and token management.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

import {
  loginWithBackend,
  fetchCurrentUser,
  PocketApiError,
  type ApiUser,
  type ApiAuthResponse,
} from "../lib/pocketApi";
import {
  persistSessionToken,
  clearSessionToken,
  readSessionToken,
  persistUserData,
  clearUserData,
  readUserData,
  clearAllSessionData,
  isAuthenticated,
} from "../lib/sessionStorage";

interface AuthContextType {
  // State
  user: ApiUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;

  // Methods
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function PocketAuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticatedState, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  /**
   * Initialize auth state from storage on mount
   */
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);

      // Check if we have a valid token
      const storedToken = await readSessionToken();
      const storedUser = await readUserData();

      if (storedToken && storedUser) {
        // Validate token by fetching current user
        try {
          const validatedUser = await fetchCurrentUser(storedToken);

          setToken(storedToken);
          setUser(validatedUser);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid, clear storage
          console.warn("Stored token invalid, clearing session");
          await clearAllSessionData();
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // No session found
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      setAuthError("Error al cargar la sesión");
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      // Call backend login
      const response: ApiAuthResponse = await loginWithBackend(email, password);

      // Persist token and user data
      await persistSessionToken(response.access_token);
      await persistUserData(response.user);

      // Update state
      setToken(response.access_token);
      setUser(response.user);
      setIsAuthenticated(true);

      return response;
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Error al iniciar sesión";

      if (error instanceof PocketApiError) {
        if (error.status === 401) {
          errorMessage = "Credenciales inválidas";
        } else if (error.message) {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setAuthError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout and clear session
   */
  const logout = async () => {
    try {
      setIsLoading(true);

      // Clear all session data
      await clearAllSessionData();

      // Clear state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
    } catch (error) {
      console.error("Logout error:", error);
      setAuthError("Error al cerrar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh user data from backend
   */
  const refreshUser = async () => {
    if (!token) {
      throw new Error("No token available");
    }

    try {
      const refreshedUser = await fetchCurrentUser(token);

      // Update storage and state
      await persistUserData(refreshedUser);
      setUser(refreshedUser);
    } catch (error) {
      console.error("Error refreshing user:", error);

      // If token is invalid, clear session
      if (error instanceof PocketApiError && error.status === 401) {
        await logout();
      }

      throw error;
    }
  };

  /**
   * Clear auth error
   */
  const clearError = () => {
    setAuthError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: isAuthenticatedState,
    isLoading,
    authError,
    login,
    logout,
    refreshUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function usePocketAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("usePocketAuth must be used within a PocketAuthProvider");
  }

  return context;
}

/**
 * HOC to protect routes that require authentication
 */
export function withPocketAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P & { fallback?: ReactNode }> {
  return function AuthenticatedComponent(props: P & { fallback?: ReactNode }) {
    const { isAuthenticated, isLoading } = usePocketAuth();

    if (isLoading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#0a0a0a",
          }}
        >
          <div style={{ color: "#ffffff", fontSize: "16px" }}>Cargando...</div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <>{props.fallback || null}</>;
    }

    return <Component {...props} />;
  };
}
