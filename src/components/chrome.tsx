import { Pressable, StyleSheet, Text, View } from "react-native";

import { layout, palette, radii, spacing } from "../theme";
import { DemoStep, TabKey } from "../types";

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

export function FloatingUtilityRail({
  showGuide,
  guideStarted,
  guideVisible,
  steps,
  activeStepId,
  onGuidePress,
  onShortcutsPress,
}: {
  showGuide: boolean;
  guideStarted: boolean;
  guideVisible: boolean;
  steps: DemoStep[];
  activeStepId: string;
  onGuidePress: () => void;
  onShortcutsPress: () => void;
}) {
  const activeIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === activeStepId),
  );

  return (
    <View pointerEvents="box-none" style={styles.utilityRail}>
      {showGuide ? (
        <Pressable style={styles.utilityButton} onPress={onGuidePress}>
          <View style={[styles.utilityIconWrap, styles.guideIconWrap]}>
            <Text style={styles.guideIcon}>?</Text>
            {!guideVisible ? <View style={styles.utilityBadge} /> : null}
          </View>
          <View style={styles.utilityCopy}>
            <Text style={styles.utilityTitle}>Guia</Text>
            <Text style={styles.utilityBody}>
              {guideStarted ? `Paso ${activeIndex + 1}/${steps.length}` : "Disponible"}
            </Text>
          </View>
        </Pressable>
      ) : null}

      <Pressable style={styles.utilityButton} onPress={onShortcutsPress}>
        <View style={styles.utilityIconWrap}>
          <Text style={styles.utilityIcon}>+</Text>
        </View>
        <View style={styles.utilityCopy}>
          <Text style={styles.utilityTitle}>Atajos</Text>
          <Text style={styles.utilityBody}>Abrir popup</Text>
        </View>
      </Pressable>
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
  utilityRail: {
    position: "absolute",
    right: spacing.xl,
    bottom: layout.tabBarHeight + spacing.md,
    gap: spacing.sm,
  },
  utilityButton: {
    minHeight: 58,
    borderRadius: radii.full,
    backgroundColor: "rgba(17,20,23,0.96)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    shadowColor: palette.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 10,
  },
  utilityIconWrap: {
    width: 38,
    height: 38,
    borderRadius: radii.full,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  guideIconWrap: {
    backgroundColor: palette.tertiary,
  },
  utilityIcon: {
    color: "#005d2c",
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 20,
  },
  guideIcon: {
    color: "#04394c",
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 18,
  },
  utilityBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: radii.full,
    backgroundColor: palette.secondary,
  },
  utilityCopy: {
    gap: 2,
  },
  utilityTitle: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "800",
  },
  utilityBody: {
    color: palette.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
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
