/**
 * Dashboard Real Screen
 *
 * Connected to real backend data for Rovi Pocket app.
 * Shows actual broker stats, leads, and activity from the CRM.
 */

import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ScrollView } from "react-native";

import { palette, spacing } from "../theme";
import { usePocketAuth } from "../context/PocketAuthContext";
import {
  fetchDashboardStats,
  fetchRecentActivity,
  fetchLeads,
  fetchTodayEvents,
  type ApiDashboardStats,
  type ApiRecentActivity,
  type ApiLead,
  type ApiCalendarEvent,
  PocketApiError,
} from "../lib/pocketApi";
import {
  ActivityRow,
  AgendaCard,
  LeadCard,
  MetricCard,
  PlanTile,
  ProgressBar,
  SectionCard,
  SectionHeading,
} from "../components/ui";

interface DashboardRealScreenProps {
  onLeadPress: (leadId: string) => void;
  onAskAI: (leadId: string) => void;
  onOpenAgenda: () => void;
}

export function DashboardRealScreen({
  onLeadPress,
  onAskAI,
  onOpenAgenda,
}: DashboardRealScreenProps) {
  const { token, user } = usePocketAuth();

  // State for backend data
  const [dashboardStats, setDashboardStats] = useState<ApiDashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<ApiRecentActivity[]>([]);
  const [leads, setLeads] = useState<ApiLead[]>([]);
  const [todayEvents, setTodayEvents] = useState<ApiCalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount and when token changes
  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  const loadDashboardData = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      setError(null);

      // Load all data in parallel
      const [stats, activity, leadsData, events] = await Promise.all([
        fetchDashboardStats(token),
        fetchRecentActivity(token, 10),
        fetchLeads(token),
        fetchTodayEvents(token),
      ]);

      setDashboardStats(stats);
      setRecentActivity(activity);
      setLeads(leadsData);
      setTodayEvents(events);
    } catch (err) {
      console.error("Error loading dashboard data:", err);

      let errorMessage = "Error al cargar datos del dashboard";

      if (err instanceof PocketApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    await loadDashboardData();
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={styles.loadingText}>Cargando dashboard...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  // Get priority leads
  const hotLeads = leads.filter((lead) => lead.pocket_priority === "hot").slice(0, 3);
  const warmLeads = leads.filter((lead) => lead.pocket_priority === "warm").slice(0, 2);

  // Calculate metrics
  const totalLeads = dashboardStats?.overview?.total_leads || 0;
  const pipelineValue = dashboardStats?.overview?.pipeline_value || 0;
  const momentumScore = dashboardStats?.overview?.momentum_score || 0;
  const salesProgress = dashboardStats?.goals?.progress_percentage || 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Welcome Section */}
      <SectionCard style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>Hola, {user?.name || "Broker"} 👋</Text>
        <Text style={styles.welcomeSubtitle}>
          Aquí está tu resumen de hoy para cerrar más operaciones
        </Text>
      </SectionCard>

      {/* Key Metrics */}
      <View style={styles.metricsRow}>
        <MetricCard
          title="Leads Activos"
          value={totalLeads.toString()}
          subtitle="En tu pipeline"
          color={palette.primary}
        />
        <MetricCard
          title="Valor Pipeline"
          value={`$${(pipelineValue / 1000000).toFixed(1)}M`}
          subtitle="En oportunidades"
          color={palette.accent}
        />
        <MetricCard
          title="Momentum"
          value={momentumScore.toString()}
          subtitle="Puntuación hoy"
          color={palette.success}
        />
      </View>

      {/* Goals Progress */}
      {dashboardStats?.goals && (
        <SectionCard>
          <SectionHeading
            eyebrow="Progreso Mensual"
            title={`${dashboardStats.goals.monthly_sales_current} / ${dashboardStats.goals.monthly_sales_goal} ventas`}
            body={`Estás al ${salesProgress}% de tu meta mensual`}
          />
          <ProgressBar progress={salesProgress} />
        </SectionCard>
      )}

      {/* Hero: Hottest Lead */}
      {hotLeads.length > 0 && (
        <SectionCard style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <Text style={styles.heroEyebrow}>Lead Prioritario</Text>
            <View style={styles.heroStatusPill}>
              <Text style={styles.heroStatusText}>Hot</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>{hotLeads[0].name}</Text>
          <Text style={styles.heroBody}>
            {hotLeads[0].property_interest || "Interesado en propiedades en Tulum"}
          </Text>

          <View style={styles.heroMetaRow}>
            {hotLeads[0].intent_score && hotLeads[0].intent_score > 0 && (
              <View style={styles.heroMetaPill}>
                <Text style={styles.heroMetaText}>
                  Score: {hotLeads[0].intent_score}
                </Text>
              </View>
            )}
            {hotLeads[0].budget_mxn && (
              <View style={styles.heroMetaPill}>
                <Text style={styles.heroMetaText}>
                  ${(hotLeads[0].budget_mxn / 1000000).toFixed(1)}M
                </Text>
              </View>
            )}
            {hotLeads[0].status && (
              <View style={styles.heroMetaPill}>
                <Text style={styles.heroMetaText}>
                  {hotLeads[0].status}
                </Text>
              </View>
            )}
          </View>

          {hotLeads[0].next_action && (
            <View style={styles.heroSignalCard}>
              <Text style={styles.heroSignalLabel}>Siguiente Acción IA</Text>
              <Text style={styles.heroSignalValue}>{hotLeads[0].next_action}</Text>
            </View>
          )}

          <View style={styles.heroButtonRow}>
            <Pressable
              style={styles.primaryAction}
              onPress={() => onAskAI(hotLeads[0].id)}
            >
              <Text style={styles.primaryActionText}>Pedir Script IA</Text>
            </Pressable>
            <Pressable
              style={styles.secondaryAction}
              onPress={() => onLeadPress(hotLeads[0].id)}
            >
              <Text style={styles.secondaryActionText}>Ver Lead</Text>
            </Pressable>
          </View>
        </SectionCard>
      )}

      {/* Today's Events */}
      {todayEvents.length > 0 && (
        <SectionCard>
          <SectionHeading
            eyebrow="Agenda de Hoy"
            title={`${todayEvents.length} eventos`}
            body="Tus citas y recordatorios para hoy"
          />
          {todayEvents.slice(0, 3).map((event) => (
            <AgendaCard
              key={event.id}
              title={event.title}
              time={new Date(event.start_time).toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              type={event.event_type || "cita"}
              onPress={onOpenAgenda}
            />
          ))}
        </SectionCard>
      )}

      {/* Warm Leads */}
      {warmLeads.length > 0 && (
        <SectionCard>
          <SectionHeading
            eyebrow="Leads Calientes"
            title={`${warmLeads.length} por seguir`}
            body="Leads que necesitan tu atención hoy"
          />
          {warmLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              name={lead.name}
              property={lead.property_interest || "Sin especificar"}
              score={lead.intent_score || 0}
              lastTouch={
                lead.last_contact
                  ? new Date(lead.last_contact).toLocaleDateString("es-MX")
                  : "Nunca"
              }
              status={lead.status || "nuevo"}
              onPress={() => onLeadPress(lead.id)}
            />
          ))}
        </SectionCard>
      )}

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <SectionCard>
          <SectionHeading
            eyebrow="Actividad Reciente"
            title="Últimos movimientos"
            body="Tu actividad más reciente en el CRM"
          />
          {recentActivity.slice(0, 5).map((activity) => (
            <ActivityRow
              key={activity.id}
              type={activity.activity_type || "actividad"}
              description={activity.description || "Sin descripción"}
              time={activity.created_at ? new Date(activity.created_at).toLocaleDateString("es-MX") : "Hoy"}
            />
          ))}
        </SectionCard>
      )}

      {/* Pipeline Summary */}
      {dashboardStats?.pipeline && (
        <SectionCard>
          <SectionHeading
            eyebrow="Pipeline Actual"
            title={`${totalLeads} leads en total`}
            body="Distribución de tu pipeline por etapa"
          />
          <View style={styles.pipelineContainer}>
            <PipelineStage
              label="Nuevos"
              count={dashboardStats.pipeline.nuevo}
              color={palette.info}
            />
            <PipelineStage
              label="Contactados"
              count={dashboardStats.pipeline.contactado}
              color={palette.primary}
            />
            <PipelineStage
              label="Calificados"
              count={dashboardStats.pipeline.calificacion}
              color={palette.accent}
            />
            <PipelineStage
              label="Presentación"
              count={dashboardStats.pipeline.presentacion}
              color={palette.warning}
            />
            <PipelineStage
              label="Apartados"
              count={dashboardStats.pipeline.apartado}
              color={palette.success}
            />
            <PipelineStage
              label="Ventas"
              count={dashboardStats.pipeline.venta}
              color={palette.success}
            />
          </View>
        </SectionCard>
      )}
    </ScrollView>
  );
}

