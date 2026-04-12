import { brokerProfile as demoBrokerProfile } from "../data/mock";
import { ActivityItem, AgendaItem, BrokerProfile, Lead } from "../types";
import { ApiCalendarEvent, ApiDashboardStats, ApiLead, ApiRecentActivity, ApiUser } from "./pocketApi";

function formatCurrency(value?: number | null) {
  if (!value) return "MXN por confirmar";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatRelative(iso?: string | null) {
  if (!iso) return "Sin actividad";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Sin actividad";
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);
  if (diffMinutes < 60) return `Hace ${Math.max(1, diffMinutes)}m`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours}h`;
  const diffDays = Math.round(diffHours / 24);
  return `Hace ${diffDays}d`;
}

function mapStatusToStage(status?: string) {
  const byStatus: Record<string, string> = {
    nuevo: "Nuevo",
    contactado: "Contactado",
    calificacion: "Calificacion",
    presentacion: "Presentacion",
    apartado: "Apartado",
    venta: "Venta",
    perdido: "Perdido",
  };
  return byStatus[status ?? ""] ?? "Seguimiento";
}

function mapPriority(priority?: string): Lead["priority"] {
  if (priority === "urgente" || priority === "alta") return "hot";
  if (priority === "media") return "warm";
  return "watch";
}

function extractString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function extractAnalysisText(analysis: Record<string, unknown> | null | undefined, keys: string[]) {
  if (!analysis) return "";
  for (const key of keys) {
    const value = analysis[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
    if (Array.isArray(value)) {
      const firstText = value.find((item) => typeof item === "string");
      if (typeof firstText === "string") {
        return firstText;
      }
    }
  }
  return "";
}

function formatEventTime(iso?: string | null) {
  if (!iso) return "Hora TBD";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Hora TBD";
  return new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatEventDuration(startIso?: string | null, endIso?: string | null) {
  if (!startIso || !endIso) return "30 min";
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "30 min";
  const minutes = Math.max(15, Math.round((end.getTime() - start.getTime()) / 60000));
  if (minutes >= 60 && minutes % 60 === 0) {
    return `${minutes / 60} h`;
  }
  return `${minutes} min`;
}

function mapEventType(eventType?: string) {
  const byType: Record<string, string> = {
    seguimiento: "Follow-up",
    llamada: "Call",
    zoom: "Zoom",
    visita: "Visit",
    otro: "Task",
  };
  return byType[eventType ?? ""] ?? "Task";
}

export function mapApiLeadToPocketLead(apiLead: ApiLead): Lead {
  const analysis = apiLead.ai_analysis ?? null;
  const budget = formatCurrency(apiLead.budget_mxn);

  return {
    id: apiLead.id,
    name: apiLead.name,
    property: apiLead.property_interest || "Propiedad en seguimiento",
    location: apiLead.location_preference || "Zona por confirmar",
    stage: mapStatusToStage(apiLead.status),
    priority: mapPriority(apiLead.priority),
    score: apiLead.intent_score ?? 50,
    source: apiLead.source || "Web",
    price: formatCurrency(apiLead.budget_mxn),
    lastTouch: formatRelative(apiLead.last_contact || apiLead.updated_at || apiLead.created_at),
    nextAction:
      apiLead.next_action ||
      extractAnalysisText(analysis, ["next_action", "recommended_action"]) ||
      "Analizar lead con IA",
    preferredChannel: apiLead.source === "WhatsApp" ? "WhatsApp" : "Llamada",
    budget,
    pipelineValue: `${budget} ponderado`,
    insight:
      extractAnalysisText(analysis, ["summary", "insight", "analysis"]) ||
      apiLead.notes ||
      "Sin insight IA todavia. Puedes analizar este lead desde Pocket.",
    painPoint:
      extractAnalysisText(analysis, ["pain_point", "pain_points", "objection"]) ||
      "Objecion principal por descubrir.",
    summary:
      extractAnalysisText(analysis, ["summary", "closing_summary"]) ||
      apiLead.notes ||
      "Lead importado desde el CRM actual.",
    script:
      extractAnalysisText(analysis, ["script", "message", "followup_script"]) ||
      `Hola ${apiLead.name}, te comparto una actualizacion relevante sobre la propiedad que estas revisando. Si quieres, lo vemos hoy mismo en una llamada corta.`,
    tags: [mapStatusToStage(apiLead.status), apiLead.source || "CRM"].filter(Boolean),
  };
}

export function mapApiUserToBrokerProfile(user: ApiUser, stats?: ApiDashboardStats): BrokerProfile {
  return {
    ...demoBrokerProfile,
    name: user.name,
    focus:
      user.account_type === "individual"
        ? "Broker individual conectado al CRM real"
        : demoBrokerProfile.focus,
    closings: stats ? `${stats.ventas}/${stats.ventas_goal}` : demoBrokerProfile.closings,
    projectedRevenue: stats ? `${stats.total_points} pts` : demoBrokerProfile.projectedRevenue,
  };
}

export function mapRecentActivityToFeed(items: ApiRecentActivity[]): ActivityItem[] {
  return items.map((item) => ({
    id: item.id,
    title: item.activity_type ? `Actividad: ${item.activity_type}` : "Actividad reciente",
    detail: [item.lead_name, item.description, item.broker_name].filter(Boolean).join(" · "),
    time: formatRelative(item.created_at),
    tone: item.points_earned && item.points_earned > 0 ? "primary" : "neutral",
  }));
}

export function mapCalendarEventsToAgendaItems(items: ApiCalendarEvent[]): AgendaItem[] {
  const sorted = [...items].sort((left, right) => {
    return new Date(left.start_time).getTime() - new Date(right.start_time).getTime();
  });
  const now = Date.now();
  const nextUpcoming = sorted.find((item) => {
    return !item.completed && new Date(item.start_time).getTime() >= now;
  });
  const nextItemId = nextUpcoming?.id ?? sorted.find((item) => !item.completed)?.id;

  return sorted.map((item) => ({
    id: item.id,
    title: item.title,
    time: formatEventTime(item.start_time),
    duration: formatEventDuration(item.start_time, item.end_time),
    type: mapEventType(item.event_type),
    leadId: item.lead_id ?? undefined,
    leadName: item.lead?.name ?? "Sin lead asignado",
    note: item.description || "Evento sincronizado desde tu agenda operativa.",
    status: item.completed ? "done" : item.id === nextItemId ? "next" : "today",
  }));
}

export function mergeLeadWithAnalysis(lead: Lead, analysis: Record<string, unknown>): Lead {
  const keyPoints = Array.isArray(analysis.key_points)
    ? analysis.key_points.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];

  return {
    ...lead,
    score: typeof analysis.intent_score === "number" ? analysis.intent_score : lead.score,
    nextAction: extractString(analysis.next_action) || lead.nextAction,
    insight:
      keyPoints.join(" · ") ||
      extractString(analysis.summary) ||
      extractString(analysis.analysis) ||
      lead.insight,
    painPoint:
      extractString(analysis.objection) ||
      extractString(analysis.pain_point) ||
      lead.painPoint,
    summary:
      extractString(analysis.summary) ||
      extractString(analysis.sentiment) ||
      keyPoints.join(" · ") ||
      lead.summary,
    script:
      extractString(analysis.opening_script) ||
      extractString(analysis.script) ||
      lead.script,
    lastTouch: "Ahora",
  };
}
