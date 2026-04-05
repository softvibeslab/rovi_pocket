import {
  ActivityItem,
  AgendaItem,
  BrokerProfile,
  ChatEntry,
  DemoStep,
  Integration,
  Lead,
  PlanCard,
  Prompt,
  QuickAction,
} from "../types";

export const brokerProfile: BrokerProfile = {
  name: "Alejandro Rivera",
  market: "Polanco, Condesa y Reforma",
  focus: "Broker individual con pipeline premium en residencial vertical",
  monthlyTarget: "$3.0M",
  projectedRevenue: "$2.4M",
  closings: "3/5",
  appointments: "9/12",
  followUpRate: "86%",
  streakDays: 14,
  badges: ["Inbox al dia", "Respuesta rapida", "Seguimiento elite"],
  landingStatus: "Activa con 18 leads captados este mes",
};

export const leads: Lead[] = [
  {
    id: "lead-ricardo",
    name: "Ricardo Mendoza",
    property: "Penthouse Reforma",
    location: "Polanco, CDMX",
    stage: "Calificado",
    priority: "hot",
    score: 98,
    source: "WhatsApp",
    price: "$12.5M",
    lastTouch: "Hace 12m",
    nextAction: "Mandar propuesta y cerrar llamada a las 17:00",
    preferredChannel: "WhatsApp",
    budget: "$11M - $13M",
    pipelineValue: "$4.1M ponderado",
    insight:
      "Busca PH con terraza, alto interes por seguridad y rapidez de cierre. Muy sensible a pequenas variaciones de precio.",
    painPoint: "Quiere flexibilidad de precio y claridad sobre amenidades premium.",
    summary:
      "Ha visto el tour virtual tres veces, respondio hoy y esta a una objecion de agendar una segunda visita.",
    script:
      "Hola Ricardo, ya revise la flexibilidad del propietario para el PH en Reforma. Tengo una actualizacion que puede acercarnos al rango que me comentaste. Te marco a las 5 para revisarla rapido?",
    tags: ["Terraza", "Negociacion", "Top lead"],
  },
  {
    id: "lead-sofia",
    name: "Sofia Villalobos",
    property: "Casa San Angel",
    location: "San Angel, CDMX",
    stage: "Seguimiento",
    priority: "warm",
    score: 74,
    source: "Landing",
    price: "$8.2M",
    lastTouch: "Hace 2h",
    nextAction: "Confirmar visita del jueves y mandar brochure curado",
    preferredChannel: "Email + WhatsApp",
    budget: "$7M - $8.5M",
    pipelineValue: "$1.8M ponderado",
    insight:
      "Valora tranquilidad, jardin y cercania con colegios. El timing depende de vender otra propiedad primero.",
    painPoint: "Necesita claridad sobre tiempos y comparables.",
    summary:
      "Muy buena afinidad con el producto, pero el cierre depende de disminuir incertidumbre financiera.",
    script:
      "Sofia, te comparto una seleccion de comparables y una propuesta de visita para el jueves. Si te parece, la revisamos juntas por WhatsApp y dejamos lista la ruta.",
    tags: ["Familia", "Comparables", "Visita"],
  },
  {
    id: "lead-valeria",
    name: "Valeria Soto",
    property: "Loft Condesa",
    location: "Condesa, CDMX",
    stage: "Nuevo",
    priority: "watch",
    score: 63,
    source: "CSV",
    price: "$4.6M",
    lastTouch: "Nunca",
    nextAction: "Primer contacto en la proxima hora con guion corto",
    preferredChannel: "Llamada",
    budget: "$4M - $5M",
    pipelineValue: "$0.9M ponderado",
    insight:
      "Lead nuevo con alto fit por estilo de vida urbano. El primer contacto rapido define si entra o no al pipeline serio.",
    painPoint: "Aun no hay contexto ni urgencia clara.",
    summary:
      "Es el lead con mayor riesgo de enfriarse si no recibe un primer toque hoy.",
    script:
      "Hola Valeria, soy Alejandro de Rovi. Vi el tipo de propiedad que estas buscando en Condesa y tengo dos opciones que te podrian gustar. Te puedo marcar 5 minutos hoy?",
    tags: ["Primer toque", "Urgente", "Condesa"],
  },
  {
    id: "lead-julian",
    name: "Julian Ortega",
    property: "Depa preventa Roma",
    location: "Roma Norte, CDMX",
    stage: "Negociacion",
    priority: "warm",
    score: 81,
    source: "Google Calendar",
    price: "$6.9M",
    lastTouch: "Ayer",
    nextAction: "Enviar resumen post-visita y resolver objecion sobre estacionamiento",
    preferredChannel: "WhatsApp",
    budget: "$6M - $7M",
    pipelineValue: "$2.2M ponderado",
    insight:
      "Listo para avanzar si la objecion operativa queda resuelta hoy. El follow-up post-visita es la ventana critica.",
    painPoint: "Estacionamiento y administracion del edificio.",
    summary:
      "La visita salio bien. Necesita una respuesta puntual y veloz para no comparar con otra opcion.",
    script:
      "Julian, ya tengo respuesta sobre el tema del estacionamiento y te comparto ademas los detalles operativos del desarrollo. Si quieres te lo mando en audio y lo cerramos hoy.",
    tags: ["Post-visita", "Objecion", "Roma"],
  },
];

