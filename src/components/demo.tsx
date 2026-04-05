import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { palette, radii, spacing } from "../theme";
import { DemoStep, QuickAction } from "../types";

export function DemoIntroModal({
  visible,
  onStart,
  onSkip,
}: {
  visible: boolean;
  onStart: () => void;
  onSkip: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalEyebrow}>Rovi Pocket demo</Text>
          <Text style={styles.modalTitle}>Mockup navegable con datos demo</Text>
          <Text style={styles.modalBody}>
            Puedes recorrer el flujo completo del broker: dashboard, lead insight lab, asistente
            IA, agenda y perfil. Todo corre con estado local para validar experiencia antes de la
            implementacion funcional.
          </Text>

          <View style={styles.bulletStack}>
            <Text style={styles.bullet}>- Dashboard con prioridades, metas y top leads</Text>
            <Text style={styles.bullet}>- Leads con score, pain point y scripts sugeridos</Text>
            <Text style={styles.bullet}>- IA con respuestas accionables y contexto del CRM</Text>
            <Text style={styles.bullet}>- Agenda y quick actions de broker mobile-first</Text>
          </View>

          <View style={styles.modalActions}>
            <Pressable style={styles.primaryButton} onPress={onStart}>
              <Text style={styles.primaryButtonText}>Iniciar demo guiada</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={onSkip}>
              <Text style={styles.secondaryButtonText}>Entrar sin guia</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function DemoProgressCard({
  steps,
  activeStepId,
  onSelectStep,
  onContinue,
}: {
  steps: DemoStep[];
  activeStepId: string;
  onSelectStep: (stepId: string) => void;
  onContinue: () => void;
}) {
  const currentStep = steps.find((step) => step.id === activeStepId) ?? steps[0];
  const currentIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === currentStep.id),
  );

  return (
    <View style={styles.progressCard}>
      <Text style={styles.progressEyebrow}>
        Demo guiada · {currentIndex + 1}/{steps.length}
      </Text>
      <Text style={styles.progressTitle}>{currentStep.title}</Text>
      <Text style={styles.progressBody}>{currentStep.body}</Text>

      <View style={styles.stepRow}>
        {steps.map((step) => {
          const active = step.id === currentStep.id;
          return (
            <Pressable
              key={step.id}
              style={[styles.stepPill, active && styles.stepPillActive]}
              onPress={() => onSelectStep(step.id)}
            >
              <Text style={[styles.stepPillText, active && styles.stepPillTextActive]}>
                {step.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable style={styles.progressButton} onPress={onContinue}>
        <Text style={styles.progressButtonText}>{currentStep.cta}</Text>
      </Pressable>
    </View>
  );
}

export function DemoToast({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <View pointerEvents="none" style={styles.toastWrap}>
      <View style={styles.toast}>
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </View>
  );
}

export function QuickActionSheet({
  visible,
  actions,
  onClose,
  onSelect,
}: {
  visible: boolean;
  actions: QuickAction[];
  onClose: () => void;
  onSelect: (actionId: string) => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.sheetOverlay}>
        <Pressable style={styles.sheetBackdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.sheetEyebrow}>Quick actions</Text>
          <Text style={styles.sheetTitle}>Flujos demo del broker</Text>
          <View style={styles.sheetStack}>
            {actions.map((action) => (
              <Pressable
                key={action.id}
                style={styles.sheetAction}
                onPress={() => onSelect(action.id)}
              >
                <Text style={styles.sheetActionTitle}>{action.label}</Text>
                <Text style={styles.sheetActionHint}>{action.hint}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(5, 6, 8, 0.75)",
    justifyContent: "center",
    padding: spacing.xl,
  },
  modalCard: {
    borderRadius: 28,
    backgroundColor: palette.surfaceMuted,
    padding: spacing.xxl,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  modalEyebrow: {
    color: palette.primary,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.3,
  },
  modalTitle: {
    color: palette.text,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.8,
  },
  modalBody: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  bulletStack: {
    gap: spacing.xs,
  },
  bullet: {
    color: palette.text,
    fontSize: 13,
    lineHeight: 19,
  },
  modalActions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: radii.lg,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#005d2c",
    fontSize: 14,
    fontWeight: "900",
  },
  secondaryButton: {
    minHeight: 50,
    borderRadius: radii.lg,
    backgroundColor: palette.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "800",
  },
  progressCard: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: "#111417",
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(63,255,139,0.10)",
  },
  progressEyebrow: {
    color: palette.primary,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  progressTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "800",
  },
  progressBody: {
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  stepRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  stepPill: {
    borderRadius: radii.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    backgroundColor: palette.surfaceStrong,
  },
  stepPillActive: {
    backgroundColor: "rgba(63,255,139,0.12)",
  },
  stepPillText: {
    color: palette.textMuted,
    fontSize: 11,
    fontWeight: "800",
  },
  stepPillTextActive: {
    color: palette.primary,
  },
  progressButton: {
    marginTop: spacing.xs,
    minHeight: 44,
    borderRadius: radii.md,
    backgroundColor: palette.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  progressButtonText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "800",
  },
  toastWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 72,
    alignItems: "center",
    zIndex: 99,
  },
  toast: {
    maxWidth: "88%",
    borderRadius: radii.full,
    backgroundColor: palette.surfaceStrong,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  toastText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  sheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 6, 8, 0.64)",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: palette.surfaceMuted,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 40,
    gap: spacing.md,
  },
  sheetEyebrow: {
    color: palette.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  sheetTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: "900",
  },
  sheetStack: {
    gap: spacing.sm,
  },
  sheetAction: {
    borderRadius: radii.lg,
    backgroundColor: palette.surface,
    padding: spacing.lg,
    gap: 4,
  },
  sheetActionTitle: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "800",
  },
  sheetActionHint: {
    color: palette.textMuted,
    fontSize: 12,
  },
});
