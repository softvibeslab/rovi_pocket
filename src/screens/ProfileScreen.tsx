import { Pressable, StyleSheet, Text, View } from "react-native";

import { integrations } from "../data/mock";
import { palette, spacing } from "../theme";
import { ActivityItem, BrokerProfile } from "../types";
import {
  ActivityRow,
  LabelValueRow,
  MetricCard,
  ScreenScroll,
  SectionCard,
  SectionHeading,
} from "../components/ui";

export function ProfileScreen({
  activityFeed,
  brokerProfile,
  sessionMode,
  onResetSession,
}: {
  activityFeed: ActivityItem[];
  brokerProfile: BrokerProfile;
  sessionMode: "demo" | "live";
  onResetSession: () => void;
}) {
  return (
    <ScreenScroll>
      <SectionCard style={styles.heroCard}>
        <SectionHeading
          eyebrow="Broker OS"
          title={brokerProfile.name}
          body={`${brokerProfile.focus}. Mercado base: ${brokerProfile.market}.`}
        />
        <View style={styles.badgeRow}>
          {brokerProfile.badges.map((badge) => (
            <View key={badge} style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <View style={styles.metricGrid}>
        <MetricCard label="Racha" value={`${brokerProfile.streakDays} dias`} caption="consistencia diaria" tone="primary" />
        <MetricCard label="Follow-up" value={brokerProfile.followUpRate} caption="calidad operacional" tone="secondary" />
      </View>

      <SectionCard>
        <SectionHeading
          eyebrow="Metas personales"
          title="Panel de progreso"
        />
        <LabelValueRow label="Cierres del mes" value={brokerProfile.closings} />
        <LabelValueRow label="Citas de la semana" value={brokerProfile.appointments} />
        <LabelValueRow label="Ingreso proyectado" value={brokerProfile.projectedRevenue} valueStyle={styles.primaryValue} />
      </SectionCard>

      <SectionCard>
        <SectionHeading
          eyebrow="Integraciones"
          title="Estado del stack del broker"
        />
        <View style={styles.integrationList}>
          {integrations.map((integration) => (
            <View key={integration.id} style={styles.integrationItem}>
              <View style={styles.integrationHead}>
                <Text style={styles.integrationName}>{integration.name}</Text>
                <Text style={styles.integrationStatus}>{integration.status}</Text>
              </View>
              <Text style={styles.integrationDetail}>{integration.detail}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <SectionHeading
          eyebrow="Landing magnet"
          title="Tu captura publica"
          body={brokerProfile.landingStatus}
        />
      </SectionCard>

      <SectionCard>
        <SectionHeading
          eyebrow="Modo actual"
          title={sessionMode === "live" ? "Backend real conectado" : "Modo demo activo"}
          body={
            sessionMode === "live"
              ? "Pocket ya esta consumiendo autenticacion y leads del CRM actual."
              : "Estas navegando con datos locales para validar la experiencia."
          }
        />
        <Pressable style={styles.resetButton} onPress={onResetSession}>
          <Text style={styles.resetButtonText}>Volver al acceso</Text>
        </Pressable>
      </SectionCard>

      <SectionCard>
        <SectionHeading
          eyebrow="Demo activity"
          title="Bitacora del broker"
        />
        <View style={styles.integrationList}>
          {activityFeed.slice(0, 4).map((item) => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </View>
      </SectionCard>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: palette.surface,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "rgba(63,255,139,0.12)",
  },
  badgeText: {
    color: palette.primary,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  metricGrid: {
    flexDirection: "row",
    gap: spacing.md,
  },
  primaryValue: {
    color: palette.primary,
  },
  integrationList: {
    gap: spacing.md,
  },
  integrationItem: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  integrationHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  integrationName: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "800",
  },
  integrationStatus: {
    color: palette.secondary,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  integrationDetail: {
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  resetButton: {
    minHeight: 46,
    borderRadius: 16,
    backgroundColor: palette.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  resetButtonText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "800",
  },
});
