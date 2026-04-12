import { Platform } from "react-native";

const SESSION_TOKEN_KEY = "rovi-pocket.live-token";

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

export async function readSessionToken() {
  if (Platform.OS === "web") {
    return getWebStorage()?.getItem(SESSION_TOKEN_KEY) ?? null;
  }

  const SecureStore = await getSecureStore();
  return SecureStore?.getItemAsync(SESSION_TOKEN_KEY) ?? null;
}

export async function persistSessionToken(token: string) {
  if (Platform.OS === "web") {
    getWebStorage()?.setItem(SESSION_TOKEN_KEY, token);
    return;
  }

  const SecureStore = await getSecureStore();
  await SecureStore?.setItemAsync(SESSION_TOKEN_KEY, token);
}

export async function clearSessionToken() {
  if (Platform.OS === "web") {
    getWebStorage()?.removeItem(SESSION_TOKEN_KEY);
    return;
  }

  const SecureStore = await getSecureStore();
  await SecureStore?.deleteItemAsync(SESSION_TOKEN_KEY);
}