export const agendaItems: AgendaItem[] = [
  {
    id: "ag-1",
    title: "Llamada de negociacion",
    time: "10:30",
    duration: "25 min",
    type: "Call",
    leadId: "lead-ricardo",
    leadName: "Ricardo Mendoza",
    note: "Resolver rango de precio y agendar segunda visita.",
    status: "next",
  },
  {
    id: "ag-2",
    title: "Visita a Casa San Angel",
    time: "13:00",
    duration: "60 min",
    type: "Visit",
    leadId: "lead-sofia",
    leadName: "Sofia Villalobos",
    note: "Mostrar jardin, accesos y flujo de luz natural.",
    status: "today",
  },
  {
    id: "ag-3",
    title: "Bloque de reactivacion",
    time: "16:30",
    duration: "30 min",
    type: "Planner",
    leadId: "lead-valeria",
    leadName: "Valeria Soto",
    note: "Primer toque a leads sin seguimiento de 5 dias.",
    status: "today",
  },
  {
    id: "ag-4",
    title: "Resumen post-visita",
    time: "18:00",
    duration: "20 min",
    type: "Follow-up",
    leadId: "lead-julian",
    leadName: "Julian Ortega",
    note: "Enviar comparativo y respuesta de estacionamiento.",
    status: "done",
  },
];

export const planCards: PlanCard[] = [
  {
    id: "plan-1",
    label: "Prioridad 1",
    title: "Cerrar momentum con Ricardo",
    body: "Tiene score 98, respondio hoy y el mejor movimiento es una llamada corta con propuesta afinada antes de las 17:00.",
    tone: "primary",
    leadId: "lead-ricardo",
  },
  {
    id: "plan-2",
    label: "Prioridad 2",
    title: "Asegurar visita premium de Sofia",
    body: "Refuerza comparables y timing para proteger la cita del jueves. La decision depende de bajar incertidumbre.",
    tone: "secondary",
    leadId: "lead-sofia",
  },
  {
    id: "plan-3",
    label: "Prioridad 3",
    title: "No perder primer toque con Valeria",
    body: "El lead todavia esta frio. Si no entra hoy a secuencia, cae tu velocidad semanal de respuesta.",
    tone: "neutral",
    leadId: "lead-valeria",
  },
];

export const copilotPrompts: Prompt[] = [
  { id: "prompt-1", label: "Quien debo contactar hoy?" },
  { id: "prompt-2", label: "Resume mi pipeline semanal" },
  { id: "prompt-3", label: "Prepara mi siguiente visita" },
  { id: "prompt-4", label: "Genera script de reactivacion" },
];

