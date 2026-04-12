import { Pressable, StyleSheet, Text, View } from "react-native";

import { palette, spacing } from "../theme";
import { ActivityItem, AgendaItem, BrokerProfile, Lead, PlanCard } from "../types";
import {
  ActivityRow,
  AgendaCard,
  LeadCard,
  MetricCard,
  PlanTile,
  ProgressBar,
  ScreenScroll,
  SectionCard,
  SectionHeading,
} from "../components/ui";

export function DashboardScreen({
  brokerProfile,
  leads,
  agendaItems,
  planCards,
  activityFeed,
  selectedLead,
  onLeadPress,
  onAskAI,
  onUseScript,
  onCreateTask,
  onOpenAgenda,
}: {
  brokerProfile: BrokerProfile;
  leads: Lead[];
  agendaItems: AgendaItem[];
  planCards: PlanCard[];
  activityFeed: ActivityItem[];
  selectedLead: Lead;
  onLeadPress: (leadId: string) => void;
  onAskAI: (leadId: string) => void;
  onUseScript: (leadId: string) => void;
  onCreateTask: (leadId: string) => void;
  onOpenAgenda: () => void;
}) {
  const hottestLead = leads.find((lead) => lead.priority === "hot") ?? selectedLead;
  const coolingLead =
    leads.find(
      (lead) =>
        lead.id !== hottestLead.id &&
        (lead.priority === "watch" || lead.lastTouch === "Nunca" || lead.lastTouch.includes("d")),
    ) ??
    leads.find((lead) => lead.id !== hottestLead.id) ??
    selectedLead;
  const agendaFocus = agendaItems.find((item) => item.status === "next") ?? agendaItems[0];

  return (
    <ScreenScroll>
      <SectionCard style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <Text style={styles.heroEyebrow}>Modo momentum</Text>
          <View style={styles.heroStatusPill}>
            <Text style={styles.heroStatusText}>Broker OS demo</Text>
          </View>
        </View>
        <Text style={styles.heroTitle}>Si solo haces una cosa hoy, mueve a {hottestLead.name}</Text>
        <Text style={styles.heroBody}>{hottestLead.summary}</Text>

        <View style={styles.heroMetaRow}>
          <View style={styles.heroMetaPill}>
            <Text style={styles.heroMetaText}>Score {hottestLead.score}</Text>
          </View>
          <View style={styles.heroMetaPill}>
            <Text style={styles.heroMetaText}>{hottestLead.preferredChannel}</Text>
          </View>
          <View style={styles.heroMetaPill}>
            <Text style={styles.heroMetaText}>{hottestLead.lastTouch}</Text>
          </View>
        </View>

        <View style={styles.heroSignalCard}>
          <Text style={styles.heroSignalLabel}>Movimiento recomendado por IA</Text>
          <Text style={styles.heroSignalValue}>{hottestLead.nextAction}</Text>
        </View>

        <View style={styles.heroButtonRow}>
          <Pressable style={styles.primaryAction} onPress={() => onUseScript(hottestLead.id)}>
            <Text style={styles.primaryActionText}>Usar script</Text>
          </Pressable>
          <Pressable style={styles.secondaryAction} onPress={() => onLeadPress(hottestLead.id)}>
            <Text style={styles.secondaryActionText}>Abrir lead</Text>
          </Pressable>
        </View>
      </SectionCard>

      <SectionCard>
        <SectionHeading
          eyebrow="Momentum pulse"
          title={`${brokerProfile.projectedRevenue} / ${brokerProfile.monthlyTarget}`}
          body="No es un dashboard administrativo: es un tablero de ejecución para tomar acción rápida."
        />
        <ProgressBar progress={80} />
        <View style={styles.miniMetaRow}>
          <Text style={styles.miniMeta}>{leads.length} leads vivos</Text>
          <Text style={styles.miniMeta}>1 cierre con momentum</Text>
          <Text style={styles.miniMeta}>{brokerProfile.streakDays} dias de racha</Text>
        </View>
      </SectionCard>

      <View style={styles.metricGrid}>
        <MetricCard label="Cierres" value={brokerProfile.closings} caption="avance contra meta" tone="primary" />
        <MetricCard label="Citas" value={brokerProfile.appointments} caption="agenda semanal" tone="secondary" />
      </View>

      <View style={styles.metricGrid}>
        <MetricCard label="Follow-up" value={brokerProfile.followUpRate} caption="SLA en 24h" />
        <MetricCard label="Pipeline" value="$9.0M" caption="valor vivo del broker" />
      </View>

      <SectionCard>
        <SectionHeading
          eyebrow="Radar vivo"
          title="La app te empuja a moverte, no solo a mirar"
          body="Tres señales que explican qué cerrar, qué rescatar y qué bloque proteger hoy."
        />

        <View style={styles.radarStack}>
          <Pressable style={[styles.radarCard, styles.radarCardPrimary]} onPress={() => onLeadPress(hottestLead.id)}>
            <Text style={styles.radarEyebrow}>Cerrar hoy</Text>
            <Text style={styles.radarTitle}>{hottestLead.name}</Text>
            <Text style={styles.radarBody}>{hottestLead.nextAction}</Text>
            <Text style={styles.radarCta}>Abrir lead prioritario</Text>
          </Pressable>

          <Pressable style={[styles.radarCard, styles.radarCardSecondary]} onPress={() => onUseScript(coolingLead.id)}>
            <Text style={styles.radarEyebrow}>No dejes enfriar</Text>
            <Text style={styles.radarTitle}>{coolingLead.name}</Text>
            <Text style={styles.radarBody}>{coolingLead.summary}</Text>
            <Text style={styles.radarCta}>Lanzar guion de reactivacion</Text>
          </Pressable>

          {agendaFocus ? (
            <Pressable style={styles.radarCard} onPress={onOpenAgenda}>
              <Text style={styles.radarEyebrow}>Agenda protegida</Text>
              <Text style={styles.radarTitle}>{agendaFocus.title}</Text>
              <Text style={styles.radarBody}>{agendaFocus.note}</Text>
              <Text style={styles.radarCta}>Ver bloque en agenda</Text>
            </Pressable>
          ) : null}
        </View>
      </SectionCard>

      <SectionCard>
        <SectionHeading
          eyebrow="Ejecucion de un toque"
          title={`Todo listo para operar con ${selectedLead.name}`}
          body="La demo ya enseña cómo un broker podría ejecutar sin salir del flujo."
        />

        <View style={styles.executionGrid}>
          <Pressable style={[styles.executionCard, styles.executionCardPrimary]} onPress={() => onUseScript(selectedLead.id)}>
            <Text style={styles.executionTitle}>Usar script</Text>
            <Text style={styles.executionBody}>Genera respuesta accionable para enviar hoy.</Text>
          </Pressable>

          <Pressable style={styles.executionCard} onPress={() => onAskAI(selectedLead.id)}>
            <Text style={styles.executionTitle}>Abrir IA</Text>
            <Text style={styles.executionBody}>Pregunta objeciones, timing o siguiente mejor acción.</Text>
          </Pressable>

          <Pressable style={styles.executionCard} onPress={() => onCreateTask(selectedLead.id)}>
            <Text style={styles.executionTitle}>Crear follow-up</Text>
            <Text style={styles.executionBody}>Empuja el lead a agenda con contexto listo.</Text>
          </Pressable>

          <Pressable style={styles.executionCard} onPress={onOpenAgenda}>
            <Text style={styles.executionTitle}>Ver agenda</Text>
            <Text style={styles.executionBody}>Protege bloques y valida el día completo.</Text>
          </Pressable>
        </View>
      </SectionCard>

      <SectionCard>
        <SectionHeading
          eyebrow="Plan tactico IA"
          title="Priorizacion automatica del dia"
          body="Estas tarjetas ya reflejan score, agenda, metas y envejecimiento del pipeline."
        />
        <View style={styles.planStack}>
          {planCards.map((item) => (
            <PlanTile key={item.id} item={item} onPress={() => item.leadId && onLeadPress(item.leadId)} />
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <SectionHeading
          eyebrow="Leads con momentum"
          title="Lo que merece tu energia primero"
        />
        <View style={styles.listStack}>
          {leads.slice(0, 3).map((lead) => (
            <LeadCard key={lead.id} lead={lead} compact onPress={() => onLeadPress(lead.id)} />
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <SectionHeading
          eyebrow="Agenda protegida"
          title="Bloques que sostienen el cierre"
        />
        <View style={styles.listStack}>
          {agendaItems.length > 0 ? (
            agendaItems.slice(0, 3).map((item) => (
              <AgendaCard
                key={item.id}
                item={item}
                onPress={item.leadId ? () => onLeadPress(item.leadId!) : undefined}
              />
            ))
          ) : (
            <Text style={styles.emptyState}>
              Aun no hay bloques reales para hoy. Crea un follow-up y aparecera aqui.
            </Text>
          )}
        </View>
      </SectionCard>

      <SectionCard>
        <SectionHeading
          eyebrow="Actividad reciente"
          title="Lo que confirma que el broker se movio"
        />
        <View style={styles.listStack}>
          {activityFeed.length > 0 ? (
            activityFeed.map((item) => <ActivityRow key={item.id} item={item} />)
          ) : (
            <Text style={styles.emptyState}>
              Cuando empieces a operar desde Pocket, la bitacora vivira aqui.
            </Text>
          )}
        </View>
      </SectionCard>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: "#10281a",
    borderColor: "rgba(63,255,139,0.16)",
    gap: spacing.md,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  heroEyebrow: {
    color: palette.primary,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  heroStatusPill: {
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  heroStatusText: {
    color: palette.text,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroTitle: {
    color: palette.text,
    fontSize: 29,
    lineHeight: 33,
    fontWeight: "900",
    letterSpacing: -1,
  },
  heroBody: {
    color: "rgba(249,249,253,0.82)",
    fontSize: 14,
    lineHeight: 21,
  },
  heroMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  heroMetaPill: {
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  heroMetaText: {
    color: palette.text,
    fontSize: 11,
    fontWeight: "800",
  },
  heroSignalCard: {
    borderRadius: 20,
    backgroundColor: "rgba(5, 8, 6, 0.32)",
    padding: spacing.lg,
    gap: spacing.xs,
  },
  heroSignalLabel: {
    color: palette.primary,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  heroSignalValue: {
    color: palette.text,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "700",
  },
  heroButtonRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  primaryAction: {
    flex: 1,
    minHeight: 46,
    borderRadius: 16,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryActionText: {
    color: "#005d2c",
    fontSize: 13,
    fontWeight: "900",
  },
  secondaryAction: {
    flex: 1,
    minHeight: 46,
    borderRadius: 16,
    backgroundColor: palette.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryActionText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "800",
  },
  miniMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  miniMeta: {
    color: palette.textMuted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  metricGrid: {
    flexDirection: "row",
    gap: spacing.md,
  },
  radarStack: {
    gap: spacing.md,
  },
  radarCard: {
    borderRadius: 20,
    backgroundColor: palette.surface,
    padding: spacing.lg,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  radarCardPrimary: {
    backgroundColor: "#14281c",
    borderColor: "rgba(63,255,139,0.12)",
  },
  radarCardSecondary: {
    backgroundColor: "#151a28",
    borderColor: "rgba(146,155,250,0.12)",
  },
  radarEyebrow: {
    color: palette.textMuted,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  radarTitle: {
    color: palette.text,
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  radarBody: {
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  radarCta: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: "800",
    marginTop: spacing.xs,
  },
  executionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  executionCard: {
    width: "47%",
    minHeight: 132,
    borderRadius: 20,
    backgroundColor: palette.surface,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  executionCardPrimary: {
    backgroundColor: "#151f17",
    borderColor: "rgba(63,255,139,0.12)",
  },
  executionTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "900",
  },
  executionBody: {
    color: palette.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  planStack: {
    gap: spacing.md,
  },
  listStack: {
    gap: spacing.md,
  },
  emptyState: {
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});
