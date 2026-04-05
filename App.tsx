import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";

type TabKey = "home" | "leads" | "agenda" | "copilot" | "profile";

type Lead = {
  id: string;
  name: string;
  stage: string;
  score: number;
  source: string;
  nextAction: string;
  lastTouch: string;
};

type AgendaItem = {
  id: string;
  title: string;
  time: string;
  type: string;
  leadName: string;
};

const colors = {
  background: "#F4F1EC",
  surface: "#FFFFFF",
  ink: "#102A24",
  muted: "#667A73",
  line: "#DFD8CF",
  primary: "#0D9488",
  secondary: "#4D7C0F",
  accent: "#D97706",
  danger: "#C2410C",
  chipBg: "#E7F7F5",
};

const leads: Lead[] = [
  {
    id: "lead-01",
    name: "Ricardo Salinas",
    stage: "Calificacion",
    score: 88,
    source: "WhatsApp",
    nextAction: "Mandar brochure y agendar llamada",
    lastTouch: "Hace 3 horas",
  },
  {
    id: "lead-02",
    name: "Mariana Torres",
    stage: "Presentacion",
    score: 74,
    source: "Landing",
    nextAction: "Confirmar visita para manana",
    lastTouch: "Ayer",
  },
  {
    id: "lead-03",
    name: "Alejandro Ruiz",
    stage: "Nuevo",
    score: 67,
    source: "CSV importado",
    nextAction: "Primer contacto en menos de 2 horas",
    lastTouch: "Nunca",
  },
];

const agenda: AgendaItem[] = [
  {
    id: "evt-01",
    title: "Llamada de descubrimiento",
    time: "10:00",
    type: "Llamada",
    leadName: "Ricardo Salinas",
  },
  {
    id: "evt-02",
    title: "Visita al desarrollo",
    time: "13:30",
    type: "Visita",
    leadName: "Mariana Torres",
  },
  {
    id: "evt-03",
    title: "Seguimiento por WhatsApp",
    time: "18:00",
    type: "Follow-up",
    leadName: "Alejandro Ruiz",
  },
];

function App() {
  const [tab, setTab] = useState<TabKey>("home");
  const [query, setQuery] = useState("");

  const filteredLeads = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return leads;
    return leads.filter((lead) => {
      return (
        lead.name.toLowerCase().includes(term) ||
        lead.stage.toLowerCase().includes(term) ||
        lead.source.toLowerCase().includes(term)
      );
    });
  }, [query]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.app}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.eyebrow}>Rovi Pocket</Text>
            <Text style={styles.title}>
              {tab === "home" && "Tu dia, claro y accionable"}
              {tab === "leads" && "Leads en movimiento"}
              {tab === "agenda" && "Agenda comercial"}
              {tab === "copilot" && "Tu asistente IA"}
              {tab === "profile" && "Perfil y progreso"}
            </Text>
          </View>
          <View style={styles.notificationDot} />
        </View>

        <View style={styles.content}>
          {tab === "home" && <HomeScreen />}
          {tab === "leads" && (
            <LeadsScreen query={query} setQuery={setQuery} leads={filteredLeads} />
          )}
          {tab === "agenda" && <AgendaScreen />}
          {tab === "copilot" && <CopilotScreen />}
          {tab === "profile" && <ProfileScreen />}
        </View>

        <View style={styles.fabDock}>
          <Pressable style={styles.fabPrimary}>
            <Text style={styles.fabPrimaryText}>+ Nuevo lead</Text>
          </Pressable>
          <View style={styles.fabMiniGroup}>
            <MiniAction label="Importar" />
            <MiniAction label="Nota" />
            <MiniAction label="Evento" />
          </View>
        </View>

        <BottomTabs activeTab={tab} onChange={setTab} />
      </View>
    </SafeAreaView>
  );
}

function HomeScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <SectionCard>
        <Text style={styles.cardEyebrow}>Briefing del dia</Text>
        <Text style={styles.cardTitle}>Hoy tu mayor oportunidad esta en Ricardo Salinas.</Text>
        <Text style={styles.cardBody}>
          Tiene score alto, interactuo hoy y su siguiente mejor accion es enviar brochure y
          cerrar llamada antes de las 12:00.
        </Text>
        <View style={styles.inlineActions}>
          <ActionChip label="Abrir lead" tone="primary" />
          <ActionChip label="Preguntar a IA" tone="neutral" />
        </View>
      </SectionCard>

      <View style={styles.kpiRow}>
        <KpiCard label="Meta mes" value="2/5" caption="cierres proyectados" tone="primary" />
        <KpiCard label="Follow-up" value="78%" caption="SLA en 24h" tone="secondary" />
      </View>

      <View style={styles.kpiRow}>
        <KpiCard label="Pipeline" value="$8.4M" caption="valor ponderado" tone="accent" />
        <KpiCard label="Streak" value="6 dias" caption="actividad comercial" tone="primary" />
      </View>

      <SectionCard>
        <Text style={styles.cardEyebrow}>Top 3 leads del dia</Text>
        {leads.map((lead) => (
          <LeadRow key={lead.id} lead={lead} compact />
        ))}
      </SectionCard>

      <SectionCard>
        <Text style={styles.cardEyebrow}>Citas de hoy</Text>
        {agenda.map((item) => (
          <AgendaRow key={item.id} item={item} />
        ))}
      </SectionCard>
    </ScrollView>
  );
}

function LeadsScreen({
  query,
  setQuery,
  leads,
}: {
  query: string;
  setQuery: (value: string) => void;
  leads: Lead[];
}) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.searchCard}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar lead, etapa o fuente"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
        />
        <View style={styles.filterRow}>
          <FilterChip label="Todos" active />
          <FilterChip label="Calientes" />
          <FilterChip label="Estancados" />
          <FilterChip label="Hoy" />
        </View>
      </View>

      <SectionCard>
        <Text style={styles.cardEyebrow}>Pipeline rapido</Text>
        {leads.map((lead) => (
          <LeadRow key={lead.id} lead={lead} />
        ))}
      </SectionCard>
    </ScrollView>
  );
}

function AgendaScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <SectionCard>
        <Text style={styles.cardEyebrow}>Hoy, sabado 5 de abril</Text>
        {agenda.map((item) => (
          <AgendaRow key={item.id} item={item} />
        ))}
      </SectionCard>

      <SectionCard>
        <Text style={styles.cardEyebrow}>Sugerencias del planner</Text>
        <Text style={styles.cardBody}>
          Reserva 30 minutos a las 16:30 para reactivar 3 leads sin seguimiento de los ultimos
          5 dias. Eso mejora tu cumplimiento semanal y protege tu meta de citas.
        </Text>
        <View style={styles.inlineActions}>
          <ActionChip label="Crear bloque" tone="primary" />
          <ActionChip label="Ver leads" tone="neutral" />
        </View>
      </SectionCard>
    </ScrollView>
  );
}

function CopilotScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <SectionCard>
        <Text style={styles.cardEyebrow}>Prompts sugeridos</Text>
        <View style={styles.promptGrid}>
          <PromptCard label="A quien debo contactar hoy?" />
          <PromptCard label="Resume mi pipeline de la semana" />
          <PromptCard label="Genera un script para Ricardo" />
          <PromptCard label="Que citas tengo y como me preparo?" />
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={styles.cardEyebrow}>Conversacion activa</Text>
        <ChatBubble
          role="user"
          text="Dame las tres mejores acciones para cerrar algo esta semana."
        />
        <ChatBubble
          role="assistant"
          text="1. Cierra la llamada de seguimiento con Ricardo antes de las 12:00. 2. Confirma la visita de Mariana hoy mismo. 3. Haz primer contacto con Alejandro hoy para no perder velocidad."
        />
        <View style={styles.inlineActions}>
          <ActionChip label="Abrir Ricardo" tone="primary" />
          <ActionChip label="Crear tarea" tone="neutral" />
        </View>
      </SectionCard>

      <View style={styles.composerCard}>
        <Text style={styles.composerLabel}>Escribe o dicta algo al agente IA</Text>
        <View style={styles.composerBox}>
          <Text style={styles.composerPlaceholder}>
            "Que leads llevan mas de 5 dias sin seguimiento?"
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function ProfileScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <SectionCard>
        <Text style={styles.cardEyebrow}>Broker profile</Text>
        <Text style={styles.cardTitle}>Carlos Mendoza</Text>
        <Text style={styles.cardBody}>
          Broker individual enfocado en Tulum. Meta actual: 5 cierres mensuales y 12 citas por
          semana.
        </Text>
      </SectionCard>

      <SectionCard>
        <Text style={styles.cardEyebrow}>Progreso personal</Text>
        <ProgressRow label="Cierres del mes" value="2/5" />
        <ProgressRow label="Citas de la semana" value="7/12" />
        <ProgressRow label="Follow-up SLA" value="78%" />
      </SectionCard>

      <SectionCard>
        <Text style={styles.cardEyebrow}>Integraciones clave</Text>
        <IntegrationRow name="Google Calendar" status="Conectado" />
        <IntegrationRow name="WhatsApp workflows" status="Pendiente" />
        <IntegrationRow name="Landing del broker" status="En configuracion" />
      </SectionCard>
    </ScrollView>
  );
}