export function buildCopilotThread(lead: Lead): ChatEntry[] {
  return [
    {
      id: `chat-${lead.id}-1`,
      role: "user",
      kind: "bubble",
      text: `Ayudame a preparar la siguiente accion con ${lead.name} y dame el mejor enfoque para hoy.`,
    },
    {
      id: `chat-${lead.id}-2`,
      role: "assistant",
      kind: "bubble",
      text: `${lead.name} esta en ${lead.stage.toLowerCase()} y su objecion principal es: ${lead.painPoint.toLowerCase()}. Mi recomendacion es usar ${lead.preferredChannel.toLowerCase()} y mover la conversacion hacia ${lead.nextAction.toLowerCase()}.`,
    },
    {
      id: `chat-${lead.id}-3`,
      role: "assistant",
      kind: "insight",
      title: `Lead Profile: ${lead.name}`,
      body: `${lead.insight} Siguiente mejor mensaje: ${lead.script}`,
      actions: ["Crear tarea", "Abrir lead", "Usar script"],
    },
  ];
}

export const integrations: Integration[] = [
  {
    id: "int-1",
    name: "Google Calendar",
    status: "Conectado",
    detail: "Sincronizando agenda y recordatorios del dia.",
  },
  {
    id: "int-2",
    name: "WhatsApp follow-up",
    status: "Listo para MVP",
    detail: "Deep links activos; automatizacion avanzada pendiente.",
  },
  {
    id: "int-3",
    name: "Landing del broker",
    status: "Activa",
    detail: "Formulario entrando directo al pipeline Pocket.",
  },
];

export const quickActions: QuickAction[] = [
  { id: "new-lead", label: "Nuevo lead", hint: "Captura express" },
  { id: "import", label: "Importar", hint: "CSV o telefono" },
  { id: "note", label: "Nota", hint: "Texto o voz" },
  { id: "event", label: "Evento", hint: "Agenda follow-up" },
];

export const demoFlowSteps: DemoStep[] = [
  {
    id: "dashboard",
    label: "Paso 1",
    title: "Arranca con el dashboard",
    body: "Revisa el briefing IA y abre el lead con mas momentum para hoy.",
    tab: "home",
    cta: "Abrir lead principal",
  },
  {
    id: "leads",
    label: "Paso 2",
    title: "Explora el insight del lead",
    body: "Valida pain point, score y script sugerido desde el pipeline.",
    tab: "leads",
    cta: "Pedir ayuda a IA",
  },
  {
    id: "copilot",
    label: "Paso 3",
    title: "Usa al asistente Rovi AI",
    body: "Genera un guion, crea una tarea o decide el siguiente movimiento.",
    tab: "copilot",
    cta: "Mandar a agenda",
  },
  {
    id: "agenda",
    label: "Paso 4",
    title: "Convierte estrategia en agenda",
    body: "Confirma bloques tacticos y aterriza el seguimiento del dia.",
    tab: "agenda",
    cta: "Ver progreso final",
  },
  {
    id: "profile",
    label: "Paso 5",
    title: "Cierra la demo del broker",
    body: "Revisa progreso, racha e integraciones clave del stack personal.",
    tab: "profile",
    cta: "Reiniciar demo",
  },
];

export const initialActivityFeed: ActivityItem[] = [
  {
    id: "act-1",
    title: "Briefing generado por IA",
    detail: "Rovi priorizo a Ricardo, Sofia y Valeria para el dia.",
    time: "Hace 3m",
    tone: "primary",
  },
  {
    id: "act-2",
    title: "Sincronizacion de agenda",
    detail: "Google Calendar actualizo 4 bloques del dia.",
    time: "Hace 15m",
    tone: "secondary",
  },
  {
    id: "act-3",
    title: "Landing del broker",
    detail: "Entraron 2 leads nuevos desde el formulario publico.",
    time: "Hoy",
    tone: "neutral",
  },
];