// Helper component for pipeline stages
function PipelineStage({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <View style={styles.pipelineStage}>
      <View style={[styles.pipelineIndicator, { backgroundColor: color }]} />
      <Text style={styles.pipelineLabel}>{label}</Text>
      <Text style={[styles.pipelineCount, { color }]}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  contentContainer: {
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
    gap: spacing.md,
  },
  loadingText: {
    color: palette.textPrimary,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
    padding: spacing.xl,
    gap: spacing.md,
  },
  errorTitle: {
    color: palette.error,
    fontSize: 20,
    fontWeight: "bold",
  },
  errorText: {
    color: palette.textSecondary,
    fontSize: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: palette.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  welcomeCard: {
    marginBottom: spacing.md,
  },
  welcomeTitle: {
    color: palette.textPrimary,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: spacing.xs,
  },
  welcomeSubtitle: {
    color: palette.textSecondary,
    fontSize: 16,
    lineHeight: 22,
  },
  metricsRow: {
    flexDirection: "row",
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  heroCard: {
    marginBottom: spacing.md,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  heroEyebrow: {
    color: palette.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  heroStatusPill: {
    backgroundColor: palette.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  heroStatusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  heroTitle: {
    color: palette.textPrimary,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: spacing.xs,
  },
  heroBody: {
    color: palette.textSecondary,
    fontSize: 16,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  heroMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  heroMetaPill: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  heroMetaText: {
    color: palette.textSecondary,
    fontSize: 12,
  },
  heroSignalCard: {
    backgroundColor: "#1a1a1a",
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  heroSignalLabel: {
    color: palette.textSecondary,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  heroSignalValue: {
    color: palette.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  heroButtonRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  primaryAction: {
    flex: 1,
    backgroundColor: palette.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryActionText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryActionText: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  pipelineContainer: {
    gap: spacing.sm,
  },
  pipelineStage: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  pipelineIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  pipelineLabel: {
    flex: 1,
    color: palette.textSecondary,
    fontSize: 14,
  },
  pipelineCount: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
