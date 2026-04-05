# Rovi Pocket Implementation Status

## Estado actual

La base del subproyecto ya cubre:

- shell Expo con TypeScript
- navegacion inferior con 5 tabs
- tema dark premium inspirado en Stitch
- dataset local para pruebas de flujo
- vistas iniciales para:
  - Dashboard
  - Leads
  - Lead Insight Lab
  - Agenda
  - Copilot IA
  - Perfil

## Fuente visual

La interfaz actual toma como referencia directa el export del proyecto Stitch:

- [../design/stitch/rovi-pocket-12933692853021831749/manifest.json](/Users/newproject/Documents/GitHub/leadvibes/apps/rovi-pocket/design/stitch/rovi-pocket-12933692853021831749/manifest.json)

Pantallas base usadas:

- `Rovi Pocket App Shell`
- `Intelligent Dashboard`
- `Conversational AI Assistant`
- `Leads List & Pipeline`
- `Lead Insight Lab`

## Estructura tecnica

```text
src/
├── components/
│   ├── chrome.tsx
│   └── ui.tsx
├── data/
│   └── mock.ts
├── screens/
│   ├── AgendaScreen.tsx
│   ├── CopilotScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── LeadsScreen.tsx
│   └── ProfileScreen.tsx
├── theme.ts
└── types.ts
```

## Lo que ya esta resuelto

- seleccion compartida de lead entre pantallas
- scoring e insight visible en leads
- estructura de copiloto IA centrada en contexto
- cards y chrome reutilizables
- base lista para reemplazar mock data por API real

## Proxima integracion recomendada

### 1. Auth

Agregar:

- `src/lib/api.ts`
- `src/lib/storage.ts`
- `src/context/AuthContext.tsx`

Objetivo:

- login real
- persistencia de token
- carga del broker autenticado

### 2. Pocket API

Endpoints minimos sugeridos:

- `POST /api/pocket/auth/login`
- `GET /api/pocket/me`
- `GET /api/pocket/dashboard`
- `GET /api/pocket/leads`
- `GET /api/pocket/leads/:id`
- `GET /api/pocket/agenda`
- `POST /api/pocket/copilot/query`

### 3. Data hooks

Agregar:

- `src/hooks/useDashboard.ts`
- `src/hooks/useLeads.ts`
- `src/hooks/useAgenda.ts`
- `src/hooks/useCopilot.ts`

### 4. Sprint tecnico siguiente

Prioridad recomendada:

1. auth real
2. dashboard real
3. leads reales
4. copilot con respuestas backend
5. calendario y push

## Verificacion local

Comando actual:

```bash
npm run typecheck
```

## Notas

- La UI actual esta optimizada para avanzar rapido en producto sin esperar integraciones.
- El siguiente gran paso no es mas UI; es conectar el shell a datos reales y workflows del broker.
