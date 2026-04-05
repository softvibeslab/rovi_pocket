export type TabKey = "home" | "leads" | "agenda" | "copilot" | "profile";

export type BrokerProfile = {
  name: string;
  market: string;
  focus: string;
  monthlyTarget: string;
  projectedRevenue: string;
  closings: string;
  appointments: string;
  followUpRate: string;
  streakDays: number;
  badges: string[];
  landingStatus: string;
};

export type Lead = {
  id: string;
  name: string;
  property: string;
  location: string;
  stage: string;
  priority: "hot" | "warm" | "watch";
  score: number;
  source: string;
  price: string;
  lastTouch: string;
  nextAction: string;
  preferredChannel: string;
  budget: string;
  pipelineValue: string;
  insight: string;
  painPoint: string;
  summary: string;
  script: string;
  tags: string[];
};

export type AgendaItem = {
  id: string;
  title: string;
  time: string;
  duration: string;
  type: string;
  leadId: string;
  leadName: string;
  note: string;
  status: "next" | "today" | "done";
};

export type PlanCard = {
  id: string;
  label: string;
  title: string;
  body: string;
  tone: "primary" | "secondary" | "neutral";
  leadId?: string;
};

export type Prompt = {
  id: string;
  label: string;
};

export type ChatEntry =
  | {
      id: string;
      role: "user" | "assistant";
      kind: "bubble";
      text: string;
    }
  | {
      id: string;
      role: "assistant";
      kind: "insight";
      title: string;
      body: string;
      actions: string[];
    };

export type Integration = {
  id: string;
  name: string;
  status: string;
  detail: string;
};

export type QuickAction = {
  id: string;
  label: string;
  hint: string;
};

export type DemoStep = {
  id: string;
  label: string;
  title: string;
  body: string;
  tab: TabKey;
  cta: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone?: "primary" | "secondary" | "neutral";
};