function BottomTabs({
  activeTab,
  onChange,
}: {
  activeTab: TabKey;
  onChange: (value: TabKey) => void;
}) {
  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "home", label: "Inicio" },
    { key: "leads", label: "Leads" },
    { key: "agenda", label: "Agenda" },
    { key: "copilot", label: "IA" },
    { key: "profile", label: "Perfil" },
  ];

  return (
    <View style={styles.tabs}>
      {tabs.map((item) => {
        const active = item.key === activeTab;
        return (
          <Pressable key={item.key} onPress={() => onChange(item.key)} style={styles.tabButton}>
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{item.label}</Text>
            <View style={[styles.tabDot, active && styles.tabDotActive]} />
          </Pressable>
        );
      })}
    </View>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <View style={styles.sectionCard}>{children}</View>;
}

function KpiCard({
  label,
  value,
  caption,
  tone,
}: {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "accent";
}) {
  const toneStyle =
    tone === "primary"
      ? styles.kpiPrimary
      : tone === "secondary"
        ? styles.kpiSecondary
        : styles.kpiAccent;

  return (
    <View style={[styles.kpiCard, toneStyle]}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiCaption}>{caption}</Text>
    </View>
  );
}

function FilterChip({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <View style={[styles.filterChip, active && styles.filterChipActive]}>
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{label}</Text>
    </View>
  );
}

function ActionChip({
  label,
  tone,
}: {
  label: string;
  tone: "primary" | "neutral";
}) {
  return (
    <Pressable style={[styles.actionChip, tone === "primary" && styles.actionChipPrimary]}>
      <Text style={[styles.actionChipText, tone === "primary" && styles.actionChipTextPrimary]}>
        {label}
      </Text>
    </Pressable>
  );
}

function MiniAction({ label }: { label: string }) {
  return (
    <View style={styles.fabMini}>
      <Text style={styles.fabMiniText}>{label}</Text>
    </View>
  );
}

function LeadRow({ lead, compact = false }: { lead: Lead; compact?: boolean }) {
  return (
    <View style={[styles.leadRow, compact && styles.leadRowCompact]}>
      <View style={styles.leadHeaderRow}>
        <Text style={styles.leadName}>{lead.name}</Text>
        <Text style={styles.leadScore}>{lead.score}</Text>
      </View>
      <View style={styles.leadMetaRow}>
        <MetaPill text={lead.stage} />
        <MetaPill text={lead.source} />
        <MetaPill text={lead.lastTouch} />
      </View>
      <Text style={styles.leadNextAction}>{lead.nextAction}</Text>
    </View>
  );
}

function MetaPill({ text }: { text: string }) {
  return (
    <View style={styles.metaPill}>
      <Text style={styles.metaPillText}>{text}</Text>
    </View>
  );
}

function AgendaRow({ item }: { item: AgendaItem }) {
  return (
    <View style={styles.agendaRow}>
      <View style={styles.agendaTimeBox}>
        <Text style={styles.agendaTime}>{item.time}</Text>
      </View>
      <View style={styles.agendaBody}>
        <Text style={styles.agendaTitle}>{item.title}</Text>
        <Text style={styles.agendaMeta}>
          {item.type} · {item.leadName}
        </Text>
      </View>
    </View>
  );
}

