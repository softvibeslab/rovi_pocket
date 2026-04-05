import { Platform } from "react-native";

type EnvShape = {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

function getEnvValue(key: string) {
  return (globalThis as EnvShape).process?.env?.[key];
}

export function getApiBaseUrl() {
  const explicit = getEnvValue("EXPO_PUBLIC_API_URL");
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:8000";
  }

  return "http://localhost:8000";
}
