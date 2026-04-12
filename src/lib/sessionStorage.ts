import { Platform } from "react-native";

// Storage keys
const SESSION_TOKEN_KEY = "rovi-pocket.live-token";
const REFRESH_TOKEN_KEY = "rovi-pocket.refresh-token";
const USER_DATA_KEY = "rovi-pocket.user-data";

type WebStorageLike = {
  getItem: (key: string) => string | null;
  removeItem: (key: string) => void;
  setItem: (key: string, value: string) => void;
};

function getWebStorage(): WebStorageLike | null {
  const storage = (globalThis as { localStorage?: WebStorageLike }).localStorage;
  return storage ?? null;
}

async function getSecureStore() {
  if (Platform.OS === "web") {
    return null;
  }

  return import("expo-secure-store");
}

/**
 * Read the session token from secure storage
 */
export async function readSessionToken(): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return getWebStorage()?.getItem(SESSION_TOKEN_KEY) ?? null;
    }

    const SecureStore = await getSecureStore();
    return await SecureStore?.getItemAsync(SESSION_TOKEN_KEY) ?? null;
  } catch (error) {
    console.error("Error reading session token:", error);
    return null;
  }
}

/**
 * Persist the session token to secure storage
 */
export async function persistSessionToken(token: string): Promise<void> {
  try {
    if (Platform.OS === "web") {
      getWebStorage()?.setItem(SESSION_TOKEN_KEY, token);
      return;
    }

    const SecureStore = await getSecureStore();
    await SecureStore?.setItemAsync(SESSION_TOKEN_KEY, token);
  } catch (error) {
    console.error("Error persisting session token:", error);
    throw new Error("Failed to save session token");
  }
}

/**
 * Clear the session token from secure storage
 */
export async function clearSessionToken(): Promise<void> {
  try {
    if (Platform.OS === "web") {
      getWebStorage()?.removeItem(SESSION_TOKEN_KEY);
      return;
    }

    const SecureStore = await getSecureStore();
    await SecureStore?.deleteItemAsync(SESSION_TOKEN_KEY);
  } catch (error) {
    console.error("Error clearing session token:", error);
    // Don't throw, just log
  }
}

/**
 * Read the refresh token from secure storage
 */
export async function readRefreshToken(): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return getWebStorage()?.getItem(REFRESH_TOKEN_KEY) ?? null;
    }

    const SecureStore = await getSecureStore();
    return await SecureStore?.getItemAsync(REFRESH_TOKEN_KEY) ?? null;
  } catch (error) {
    console.error("Error reading refresh token:", error);
    return null;
  }
}

/**
 * Persist the refresh token to secure storage
 */
export async function persistRefreshToken(token: string): Promise<void> {
  try {
    if (Platform.OS === "web") {
      getWebStorage()?.setItem(REFRESH_TOKEN_KEY, token);
      return;
    }

    const SecureStore = await getSecureStore();
    await SecureStore?.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error("Error persisting refresh token:", error);
    throw new Error("Failed to save refresh token");
  }
}

/**
 * Clear the refresh token from secure storage
 */
export async function clearRefreshToken(): Promise<void> {
  try {
    if (Platform.OS === "web") {
      getWebStorage()?.removeItem(REFRESH_TOKEN_KEY);
      return;
    }

    const SecureStore = await getSecureStore();
    await SecureStore?.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Error clearing refresh token:", error);
    // Don't throw, just log
  }
}

/**
 * Read user data from secure storage
 */
export async function readUserData(): Promise<any | null> {
  try {
    const data = getWebStorage()?.getItem(USER_DATA_KEY) ?? null;
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error("Error reading user data:", error);
    return null;
  }
}

/**
 * Persist user data to secure storage
 */
export async function persistUserData(userData: any): Promise<void> {
  try {
    const data = JSON.stringify(userData);
    getWebStorage()?.setItem(USER_DATA_KEY, data);
  } catch (error) {
    console.error("Error persisting user data:", error);
    throw new Error("Failed to save user data");
  }
}

/**
 * Clear user data from secure storage
 */
export async function clearUserData(): Promise<void> {
  try {
    getWebStorage()?.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error("Error clearing user data:", error);
    // Don't throw, just log
  }
}

/**
 * Clear all session data (token, refresh token, user data)
 */
export async function clearAllSessionData(): Promise<void> {
  try {
    await Promise.all([
      clearSessionToken(),
      clearRefreshToken(),
      clearUserData(),
    ]);
  } catch (error) {
    console.error("Error clearing session data:", error);
    // Continue even if some items fail
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await readSessionToken();
  return token !== null && token !== "";
}

/**
 * Get complete session info
 */
export async function getSessionInfo(): Promise<{
  authenticated: boolean;
  token: string | null;
  user: any | null;
}> {
  const token = await readSessionToken();
  const user = await readUserData();

  return {
    authenticated: await isAuthenticated(),
    token,
    user,
  };
}
