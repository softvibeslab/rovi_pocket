import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { palette, spacing } from "../theme";
import { ChatEntry, Lead, Prompt } from "../types";
import {
  ChatBubble,
  InsightPanel,
  LabelValueRow,
  PromptPill,
  ScreenScroll,
  SectionCard,
  SectionHeading,
} from "../components/ui";

export function CopilotScreen({
  prompts,
  thread,
  selectedLead,
  onLeadPress,
  onCreateTask,
  onUseScript,
}: {
  prompts: Prompt[];
  thread: ChatEntry[];
  selectedLead: Lead;
  onLeadPress: (leadId: string) => void;
  onCreateTask: (leadId: string) => void;
  onUseScript: (leadId: string) => void;
}) {
  return (
    <ScreenScroll>
      <SectionCard style={styles.contextCard}>
        <Text style={styles.contextLabel}>Analizando lead</Text>
        <Text style={styles.contextTitle}>{selectedLead.name}</Text>
        <Text style={styles.contextBody}>
          {selectedLead.property} · {selectedLead.location} · {selectedLead.preferredChannel}
        </Text>
      </SectionCard>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {prompts.map((prompt) => (
            <PromptPill key={prompt.id} prompt={prompt} />
          ))}
        </ScrollView>
      </View>

      <SectionCard>
        <SectionHeading
          eyebrow="Conversacion activa"
          title="Rovi AI como asistente del broker"
          body="Puede resumir leads, preparar reuniones, generar scripts y ayudarte a ejecutar."
        />

        <View style={styles.chatStack}>
          {thread.map((entry) => {
            if (entry.kind === "bubble") {
              return <ChatBubble key={entry.id} role={entry.role} text={entry.text} />;
            }

            return (
              <InsightPanel
                key={entry.id}
                title={entry.title}
                body={entry.body}
                actions={entry.actions}
                onActionPress={(action) => {
                  if (action === "Crear tarea") onCreateTask(selectedLead.id);
                  if (action === "Abrir lead") onLeadPress(selectedLead.id);
                  if (action === "Usar script") onUseScript(selectedLead.id);
                }}
              />
            );
          })}
        </View>
      </SectionCard>

      <SectionCard>
        <SectionHeading
          eyebrow="Tool context"
          title="Lo que Rovi ya sabe"
        />
        <View style={styles.toolGrid}>
          <LabelValueRow label="Score" value={`${selectedLead.score}`} valueStyle={styles.primaryValue} />
          <LabelValueRow label="Canal favorito" value={selectedLead.preferredChannel} />
          <LabelValueRow label="Objecion principal" value={selectedLead.painPoint} />
          <LabelValueRow label="Siguiente accion" value={selectedLead.nextAction} />
        </View>
      </SectionCard>

      <SectionCard style={styles.composerCard}>
        <Text style={styles.composerTitle}>Escribe, dicta o pega contexto</Text>
        <TextInput
          multiline
          editable={false}
          value=' "Que objecion debo anticipar con Ricardo y que mensaje le mando hoy?" '
          style={styles.composerInput}
        />
        <View style={styles.composerHintRow}>
          <Text style={styles.composerHint}>Texto</Text>
          <Text style={styles.composerHint}>Voz</Text>
          <Text style={styles.composerHint}>Lead</Text>
        </View>
      </SectionCard>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  contextCard: {
    backgroundColor: palette.surface,
    borderColor: "rgba(63,255,139,0.14)",
  },
  contextLabel: {
    color: palette.primary,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.3,
  },
  contextTitle: {
    color: palette.text,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.8,
  },
  contextBody: {
    color: palette.textMuted,
    fontSize: 13,
  },
  chatStack: {
    gap: spacing.md,
  },
  toolGrid: {
    gap: spacing.md,
  },
  primaryValue: {
    color: palette.primary,
  },
  composerCard: {
    backgroundColor: "#171c31",
  },
  composerTitle: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "800",
  },
  composerInput: {
    minHeight: 110,
    borderRadius: 18,
    backgroundColor: palette.surface,
    padding: spacing.lg,
    color: palette.textMuted,
    textAlignVertical: "top",
    fontSize: 14,
    lineHeight: 20,
  },
  composerHintRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  composerHint: {
    color: palette.secondary,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
});
