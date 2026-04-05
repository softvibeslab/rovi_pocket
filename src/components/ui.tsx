import { ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { layout, palette, radii, spacing } from "../theme";
import { ActivityItem, AgendaItem, Lead, PlanCard, Prompt } from "../types";

export function ScreenScroll({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {children}
    </ScrollView>
  );
}

export function SectionCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.sectionCard, style]}>{children}</View>;
}

export function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title?: string;
  body?: string;
}) {
  return (
    <View style={styles.headingBlock}>
      <Text style={styles.headingEyebrow}>{eyebrow}</Text>
      {title ? <Text style={styles.headingTitle}>{title}</Text> : null}
      {body ? <Text style={styles.headingBody}>{body}</Text> : null}
    </View>
  );
}

export function FilterChip({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <View style={[styles.filterChip, active && styles.filterChipActive]}>
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{label}</Text>
    </View>
  );
}

export function SearchField({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.searchField}>
      <Text style={styles.searchIcon}>AI</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.textMuted}
        style={styles.searchInput}
      />
    </View>
  );
}

export function MetricCard({
  label,
  value,
  caption,
  tone = "neutral",
}: {
  label: string;
  value: string;
  caption: string;
  tone?: "primary" | "secondary" | "neutral";
}) {
  return (
    <View
      style={[
        styles.metricCard,
        tone === "primary" && styles.metricCardPrimary,
        tone === "secondary" && styles.metricCardSecondary,
      ]}
    >
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricCaption}>{caption}</Text>
    </View>
  );
}

