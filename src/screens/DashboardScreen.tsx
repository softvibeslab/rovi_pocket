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
}: {
  brokerProfile: BrokerProfile;
  leads: Lead[];
  agendaItems: AgendaItem[];
  planCards: PlanCard[];
  activityFeed: ActivityItem[];
  selectedLead: Lead;
  onLeadPress: (leadId: string) => void;
  onAskAI: (leadId: string) => void;
}) {
  return (
    <ScreenScroll>
      <SectionCard style={styles.heroCard}>
        <SectionHeading
          eyebrow="Daily brief"
          title={`Tu mejor oportunidad hoy es ${selectedLead.name}`}
          body={selectedLead.summary}
        />

        <View style={styles.heroButtonRow}>
          <Pressable style={styles.primaryAction} onPress={() => onLeadPress(selectedLead.id)}>
            <Text style={styles.primaryActionText}>Abrir lead</Text>
          </Pressable>
          <Pressable style={styles.secondaryAction} onPress={() => onAskAI(selectedLead.id)}>
            <Text style={styles.secondaryActionText}>Preguntar a IA</Text>
          </Pressable>
        </View>
      </SectionCard>

      <SectionCard>
        <SectionHeading
          eyebrow="Meta mensual"
          title={`${brokerProfile.projectedRevenue} / ${brokerProfile.monthlyTarget}`}
          body="Pipeline proyectado con foco en cierres premium y ritmo diario."
        />
        <ProgressBar progress={80} />
        <View style={styles.miniMetaRow}>
          <Text style={styles.miniMeta}>12 leads activos</Text>
          <Text style={styles.miniMeta}>5 en negociacion</Text>
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
          eyebrow="Top leads"
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
          eyebrow="Hoy en agenda"
          title="Bloques que sostienen el cierre"
        />
        <View style={styles.listStack}>
          {agendaItems.slice(0, 3).map((item) => (
            <AgendaCard key={item.id} item={item} onPress={() => onLeadPress(item.leadId)} />
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <SectionHeading
          eyebrow="Actividad reciente"
          title="Lo que ya paso en el demo"
        />
        <View style={styles.listStack}>
          {activityFeed.map((item) => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </View>
      </SectionCard>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: "#13251a",
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
  planStack: {
    gap: spacing.md,
  },
  listStack: {
    gap: spacing.md,
  },
});