function PromptCard({ label }: { label: string }) {
  return (
    <View style={styles.promptCard}>
      <Text style={styles.promptText}>{label}</Text>
    </View>
  );
}

function ChatBubble({ role, text }: { role: "user" | "assistant"; text: string }) {
  const bubbleStyle = role === "user" ? styles.chatBubbleUser : styles.chatBubbleAssistant;
  const textStyle = role === "user" ? styles.chatBubbleUserText : styles.chatBubbleAssistantText;

  return (
    <View style={[styles.chatBubble, bubbleStyle]}>
      <Text style={textStyle}>{text}</Text>
    </View>
  );
}

function ProgressRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.progressRow}>
      <Text style={styles.progressLabel}>{label}</Text>
      <Text style={styles.progressValue}>{value}</Text>
    </View>
  );
}

function IntegrationRow({ name, status }: { name: string; status: string }) {
  return (
    <View style={styles.integrationRow}>
      <Text style={styles.integrationName}>{name}</Text>
      <Text style={styles.integrationStatus}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  app: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrow: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 4,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    color: colors.ink,
    maxWidth: 280,
  },
  notificationDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 140,
    gap: 14,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 12,
  },
  cardEyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: colors.primary,
  },
  cardTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "800",
    color: colors.ink,
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
  },
  inlineActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  actionChipPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.ink,
  },
  actionChipTextPrimary: {
    color: "#FFFFFF",
  },
  kpiRow: {
    flexDirection: "row",
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    borderRadius: 22,
    padding: 16,
    minHeight: 122,
    justifyContent: "space-between",
  },
  kpiPrimary: {
    backgroundColor: "#D7F3F0",
  },
  kpiSecondary: {
    backgroundColor: "#EEF5DE",
  },
  kpiAccent: {
    backgroundColor: "#FAECD7",
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.ink,
  },
  kpiCaption: {
    fontSize: 13,
    color: colors.muted,
  },
  searchCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 12,
  },
  searchInput: {
    backgroundColor: "#F7F4EF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.ink,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F3EEE8",
  },
  filterChipActive: {
    backgroundColor: colors.ink,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.muted,
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  leadRow: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "#FCFBF8",
    gap: 10,
  },
  leadRowCompact: {
    backgroundColor: "#FFFFFF",
  },
  leadHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leadName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.ink,
  },
  leadScore: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primary,
  },
  leadMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metaPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.chipBg,
  },
  metaPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.ink,
  },
  leadNextAction: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  agendaRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  agendaTimeBox: {
    width: 62,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "#EFF7F6",
    alignItems: "center",
  },
  agendaTime: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primary,
  },
  agendaBody: {
    flex: 1,
    paddingVertical: 4,
    gap: 4,
  },
  agendaTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.ink,
  },
  agendaMeta: {
    fontSize: 13,
    color: colors.muted,
  },
  promptGrid: {
    gap: 10,
  },
  promptCard: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#F7F3EE",
    borderWidth: 1,
    borderColor: colors.line,
  },
  promptText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: colors.ink,
  },
  chatBubble: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    maxWidth: "92%",
  },
  chatBubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: colors.ink,
  },
  chatBubbleAssistant: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF8F6",
  },
  chatBubbleUserText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
  },
  chatBubbleAssistantText: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
  },
  composerCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 10,
  },
  composerLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
  },
  composerBox: {
    borderRadius: 18,
    backgroundColor: "#F6F2EC",
    padding: 16,
  },
  composerPlaceholder: {
    fontSize: 14,
    color: colors.muted,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.ink,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primary,
  },
  integrationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  integrationName: {
    fontSize: 14,
    color: colors.ink,
  },
  integrationStatus: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.secondary,
  },
  fabDock: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 84,
    gap: 10,
  },
  fabPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  fabPrimaryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  fabMiniGroup: {
    flexDirection: "row",
    gap: 10,
  },
  fabMini: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 12,
    alignItems: "center",
  },
  fabMiniText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.ink,
  },
  tabs: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: "#FFFDF9",
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
  },
  tabLabelActive: {
    color: colors.ink,
  },
  tabDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: "transparent",
  },
  tabDotActive: {
    backgroundColor: colors.primary,
  },
});

export default App;
