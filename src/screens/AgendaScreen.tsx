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
  return (
    <ScreenScroll>
      <SectionCard style={styles.heroCard}>
        <SectionHeading
          eyebrow="Domingo, 5 abril"
          title="Agenda de ejecucion"
          body="Tu planner IA ya protegio espacio para cierres, reactivacion y follow-up de alto valor."
        />
        <View style={styles.heroFoot}>
          <Text style={styles.heroStat}>4 bloques activos</Text>
          <Text style={styles.heroStat}>2 citas de campo</Text>
          <Text style={styles.heroStat}>1 cierre empujado por IA</Text>
        </View>
      </SectionCard>

      <SectionCard>
        <SectionHeading
          eyebrow="Timeline del dia"
          title="Natural thumb zone para operar rapido"
        />
        <View style={styles.stack}>
          {agendaItems.map((item) => (
            <AgendaCard key={item.id} item={item} onPress={() => onLeadPress(item.leadId)} />
          ))}
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
  ruleList: {
    gap: spacing.sm,
  },
  ruleItem: {
    color: palette.text,
    fontSize: 14,
    lineHeight: 20,
  },
});
