import { StyleSheet, Text, View } from "react-native";

import { palette, spacing } from "../theme";
import { AgendaItem, Lead, PlanCard } from "../types";
import { AgendaCard, PlanTile, ScreenScroll, SectionCard, SectionHeading } from "../components/ui";

export function AgendaScreen({
  agendaItems,
  planCards,
  selectedLead,
  onLeadPress,
}: {
  agendaItems: AgendaItem[];
  planCards: PlanCard[];
  selectedLead: Lead;
  onLeadPress: (leadId: string) => void;
}) {
  const todayLabel = new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    weekday: "long",
  }).format(new Date());
  const activeBlocks = agendaItems.filter((item) => item.status !== "done").length;
  const visitsCount = agendaItems.filter((item) => item.type === "Visit").length;
  const completedCount = agendaItems.filter((item) => item.status === "done").length;

  return (
    <ScreenScroll>
      <SectionCard style={styles.heroCard}>
        <SectionHeading
          eyebrow={todayLabel}
          title={agendaItems.length > 0 ? "Agenda de ejecucion" : "Agenda lista para arrancar"}
          body={
            agendaItems.length > 0
              ? "Pocket ya esta leyendo tus bloques reales del dia para ayudarte a cerrar sin perder ritmo."
              : "Todavia no hay eventos para hoy. Crea un follow-up desde leads o IA y aparecera aqui."
          }
        />
        <View style={styles.heroFoot}>
          <Text style={styles.heroStat}>{activeBlocks} bloques activos</Text>
          <Text style={styles.heroStat}>{visitsCount} citas de campo</Text>
          <Text style={styles.heroStat}>{completedCount} cerrados hoy</Text>
        </View>
      </SectionCard>

      <SectionCard>
        <SectionHeading
          eyebrow="Timeline del dia"
          title={agendaItems.length > 0 ? "Natural thumb zone para operar rapido" : "Tu timeline esta vacio"}
        />
        <View style={styles.stack}>
          {agendaItems.length > 0 ? (
            agendaItems.map((item) => (
              <AgendaCard
                key={item.id}
                item={item}
                onPress={item.leadId ? () => onLeadPress(item.leadId!) : undefined}
              />
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Sin eventos todavia</Text>
              <Text style={styles.emptyBody}>
                Los follow-ups creados desde Pocket entraran aqui con hora, contexto y lead asociado.
              </Text>
            </View>
          )}
        </View>
      </SectionCard>

      <SectionCard>
        <SectionHeading
          eyebrow="Planner IA"
          title={`Protege el momentum de ${selectedLead.name}`}
          body={selectedLead.nextAction}
        />
        <View style={styles.stack}>
          {planCards.map((card) => (
            <PlanTile key={card.id} item={card} onPress={() => card.leadId && onLeadPress(card.leadId)} />
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <SectionHeading
          eyebrow="Semana"
          title="Reglas que la IA esta vigilando"
        />
        <View style={styles.ruleList}>
          <Text style={styles.ruleItem}>Hot leads sin respuesta en menos de 24h</Text>
          <Text style={styles.ruleItem}>Leads estancados sin follow-up por 5 dias</Text>
          <Text style={styles.ruleItem}>Citas de manana con confirmacion pendiente</Text>
        </View>
      </SectionCard>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: "#171c31",
  },
  heroFoot: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  heroStat: {
    color: palette.secondary,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  stack: {
    gap: spacing.md,
  },
  emptyCard: {
    borderRadius: 18,
    backgroundColor: palette.surface,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  emptyTitle: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "800",
  },
  emptyBody: {
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  ruleList: {
    gap: spacing.sm,
  },
  ruleItem: {
    color: palette.text,
    fontSize: 14,
    lineHeight: 20,
  },
});
