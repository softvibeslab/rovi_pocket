import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { BottomTabs, FloatingUtilityRail, TopBar } from "./src/components/chrome";
import { DemoGuideOverlay, DemoIntroModal, DemoToast, QuickActionsSheet } from "./src/components/demo";
import {
  agendaItems as initialAgendaItems,
  brokerProfile,
  buildCopilotThread,
  copilotPrompts,
  demoFlowSteps,
  initialActivityFeed,
  leads as initialLeads,
  planCards,
  quickActions,
} from "./src/data/mock";
import {
  analyzeLeadWithApi,
  checkBackendHealth,
  createCalendarEvent,
  fetchCurrentUser,
  fetchDashboardStats,
  fetchLeadDetail,
  fetchLeads,
  fetchRecentActivity,
  fetchTodayEvents,
  generateLeadScript,
  loginWithBackend,
  PocketApiError,
} from "./src/lib/pocketApi";
import {
  mapApiLeadToPocketLead,
  mapApiUserToBrokerProfile,
  mapCalendarEventsToAgendaItems,
  mapRecentActivityToFeed,
  mergeLeadWithAnalysis,
} from "./src/lib/mappers";
import { clearSessionToken, persistSessionToken, readSessionToken } from "./src/lib/sessionStorage";
import { AuthScreen } from "./src/screens/AuthScreen";
import { AgendaScreen } from "./src/screens/AgendaScreen";
import { CopilotScreen } from "./src/screens/CopilotScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { LeadsScreen } from "./src/screens/LeadsScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { palette, spacing } from "./src/theme";
import { ActivityItem, AgendaItem, Lead, TabKey } from "./src/types";

const tabMeta: Record<
  TabKey,
  { eyebrow: string; title: string; subtitle: string }
> = {
  home: {
    eyebrow: "Rovi Pocket",
    title: "Tu dia se mueve desde aqui",
    subtitle: "Dashboard inteligente con foco, ritmo y cierre.",
  },
  leads: {
    eyebrow: "Pipeline",
    title: "Leads con prioridad real",
    subtitle: "Scoring, insight y acciones listas para tocar.",
  },
  agenda: {
    eyebrow: "Agenda",
    title: "Planeacion de alto impacto",
    subtitle: "Bloques tacticos, citas y follow-up del dia.",
  },
  copilot: {
    eyebrow: "Rovi AI",
    title: "Tu asistente comercial",
    subtitle: "Contexto de leads, agenda y scripts en una sola conversacion.",
  },
  profile: {
    eyebrow: "Broker OS",
    title: "Progreso y configuracion",
    subtitle: "Metas, rachas, integraciones y ritmo personal.",
  },
};

function buildFollowUpWindow(base = new Date()) {
  const start = new Date(base);
  start.setSeconds(0, 0);

  const nextQuarter = Math.ceil((start.getMinutes() + 5) / 15) * 15;
  if (nextQuarter >= 60) {
    start.setHours(start.getHours() + 1, 0, 0, 0);
  } else {
    start.setMinutes(nextQuarter);
  }

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 20);

  return { end, start };
}

