import { Pressable, StyleSheet, Text, View } from "react-native";

import { layout, palette, radii, spacing } from "../theme";
import { QuickAction, TabKey } from "../types";

export function TopBar({
  eyebrow,
  title,
  subtitle,
  brokerName,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  brokerName: string;
}) {
  return (
    <View style={styles.topBar}>
      <View style={styles.brandRow}>
        <View style={styles.avatarShell}>
          <Text style={styles.avatarText}>{initials(brokerName)}</Text>
        </View>
        <View style={styles.brandCopy}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      <View style={styles.statusShell}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>Broker online</Text>
      </View>
    </View>
  );
}

export function BottomTabs({
  activeTab,
  onChange,
}: {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}) {
  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "home", label: "Inicio" },
    { key: "leads", label: "Leads" },
    { key: "agenda", label: "Agenda" },
    { key: "copilot", label: "IA" },
    { key: "profile", label: "Perfil" },
  ];

  return (
    <View style={styles.bottomWrap}>
      <View style={styles.bottomTabs}>
        {tabs.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <Pressable key={tab.key} style={styles.tabItem} onPress={() => onChange(tab.key)}>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
              <View style={[styles.tabDot, active && styles.tabDotActive]} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function FloatingActionDock({
  onPrimaryPress,
  onActionPress,
  actions,
}: {
  onPrimaryPress: () => void;
  onActionPress: (actionId: string) => void;
  actions: QuickAction[];
}) {
  return (
    <View pointerEvents="box-none" style={styles.dockWrap}>
      <View style={styles.dock}>
        <Pressable style={styles.primaryCta} onPress={onPrimaryPress}>
          <Text style={styles.primaryCtaLabel}>+ Nuevo lead</Text>
          <Text style={styles.primaryCtaHint}>Captura rapida</Text>
        </Pressable>

        <View style={styles.quickActions}>
          {actions.map((action) => (
            <Pressable
              key={action.id}
              style={styles.quickAction}
              onPress={() => onActionPress(action.id)}
            >
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatarShell: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    backgroundColor: palette.surfaceElevated,
    borderWidth: 1,
    borderColor: "rgba(63,255,139,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: palette.primary,
    fontSize: 15,
    fontWeight: "800",
  },
  brandCopy: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    color: palette.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.3,
    textTransform: "uppercase",
  },
  title: {
    color: palette.text,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  subtitle: {
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  statusShell: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: radii.full,
    backgroundColor: palette.primary,
  },
  statusText: {
    color: palette.textMuted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  dockWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: layout.tabBarHeight - 10,
    alignItems: "center",
  },
  dock: {
    width: "92%",
    borderRadius: 28,
    backgroundColor: "rgba(17,20,23,0.94)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: spacing.md,
    gap: spacing.md,
    shadowColor: palette.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 28,
    elevation: 10,
  },
  primaryCta: {
    borderRadius: radii.lg,
    backgroundColor: palette.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 58,
    justifyContent: "center",
  },
  primaryCtaLabel: {
    color: "#005d2c",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  primaryCtaHint: {
    color: "#005d2c",
    fontSize: 11,
    fontWeight: "700",
    opacity: 0.8,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  quickActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  quickAction: {
    flex: 1,
    minHeight: 44,
    borderRadius: radii.md,
    backgroundColor: palette.surfaceStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: {
    color: palette.text,
    fontSize: 12,
    fontWeight: "700",
  },
  bottomWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  bottomTabs: {
    minHeight: layout.tabBarHeight,
    borderRadius: 28,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  tabLabel: {
    color: palette.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  tabLabelActive: {
    color: palette.text,
  },
  tabDot: {
    width: 6,
    height: 6,
    borderRadius: radii.full,
    backgroundColor: "transparent",
  },
  tabDotActive: {
    backgroundColor: palette.primary,
  },
});