export function ProgressBar({
  progress,
  accentColor = palette.primary,
}: {
  progress: number;
  accentColor?: string;
}) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, progress))}%`, backgroundColor: accentColor }]} />
    </View>
  );
}

export function PlanTile({
  item,
  onPress,
}: {
  item: PlanCard;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={[
        styles.planTile,
        item.tone === "primary" && styles.planTilePrimary,
        item.tone === "secondary" && styles.planTileSecondary,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.planLabel,
          item.tone === "primary" && styles.planLabelPrimary,
          item.tone === "secondary" && styles.planLabelSecondary,
        ]}
      >
        {item.label}
      </Text>
      <Text style={styles.planTitle}>{item.title}</Text>
      <Text style={styles.planBody}>{item.body}</Text>
    </Pressable>
  );
}

export function LeadCard({
  lead,
  selected = false,
  compact = false,
  onPress,
}: {
  lead: Lead;
  selected?: boolean;
  compact?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.leadCard,
        selected && styles.leadCardSelected,
        compact && styles.leadCardCompact,
      ]}
    >
      <View style={styles.leadTopRow}>
        <View style={styles.leadCopy}>
          <Text style={styles.leadName}>{lead.name}</Text>
          <Text style={styles.leadProperty}>
            {lead.property} · {lead.price}
          </Text>
          <Text style={styles.leadLocation}>{lead.location}</Text>
        </View>
        <View style={styles.scoreWrap}>
          <StageChip label={lead.stage} priority={lead.priority} />
          <Text style={styles.scoreValue}>{lead.score}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <MetaPill text={lead.source} />
        <MetaPill text={lead.lastTouch} />
        <MetaPill text={lead.preferredChannel} />
      </View>

      <Text style={styles.leadActionLabel}>Next best action</Text>
      <Text style={styles.leadAction}>{lead.nextAction}</Text>
    </Pressable>
  );
}

export function AgendaCard({
  item,
  onPress,
}: {
  item: AgendaItem;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.agendaCard} onPress={onPress}>
      <View style={styles.agendaTimeShell}>
        <Text style={styles.agendaTime}>{item.time}</Text>
        <Text style={styles.agendaDuration}>{item.duration}</Text>
      </View>

      <View style={styles.agendaCopy}>
        <Text style={styles.agendaTitle}>{item.title}</Text>
        <Text style={styles.agendaMeta}>
          {item.type} · {item.leadName}
        </Text>
        <Text style={styles.agendaNote}>{item.note}</Text>
      </View>

      <Text
        style={[
          styles.agendaStatus,
          item.status === "next" && styles.agendaStatusPrimary,
          item.status === "done" && styles.agendaStatusMuted,
        ]}
      >
        {item.status === "next" ? "Next" : item.status === "done" ? "Done" : "Today"}
      </Text>
    </Pressable>
  );
}

export function PromptPill({ prompt }: { prompt: Prompt }) {
  return (
    <Pressable style={styles.promptPill}>
      <Text style={styles.promptText}>{prompt.label}</Text>
    </Pressable>
  );
}

export function ChatBubble({
  role,
  text,
}: {
  role: "user" | "assistant";
  text: string;
}) {
  return (
    <View style={[styles.chatWrap, role === "user" ? styles.chatWrapUser : styles.chatWrapAssistant]}>
      <View style={[styles.chatBubble, role === "user" ? styles.chatBubbleUser : styles.chatBubbleAssistant]}>
        <Text style={[styles.chatText, role === "user" && styles.chatTextUser]}>{text}</Text>
      </View>
    </View>
  );
}

export function InsightPanel({
  title,
  body,
  actions,
  onActionPress,
}: {
  title: string;
  body: string;
  actions: string[];
  onActionPress?: (action: string) => void;
}) {
  return (
    <SectionCard style={styles.insightPanel}>
      <Text style={styles.insightLabel}>Lead profile</Text>
      <Text style={styles.insightTitle}>{title}</Text>
      <Text style={styles.insightBody}>{body}</Text>

      <View style={styles.actionRow}>
        {actions.map((action, index) => (
          <Pressable
            key={action}
            style={[styles.actionButton, index === 0 && styles.actionButtonPrimary]}
            onPress={() => onActionPress?.(action)}
          >
            <Text
              style={[
                styles.actionButtonText,
                index === 0 && styles.actionButtonTextPrimary,
              ]}
            >
              {action}
            </Text>
          </Pressable>
        ))}
      </View>
    </SectionCard>
  );
}

export function ActivityRow({ item }: { item: ActivityItem }) {
  return (
    <View
      style={[
        styles.activityRow,
        item.tone === "primary" && styles.activityRowPrimary,
        item.tone === "secondary" && styles.activityRowSecondary,
      ]}
    >
      <View style={styles.activityDot} />
      <View style={styles.activityCopy}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDetail}>{item.detail}</Text>
      </View>
      <Text style={styles.activityTime}>{item.time}</Text>
    </View>
  );
}

export function MetaPill({ text }: { text: string }) {
  return (
    <View style={styles.metaPill}>
      <Text style={styles.metaPillText}>{text}</Text>
    </View>
  );
}

export function StageChip({
  label,
  priority,
}: {
  label: string;
  priority: Lead["priority"];
}) {
  return (
    <View
      style={[
        styles.stageChip,
        priority === "hot" && styles.stageChipHot,
        priority === "warm" && styles.stageChipWarm,
      ]}
    >
      <Text
        style={[
          styles.stageChipText,
          priority === "hot" && styles.stageChipTextHot,
          priority === "warm" && styles.stageChipTextWarm,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export function LabelValueRow({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string;
  valueStyle?: StyleProp<TextStyle>;
}) {
  return (
    <View style={styles.labelValueRow}>
      <Text style={styles.labelValueLabel}>{label}</Text>
      <Text style={[styles.labelValueValue, valueStyle]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: layout.screenBottomInset,
    gap: spacing.lg,
  },
  sectionCard: {
    backgroundColor: palette.surfaceMuted,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    gap: spacing.md,
  },
  headingBlock: {
    gap: 4,
  },
  headingEyebrow: {
    color: palette.primary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  headingTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  headingBody: {
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  searchField: {
    minHeight: 54,
    borderRadius: radii.lg,
    backgroundColor: palette.surface,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  searchIcon: {
    color: palette.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  searchInput: {
    flex: 1,
    color: palette.text,
    fontSize: 14,
    paddingVertical: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    borderRadius: radii.full,
    backgroundColor: palette.surfaceElevated,
  },
  filterChipActive: {
    backgroundColor: "rgba(63,255,139,0.12)",
    borderWidth: 1,
    borderColor: "rgba(63,255,139,0.20)",
  },
  filterChipText: {
    color: palette.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  filterChipTextActive: {
    color: palette.primary,
  },
  metricCard: {
    flex: 1,
    minHeight: 126,
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  metricCardPrimary: {
    backgroundColor: "#13251a",
  },
  metricCardSecondary: {
    backgroundColor: "#171c31",
  },
  metricLabel: {
    color: palette.textMuted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  metricValue: {
    color: palette.text,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -1,
  },
  metricCaption: {
    color: palette.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  progressTrack: {
    height: 10,
    borderRadius: radii.full,
    backgroundColor: palette.surfaceStrong,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: radii.full,
  },
  planTile: {
    flex: 1,
    minHeight: 146,
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  planTilePrimary: {
    borderLeftWidth: 3,
    borderLeftColor: palette.primary,
  },
  planTileSecondary: {
    borderLeftWidth: 3,
    borderLeftColor: palette.secondary,
  },
  planLabel: {
    color: palette.textMuted,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  planLabelPrimary: {
    color: palette.primary,
  },
  planLabelSecondary: {
    color: palette.secondary,
  },
  planTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 22,
  },
  planBody: {
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  leadCard: {
    backgroundColor: palette.surfaceElevated,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  leadCardSelected: {
    borderLeftWidth: 3,
    borderLeftColor: palette.primary,
    shadowColor: palette.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 22,
    elevation: 6,
  },
  leadCardCompact: {
    paddingVertical: spacing.md,
  },
  leadTopRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  leadCopy: {
    flex: 1,
    gap: 3,
  },
  leadName: {
    color: palette.text,
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  leadProperty: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "600",
  },
  leadLocation: {
    color: palette.textMuted,
    fontSize: 12,
  },
  scoreWrap: {
    alignItems: "flex-end",
    gap: spacing.xs,
  },
  scoreValue: {
    color: palette.primary,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.8,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  metaPill: {
    backgroundColor: palette.surfaceStrong,
    borderRadius: radii.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  metaPillText: {
    color: palette.textMuted,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  leadActionLabel: {
    color: palette.textMuted,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  leadAction: {
    color: palette.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  agendaCard: {
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: palette.surfaceElevated,
    borderRadius: radii.lg,
    padding: spacing.md,
    alignItems: "flex-start",
  },
  agendaTimeShell: {
    width: 72,
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    gap: 4,
  },
  agendaTime: {
    color: palette.primary,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  agendaDuration: {
    color: palette.textMuted,
    fontSize: 11,
    fontWeight: "700",
  },
  agendaCopy: {
    flex: 1,
    gap: 4,
  },
  agendaTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "800",
  },
  agendaMeta: {
    color: palette.secondary,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  agendaNote: {
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  agendaStatus: {
    color: palette.textMuted,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  agendaStatusPrimary: {
    color: palette.primary,
  },
  agendaStatusMuted: {
    color: palette.textMuted,
  },
  promptPill: {
    backgroundColor: palette.surface,
    borderRadius: radii.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  promptText: {
    color: palette.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  chatWrap: {
    width: "100%",
  },
  chatWrapUser: {
    alignItems: "flex-end",
  },
  chatWrapAssistant: {
    alignItems: "flex-start",
  },
  chatBubble: {
    maxWidth: "88%",
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  chatBubbleUser: {
    backgroundColor: palette.surfaceElevated,
    borderTopRightRadius: 6,
  },
  chatBubbleAssistant: {
    backgroundColor: palette.surface,
    borderTopLeftRadius: 6,
    borderLeftWidth: 2,
    borderLeftColor: palette.primary,
  },
  chatText: {
    color: palette.text,
    fontSize: 14,
    lineHeight: 21,
  },
  chatTextUser: {
    color: palette.text,
  },
  insightPanel: {
    backgroundColor: palette.surfaceElevated,
  },
  insightLabel: {
    color: palette.primary,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.3,
  },
  insightTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  insightBody: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  actionButton: {
    minHeight: 42,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.surfaceStrong,
  },
  actionButtonPrimary: {
    backgroundColor: palette.primary,
  },
  actionButtonText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: "800",
  },
  actionButtonTextPrimary: {
    color: "#005d2c",
  },
  stageChip: {
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: palette.surfaceStrong,
  },
  stageChipHot: {
    backgroundColor: "rgba(63,255,139,0.12)",
  },
  stageChipWarm: {
    backgroundColor: "rgba(146,155,250,0.14)",
  },
  stageChipText: {
    color: palette.textMuted,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  stageChipTextHot: {
    color: palette.primary,
  },
  stageChipTextWarm: {
    color: palette.secondary,
  },
  labelValueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  labelValueLabel: {
    color: palette.textMuted,
    fontSize: 13,
  },
  labelValueValue: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "right",
    flexShrink: 1,
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  activityRowPrimary: {
    borderLeftWidth: 2,
    borderLeftColor: palette.primary,
  },
  activityRowSecondary: {
    borderLeftWidth: 2,
    borderLeftColor: palette.secondary,
  },
  activityDot: {
    width: 8,
    height: 8,
    marginTop: 5,
    borderRadius: radii.full,
    backgroundColor: palette.primary,
  },
  activityCopy: {
    flex: 1,
    gap: 2,
  },
  activityTitle: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "800",
  },
  activityDetail: {
    color: palette.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  activityTime: {
    color: palette.textMuted,
    fontSize: 11,
    fontWeight: "700",
  },
});