function buildLocalFollowUpItem(lead: Lead): AgendaItem {
  const { end, start } = buildFollowUpWindow();

  return {
    id: `ag-local-${Date.now()}`,
    title: `Follow-up con ${lead.name}`,
    time: new Intl.DateTimeFormat("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(start),
    duration: `${Math.round((end.getTime() - start.getTime()) / 60000)} min`,
    type: "Follow-up",
    leadId: lead.id,
    leadName: lead.name,
    note: lead.nextAction,
    status: "next",
  };
}

export default function App() {
  const [bootstrapping, setBootstrapping] = useState(true);
  const [sessionMode, setSessionMode] = useState<"demo" | "live" | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [selectedLeadId, setSelectedLeadId] = useState(initialLeads[0]?.id ?? "");
  const [leads, setLeads] = useState(initialLeads);
  const [agendaItems, setAgendaItems] = useState(initialAgendaItems);
  const [activityFeed, setActivityFeed] = useState(initialActivityFeed);
  const [liveToken, setLiveToken] = useState<string | null>(null);
  const [liveProfile, setLiveProfile] = useState(brokerProfile);
  const [demoStepId, setDemoStepId] = useState(demoFlowSteps[0]?.id ?? "dashboard");
  const [guideStarted, setGuideStarted] = useState(false);
  const [showDemoIntro, setShowDemoIntro] = useState(true);
  const [showGuideOverlay, setShowGuideOverlay] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedLead = useMemo(() => {
    return leads.find((lead) => lead.id === selectedLeadId) ?? leads[0] ?? initialLeads[0];
  }, [leads, selectedLeadId]);

  const copilotThread = useMemo(() => buildCopilotThread(selectedLead), [selectedLead]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    let mounted = true;

    const restoreStoredSession = async () => {
      try {
        const storedToken = await readSessionToken();
        if (!mounted || !storedToken) {
          if (mounted) {
            setBootstrapping(false);
          }
          return;
        }

        const restored = await hydrateLiveSession(storedToken, {
          isRestore: true,
          silent: true,
        });

        if (!restored) {
          await clearSessionToken();
        }
      } catch {
        if (mounted) {
          setAuthError("No pude restaurar tu sesion anterior. Puedes entrar otra vez o usar demo.");
        }
      } finally {
        if (mounted) {
          setBootstrapping(false);
        }
      }
    };

    void restoreStoredSession();

    return () => {
      mounted = false;
    };
  }, []);

  const pushActivity = (title: string, detail: string, tone: ActivityItem["tone"] = "neutral") => {
    const newItem: ActivityItem = {
      id: `act-${Date.now()}`,
      title,
      detail,
      time: "Ahora",
      tone,
    };
    setActivityFeed((current) => [newItem, ...current].slice(0, 8));
  };

  const notify = (message: string) => {
    setToastMessage(message);
  };

  const enterDemoMode = () => {
    void clearSessionToken();
    setSessionMode("demo");
    setAuthError(null);
    setLiveToken(null);
    setLiveProfile(brokerProfile);
    setLeads(initialLeads);
    setSelectedLeadId(initialLeads[0]?.id ?? "");
    setAgendaItems(initialAgendaItems);
    setActivityFeed(initialActivityFeed);
    setShowDemoIntro(true);
    setDemoStepId("dashboard");
    setGuideStarted(false);
    setShowGuideOverlay(false);
    setShowQuickActions(false);
    setActiveTab("home");
  };

  const patchLead = (leadId: string, updater: (lead: Lead) => Lead) => {
    setLeads((current) => current.map((lead) => (lead.id === leadId ? updater(lead) : lead)));
  };

  const addAgendaItemLocally = (item: AgendaItem) => {
    setAgendaItems((current) => [
      item,
      ...current.map((existing) =>
        existing.status === "next" ? { ...existing, status: "today" as const } : existing,
      ),
    ]);
  };

  const refreshLiveLeadDetail = async (token: string, leadId: string) => {
    try {
      const detail = await fetchLeadDetail(token, leadId);
      const mapped = mapApiLeadToPocketLead(detail);
      setLeads((current) =>
        current.map((lead) => (lead.id === mapped.id ? { ...lead, ...mapped } : lead)),
      );
    } catch {
      // Keep the current UI stable if lead detail fails.
    }
  };

  const refreshLiveAgenda = async (token: string) => {
    try {
      const todayEvents = await fetchTodayEvents(token);
      setAgendaItems(mapCalendarEventsToAgendaItems(todayEvents));
    } catch {
      // Keep the current agenda visible if refresh fails.
    }
  };

  const hydrateLiveSession = async (
    token: string,
    options: { isRestore?: boolean; silent?: boolean } = {},
  ) => {
    try {
      const [user, stats, liveLeads, recentActivity, todayEvents] = await Promise.all([
        fetchCurrentUser(token),
        fetchDashboardStats(token).catch(() => null),
        fetchLeads(token),
        fetchRecentActivity(token).catch(() => null),
        fetchTodayEvents(token).catch(() => null),
      ]);

      const mappedLeads = liveLeads.length > 0 ? liveLeads.map(mapApiLeadToPocketLead) : initialLeads;
      setLiveToken(token);
      setSessionMode("live");
      setLiveProfile(mapApiUserToBrokerProfile(user, stats ?? undefined));
      setLeads(mappedLeads);
      setSelectedLeadId((current) =>
        mappedLeads.some((lead) => lead.id === current)
          ? current
          : (mappedLeads[0]?.id ?? initialLeads[0].id),
      );
      setAgendaItems(
        todayEvents ? mapCalendarEventsToAgendaItems(todayEvents) : initialAgendaItems,
      );
      setActivityFeed(
        recentActivity ? mapRecentActivityToFeed(recentActivity) : initialActivityFeed,
      );
      setActiveTab("home");
      setShowDemoIntro(false);
      setDemoStepId("dashboard");
      setGuideStarted(false);
      setShowGuideOverlay(false);
      setShowQuickActions(false);
      setAuthError(null);

      if (!options.silent) {
        notify(
          options.isRestore
            ? "Sesion restaurada y Pocket quedo conectado."
            : "Sesion conectada al backend real.",
        );
      }

      return true;
    } catch (error) {
      setSessionMode(null);
      setLiveToken(null);
      setLiveProfile(brokerProfile);
      setLeads(initialLeads);
      setSelectedLeadId(initialLeads[0]?.id ?? "");
      setAgendaItems(initialAgendaItems);
      setActivityFeed(initialActivityFeed);

      if (error instanceof PocketApiError && error.status === 401) {
        setAuthError("Tu sesion expiro. Inicia de nuevo para reconectar Pocket.");
      } else if (error instanceof PocketApiError) {
        setAuthError(error.message);
      } else {
        setAuthError(
          "No fue posible cargar tu sesion real. Puedes volver a intentar o entrar en modo demo.",
        );
      }

      return false;
    }
  };

  const loginWithRealBackend = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      await checkBackendHealth();
      const auth = await loginWithBackend(email, password);
      const hydrated = await hydrateLiveSession(auth.access_token);

      if (hydrated) {
        await persistSessionToken(auth.access_token);
      }
    } catch (error) {
      if (error instanceof PocketApiError) {
        setAuthError(error.message);
      } else {
        setAuthError(
          "No fue posible conectar con el backend. Puedes entrar en modo demo mientras lo levantamos.",
        );
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const openLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    setActiveTab("leads");
    setDemoStepId("leads");
    if (liveToken && sessionMode === "live") {
      void refreshLiveLeadDetail(liveToken, leadId);
    }
  };

  const askAIForLead = (leadId: string) => {
    const lead = leads.find((item) => item.id === leadId);
    setSelectedLeadId(leadId);
    setActiveTab("copilot");
    setDemoStepId("copilot");
    notify("Rovi AI ya esta cargando contexto del lead.");
    if (liveToken && sessionMode === "live") {
      void (async () => {
        try {
          const analysis = await analyzeLeadWithApi(liveToken, leadId);
          patchLead(leadId, (current) => mergeLeadWithAnalysis(current, analysis));
          if (lead) {
            pushActivity(
              "Contexto IA actualizado",
              `Rovi AI analizo a ${lead.name} con datos reales del backend.`,
              "secondary",
            );
          }
          notify("Analisis IA actualizado desde el backend.");
        } catch {
          await refreshLiveLeadDetail(liveToken, leadId);
        }
      })();
    }
  };

  const createTaskForLead = (leadId: string) => {
    const lead = leads.find((item) => item.id === leadId);
    if (!lead) return;
    setActiveTab("agenda");
    setDemoStepId("agenda");

    const localAgendaItem = buildLocalFollowUpItem(lead);

    if (liveToken && sessionMode === "live") {
      void (async () => {
        try {
          const { end, start } = buildFollowUpWindow();
          const created = await createCalendarEvent(liveToken, {
            title: `Follow-up con ${lead.name}`,
            description: lead.nextAction,
            event_type: "seguimiento",
            lead_id: lead.id,
            start_time: start.toISOString(),
            end_time: end.toISOString(),
            reminder_minutes: 30,
          });

          await refreshLiveAgenda(liveToken);
          pushActivity(
            "Follow-up creado",
            created.synced_to_google
              ? `${lead.name} ya quedo en agenda real y sincronizado con Google.`
              : `${lead.name} ya quedo en agenda real de Pocket.`,
            created.synced_to_google ? "primary" : "secondary",
          );
          notify(
            created.synced_to_google
              ? `Follow-up creado y sincronizado para ${lead.name}.`
              : `Follow-up real creado para ${lead.name}.`,
          );
        } catch {
          addAgendaItemLocally(localAgendaItem);
          pushActivity(
            "Follow-up local",
            `No se pudo sincronizar el backend para ${lead.name}; deje el bloque en la app.`,
            "secondary",
          );
          notify("No pude crear el evento real; deje un bloque local en agenda.");
        }
      })();
      return;
    }

    addAgendaItemLocally(localAgendaItem);
    pushActivity("Tarea creada desde IA", `Follow-up agendado para ${lead.name}.`, "secondary");
    notify(`Tarea demo creada para ${lead.name}.`);
  };

  const useScriptForLead = (leadId: string) => {
    const lead = leads.find((item) => item.id === leadId);
    if (!lead) return;
    if (liveToken && sessionMode === "live") {
      void (async () => {
        try {
          const response = await generateLeadScript(liveToken, leadId);
          patchLead(leadId, (current) => ({
            ...current,
            script: response.script,
            lastTouch: "Ahora",
          }));
          pushActivity("Script generado", `Se actualizo el mensaje para ${lead.name}.`, "primary");
          notify(`Guion actualizado para ${lead.name}.`);
        } catch {
          notify("No pude generar el script real; se mantuvo el flujo local.");
        }
      })();
      return;
    }

    patchLead(leadId, (current) => ({
      ...current,
      lastTouch: "Ahora",
      stage: current.stage === "Nuevo" ? "Seguimiento" : current.stage,
    }));
    pushActivity("Script aplicado", `Se preparo un mensaje para ${lead.name}.`, "primary");
    notify(`Guion demo listo para ${lead.name}.`);
  };

  const markFollowUp = (leadId: string) => {
    const lead = leads.find((item) => item.id === leadId);
    if (!lead) return;
    patchLead(leadId, (current) => ({ ...current, lastTouch: "Hace 1m" }));
    pushActivity("Follow-up marcado", `${lead.name} ya quedo tocado dentro del demo.`, "primary");
    notify(`Seguimiento registrado para ${lead.name}.`);
  };

  const handleQuickAction = (actionId: string) => {
    setShowQuickActions(false);
    if (actionId === "new-lead") {
      setActiveTab("leads");
      pushActivity("Nuevo lead express", "Se abriria el formulario rapido de captura.", "primary");
      notify("Mockup: formulario de nuevo lead.");
      return;
    }
    if (actionId === "import") {
      setActiveTab("leads");
      pushActivity("Importacion demo", "Flujo de CSV/contactos listo para la siguiente iteracion.", "secondary");
      notify("Mockup: importacion desde telefono o CSV.");
      return;
    }
    if (actionId === "note") {
      pushActivity("Nota rapida", "Se creo una nota demo desde el dock principal.", "neutral");
      notify("Nota demo agregada al broker.");
      return;
    }
    if (actionId === "event") {
      createTaskForLead(selectedLead.id);
    }
  };

  const jumpToDemoStep = (stepId: string) => {
    const step = demoFlowSteps.find((item) => item.id === stepId);
    if (!step) return;
    setDemoStepId(stepId);
    setActiveTab(step.tab);
  };

  const startDemo = () => {
    setShowDemoIntro(false);
    setGuideStarted(true);
    setShowGuideOverlay(true);
    setShowQuickActions(false);
    setActiveTab("home");
    setDemoStepId("dashboard");
    notify("Demo guiada iniciada.");
  };

  const enterWithoutGuide = () => {
    setShowDemoIntro(false);
    setGuideStarted(false);
    setShowGuideOverlay(false);
    setShowQuickActions(false);
    notify("La guia y los atajos quedan disponibles por separado en los botones flotantes.");
  };

  const openGuide = () => {
    const matchingStep = demoFlowSteps.find((step) => step.tab === activeTab);
    setDemoStepId(matchingStep?.id ?? demoStepId);
    setGuideStarted(true);
    setShowGuideOverlay(true);

    if (!guideStarted) {
      notify("Guia activada. Puedes cerrarla y retomarla cuando quieras.");
    }
  };

  const handleGuideStepSelect = (stepId: string) => {
    setGuideStarted(true);
    setShowGuideOverlay(true);
    jumpToDemoStep(stepId);
  };

  const continueDemo = () => {
    if (demoStepId === "dashboard") {
      openLead(selectedLead.id);
      return;
    }
    if (demoStepId === "leads") {
      askAIForLead(selectedLead.id);
      return;
    }
    if (demoStepId === "copilot") {
      createTaskForLead(selectedLead.id);
      return;
    }
    if (demoStepId === "agenda") {
      setActiveTab("profile");
      setDemoStepId("profile");
      notify("Ahora revisa progreso, integraciones y estado general.");
      return;
    }
    setActiveTab("home");
    setDemoStepId("dashboard");
    setGuideStarted(false);
    setShowGuideOverlay(false);
    notify("Guia reiniciada. Puedes abrirla otra vez desde el boton flotante.");
  };

  const currentTab = tabMeta[activeTab];

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    const matchingStep = demoFlowSteps.find((step) => step.tab === tab);
    if (matchingStep) {
      setDemoStepId(matchingStep.id);
    }
  };

  const resetSession = () => {
    void clearSessionToken();
    setSessionMode(null);
    setAuthError(null);
    setAuthLoading(false);
    setLiveToken(null);
    setLiveProfile(brokerProfile);
    setLeads(initialLeads);
    setSelectedLeadId(initialLeads[0]?.id ?? "");
    setActivityFeed(initialActivityFeed);
    setAgendaItems(initialAgendaItems);
    setShowDemoIntro(true);
    setDemoStepId("dashboard");
    setGuideStarted(false);
    setShowGuideOverlay(false);
    setShowQuickActions(false);
    setActiveTab("home");
  };

  if (bootstrapping) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <View style={styles.loadingShell}>
          <ActivityIndicator color={palette.primary} size="large" />
          <Text style={styles.loadingTitle}>Reconectando Rovi Pocket</Text>
          <Text style={styles.loadingBody}>
            Estamos restaurando la sesion y cargando lo mas importante del broker.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!sessionMode) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <AuthScreen
          loading={authLoading}
          error={authError}
          onLogin={loginWithRealBackend}
          onDemoMode={enterDemoMode}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.app}>
        <DemoToast message={toastMessage} />
        <TopBar
          eyebrow={currentTab.eyebrow}
          title={currentTab.title}
          subtitle={
            sessionMode === "live"
              ? `${currentTab.subtitle} · conectado al backend real`
              : `${currentTab.subtitle} · modo demo`
          }
          brokerName={liveProfile.name}
        />

        <View style={styles.screenFrame}>
          {activeTab === "home" && (
            <DashboardScreen
              brokerProfile={liveProfile}
              leads={leads}
              agendaItems={agendaItems}
              planCards={planCards}
              activityFeed={activityFeed}
              selectedLead={selectedLead}
              onLeadPress={openLead}
              onAskAI={askAIForLead}
              onUseScript={useScriptForLead}
              onCreateTask={createTaskForLead}
              onOpenAgenda={() => {
                setActiveTab("agenda");
                setDemoStepId("agenda");
              }}
            />
          )}
          {activeTab === "leads" && (
            <LeadsScreen
              leads={leads}
              selectedLead={selectedLead}
              onLeadSelect={setSelectedLeadId}
              onAskAI={askAIForLead}
              onCreateTask={createTaskForLead}
              onMarkFollowUp={markFollowUp}
            />
          )}
          {activeTab === "agenda" && (
            <AgendaScreen
              agendaItems={agendaItems}
              planCards={planCards}
              selectedLead={selectedLead}
              onLeadPress={openLead}
            />
          )}
          {activeTab === "copilot" && (
            <CopilotScreen
              prompts={copilotPrompts}
              thread={copilotThread}
              selectedLead={selectedLead}
              onLeadPress={openLead}
              onCreateTask={createTaskForLead}
              onUseScript={useScriptForLead}
            />
          )}
          {activeTab === "profile" && (
            <ProfileScreen
              activityFeed={activityFeed}
              brokerProfile={liveProfile}
              sessionMode={sessionMode}
              onResetSession={resetSession}
            />
          )}
        </View>

        <DemoGuideOverlay
          visible={showGuideOverlay && sessionMode === "demo"}
          guideStarted={guideStarted}
          steps={demoFlowSteps}
          activeStepId={demoStepId}
          onClose={() => setShowGuideOverlay(false)}
          onSelectStep={handleGuideStepSelect}
          onContinue={continueDemo}
        />
        <FloatingUtilityRail
          showGuide={sessionMode === "demo"}
          guideStarted={guideStarted}
          guideVisible={showGuideOverlay}
          steps={demoFlowSteps}
          activeStepId={demoStepId}
          onGuidePress={openGuide}
          onShortcutsPress={() => setShowQuickActions(true)}
        />
        <BottomTabs activeTab={activeTab} onChange={handleTabChange} />
        <QuickActionsSheet
          visible={showQuickActions}
          actions={quickActions}
          onClose={() => setShowQuickActions(false)}
          onSelectAction={handleQuickAction}
        />
        <DemoIntroModal
          visible={showDemoIntro && sessionMode === "demo"}
          onStart={startDemo}
          onSkip={enterWithoutGuide}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  app: {
    flex: 1,
    backgroundColor: palette.background,
  },
  screenFrame: {
    flex: 1,
  },
  loadingShell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  loadingTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  loadingBody: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
});
