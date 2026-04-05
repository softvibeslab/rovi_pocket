import { getApiBaseUrl } from "./config";

type RequestOptions = {
  method?: string;
  token?: string;
  body?: unknown;
  query?: Record<string, string | undefined>;
};

export type ApiUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string | null;
  account_type?: string;
  onboarding_completed?: boolean;
};

export type ApiAuthResponse = {
  access_token: string;
  token_type?: string;
  user: ApiUser;
};

export type ApiDashboardStats = {
  total_points: number;
  points_goal: number;
  points_progress: number;
  apartados: number;
  apartados_goal: number;
  ventas: number;
  ventas_goal: number;
  brokers_activos: number;
  leads_nuevos: number;
  conversion_rate: number;
};

export type ApiLead = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  status?: string;
  priority?: string;
  source?: string;
  budget_mxn?: number;
  property_interest?: string | null;
  location_preference?: string | null;
  notes?: string | null;
  updated_at?: string;
  created_at?: string;
  last_contact?: string | null;
  intent_score?: number;
  next_action?: string | null;
  ai_analysis?: Record<string, unknown> | null;
  activities?: Array<Record<string, unknown>>;
};

export type ApiRecentActivity = {
  id: string;
  activity_type?: string;
  description?: string;
  broker_name?: string;
  lead_name?: string;
  created_at?: string;
  points_earned?: number;
};

class PocketApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "PocketApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(`/api${path}`, `${getApiBaseUrl()}/`);

  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      typeof data?.detail === "string"
        ? data.detail
        : typeof data?.message === "string"
          ? data.message
          : "No fue posible completar la solicitud.";
    throw new PocketApiError(message, response.status);
  }

  return data as T;
}

export async function checkBackendHealth() {
  return request<{ status: string; timestamp: string }>("/health");
}

export async function loginWithBackend(email: string, password: string) {
  return request<ApiAuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function fetchCurrentUser(token: string) {
  return request<ApiUser>("/auth/me", { token });
}

export async function fetchDashboardStats(token: string) {
  return request<ApiDashboardStats>("/dashboard/stats", { token });
}

export async function fetchRecentActivity(token: string) {
  return request<ApiRecentActivity[]>("/dashboard/recent-activity", { token });
}

export async function fetchLeads(token: string, search?: string) {
  return request<ApiLead[]>("/leads", {
    token,
    query: { search },
  });
}

export async function fetchLeadDetail(token: string, leadId: string) {
  return request<ApiLead>(`/leads/${leadId}`, { token });
}

export async function analyzeLeadWithApi(token: string, leadId: string) {
  return request<Record<string, unknown>>(`/leads/${leadId}/analyze`, {
    method: "POST",
    token,
  });
}

export async function generateLeadScript(token: string, leadId: string, scriptType = "seguimiento") {
  return request<{ script: string; type: string }>(`/leads/${leadId}/generate-script`, {
    method: "POST",
    token,
    query: { script_type: scriptType },
  });
}

export { PocketApiError };
