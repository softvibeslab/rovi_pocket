import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import { BottomTabs, FloatingActionDock, TopBar } from "./src/components/chrome";
import { DemoIntroModal, DemoProgressCard, DemoToast, QuickActionSheet } from "./src/components/demo";
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
import { checkBackendHealth, fetchDashboardStats, fetchLeads, fetchRecentActivity, fetchLeadDetail, fetchCurrentUser, generateLeadScript, loginWithBackend, PocketApiError } from "./src/lib/pocketApi";
import { mapApiLeadToPocketLead, mapApiUserToBrokerProfile, mapRecentActivityToFeed } from "./src/lib/mappers";
import { AuthScreen } from "./src/screens/AuthScreen";
import { AgendaScreen } from "./src/screens/AgendaScreen";
import { CopilotScreen } from "./src/screens/CopilotScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { LeadsScreen } from "./src/screens/LeadsScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { palette } from "./src/theme";
import { ActivityItem, Lead, TabKey } from "./src/types";

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

export default function App() {
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
  const [showDemoIntro, setShowDemoIntro] = useState(true);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedLead = useMemo(() => {
    return leads.find((lead) => lead.id === selectedLeadId) ?? leads[0];
  }, [leads, selectedLeadId]);

  const copilotThread = useMemo(() => buildCopilotThread(selectedLead), [selectedLead]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

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
    setSessionMode("demo");
    setAuthError(null);
    setLiveToken(null);
    setLiveProfile(brokerProfile);
    setLeads(initialLeads);
    setAgendaItems(initialAgendaItems);
    setActivityFeed(initialActivityFeed);
    setShowDemoIntro(true);
    setDemoStepId("dashboard");
    setActiveTab("home");
  };

  const patchLead = (leadId: string, updater: (lead: Lead) => Lead) => {
    setLeads((current) => current.map((lead) => (lead.id === leadId ? updater(lead) : lead)));
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

  const loginWithRealBackend = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      await checkBackendHealth();
      const auth = await loginWithBackend(email, password);
      const token = auth.access_token;
      const [user, stats, liveLeads, recentActivity] = await Promise.all([
        fetchCurrentUser(token),
        fetchDashboardStats(token).catch(() => null),
        fetchLeads(token),
        fetchRecentActivity(token).catch(() => []),
      ]);

      const mappedLeads = liveLeads.length > 0 ? liveLeads.map(mapApiLeadToPocketLead) : initialLeads;
      setLiveToken(token);
      setSessionMode("live");
      setLiveProfile(mapApiUserToBrokerProfile(user, stats ?? undefined));
      setLeads(mappedLeads);
      setSelectedLeadId(mappedLeads[0]?.id ?? initialLeads[0].id);
      setActivityFeed(
        recentActivity.length > 0 ? mapRecentActivityToFeed(recentActivity) : initialActivityFeed,
      );
      setActiveTab("home");
      setShowDemoIntro(false);
      setDemoStepId("dashboard");
      notify("Sesion conectada al backend real.");
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
    setSelectedLeadId(leadId);
    setActiveTab("copilot");
    setDemoStepId("copilot");
    notify("Rovi AI ya esta cargando contexto del lead.");
    if (liveToken && sessionMode === "live") {
      void refreshLiveLeadDetail(liveToken, leadId);
    }
  };

  const createTaskForLead = (leadId: string) => {
    const lead = leads.find((item) => item.id === leadId);
    if (!lead) return;
    setActiveTab("agenda");
    setDemoStepId("agenda");
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
    setShowActionSheet(false);
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
      setActiveTab("agenda");
      pushActivity("Evento demo", "Se creo un bloque tactico nuevo en agenda.", "secondary");
      notify("Evento demo creado en agenda.");
    }
  };

  const jumpToDemoStep = (stepId: string) => {
    const step = demoFlowSteps.find((item) => item.id === stepId);
    if (!step) return;
    setDemoStepId(stepId);
    setActiveTab(step.tab);
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
    setShowDemoIntro(true);
  };

  const startDemo = () => {
    setShowDemoIntro(false);
    setActiveTab("home");
    setDemoStepId("dashboard");
    notify("Demo guiada iniciada.");
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
    setActiveTab("home");
  };

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
        <DemoProgressCard
          steps={demoFlowSteps}
          activeStepId={demoStepId}
          onSelectStep={jumpToDemoStep}
          onContinue={continueDemo}
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

        <FloatingActionDock
          actions={quickActions.slice(1)}
          onPrimaryPress={() => setShowActionSheet(true)}
          onActionPress={handleQuickAction}
        />
        <BottomTabs activeTab={activeTab} onChange={handleTabChange} />
        <QuickActionSheet
          visible={showActionSheet}
          actions={quickActions}
          onClose={() => setShowActionSheet(false)}
          onSelect={handleQuickAction}
        />
        <DemoIntroModal
          visible={showDemoIntro && sessionMode === "demo"}
          onStart={startDemo}
          onSkip={() => setShowDemoIntro(false)}
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
});
