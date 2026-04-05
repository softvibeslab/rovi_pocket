import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { palette, spacing } from "../theme";
import { Lead } from "../types";
import {
  FilterChip,
  InsightPanel,
  LeadCard,
  MetaPill,
  ScreenScroll,
  SearchField,
  SectionCard,
  SectionHeading,
} from "../components/ui";

export function LeadsScreen({
  leads,
  selectedLead,
  onLeadSelect,
  onAskAI,
  onCreateTask,
  onMarkFollowUp,
}: {
  leads: Lead[];
  selectedLead: Lead;
  onLeadSelect: (leadId: string) => void;
  onAskAI: (leadId: string) => void;
  onCreateTask: (leadId: string) => void;
  onMarkFollowUp: (leadId: string) => void;
}) {
  const [query, setQuery] = useState("");

  const filteredLeads = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return leads;
    return leads.filter((lead) => {
      return (
        lead.name.toLowerCase().includes(term) ||
        lead.property.toLowerCase().includes(term) ||
        lead.stage.toLowerCase().includes(term) ||
        lead.source.toLowerCase().includes(term)
      );
    });
  }, [query]);

  return (
    <ScreenScroll>
      <SectionCard>
        <SectionHeading
          eyebrow="Search and filter"
          title="Pipeline en un vistazo"
          body="Busca por lead, propiedad, etapa o canal. Todo esta optimizado para movilidad."
        />
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar prospectos, etapa o propiedad"
        />

        <View style={styles.filterRow}>
          <FilterChip label="Todos" active />
          <FilterChip label="Calientes" />
          <FilterChip label="Seguimiento" />
          <FilterChip label="Hoy" />
        </View>
      </SectionCard>

      <SectionCard>
        <SectionHeading eyebrow="Leads stream" title={`${filteredLeads.length} leads visibles`} />
        <View style={styles.stack}>
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              selected={lead.id === selectedLead.id}
              onPress={() => onLeadSelect(lead.id)}
            />
          ))}
        </View>
      </SectionCard>

      <SectionCard style={styles.insightShell}>
        <SectionHeading
          eyebrow="Lead insight lab"
          title={selectedLead.name}
          body={selectedLead.insight}
        />

        <View style={styles.detailMeta}>
          <MetaPill text={selectedLead.stage} />
          <MetaPill text={selectedLead.budget} />
          <MetaPill text={selectedLead.pipelineValue} />
        </View>

        <View style={styles.factCard}>
          <Text style={styles.factLabel}>Pain point</Text>
          <Text style={styles.factValue}>{selectedLead.painPoint}</Text>
        </View>

        <View style={styles.factCard}>
          <Text style={styles.factLabel}>Suggested script</Text>
          <Text style={styles.factValue}>{selectedLead.script}</Text>
        </View>

        <InsightPanel
          title={`Insight score ${selectedLead.score}`}
          body={selectedLead.summary}
          actions={["Abrir en IA", "Crear tarea", "Marcar follow-up"]}
          onActionPress={(action) => {
            if (action === "Abrir en IA") onAskAI(selectedLead.id);
            if (action === "Crear tarea") onCreateTask(selectedLead.id);
            if (action === "Marcar follow-up") onMarkFollowUp(selectedLead.id);
          }}
        />

        <Pressable style={styles.aiEntry} onPress={() => onAskAI(selectedLead.id)}>
          <Text style={styles.aiEntryTitle}>Preguntar a Rovi AI sobre este lead</Text>
          <Text style={styles.aiEntryBody}>
            Genera guion, objeciones, siguiente accion o resumen de reunion en un solo paso.
          </Text>
        </Pressable>
      </SectionCard>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  stack: {
    gap: spacing.md,
  },
  insightShell: {
    backgroundColor: palette.surface,
  },
  detailMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  factCard: {
    backgroundColor: palette.surfaceMuted,
    borderRadius: 18,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  factLabel: {
    color: palette.textMuted,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  factValue: {
    color: palette.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  aiEntry: {
    borderRadius: 18,
    backgroundColor: "#171c31",
    padding: spacing.lg,
    gap: spacing.xs,
  },
  aiEntryTitle: {
    color: palette.secondary,
    fontSize: 15,
    fontWeight: "800",
  },
  aiEntryBody: {
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});
