# Rovi Pocket

Estado actual: subproyecto Expo activo en repo independiente, conectado al repositorio principal como submodulo.

Repositorio remoto:

- https://github.com/softvibeslab/rovi_pocket.git

## Que es este folder

Este directorio contiene la base tecnica de `Rovi Pocket`, la version mobile-first de Rovi enfocada exclusivamente en brokers individuales.

Hoy ya incluye:

- shell Expo con TypeScript,
- navegacion por tabs,
- pantallas base de `Dashboard`, `Leads`, `Agenda`, `IA` y `Perfil`,
- mock data alineado al PRD Pocket,
- export de disenos desde Stitch,
- script para refrescar assets del proyecto Stitch.

## Estructura actual

```text
apps/rovi-pocket/
├── README.md
├── design/
│   └── stitch/
├── docs/
├── scripts/
├── src/
├── App.tsx
└── package.json
```

## Como correrlo

```bash
cd apps/rovi-pocket
npm install
npm run start
```

Si quieres usar backend real con otra URL:

```bash
EXPO_PUBLIC_API_URL=http://localhost:8000 npm run start
```

En Android emulator, el default ya intenta `http://10.0.2.2:8000`.

Verificacion rapida:

```bash
npm run typecheck
```

## Como generar APK Android

Build descargable para pruebas internas:

```bash
cd apps/rovi-pocket
npm run build:android:preview:no-wait
```

Para listar builds recientes y abrir el APK:

```bash
cd apps/rovi-pocket
npm run build:list:android
```

Notas practicas:

- el perfil `preview` genera `apk`, no `aab`,
- `preview` ahora usa `autoIncrement` para evitar choques al reinstalar builds,
- si tienes cambios locales sin commit y quieres subir exactamente ese estado, usa:

```bash
cd apps/rovi-pocket
EAS_NO_VCS=1 eas build --platform android --profile preview --non-interactive --no-wait
```

## Arquitectura UI actual

- `App.tsx`: orquestacion del shell, tabs y lead seleccionado.
- `src/theme.ts`: tokens base de color, radios, spacing y layout.
- `src/data/mock.ts`: dataset local para iterar UI sin bloquear backend.
- `src/components/`: chrome y componentes reutilizables.
- `src/screens/`: pantallas de producto inspiradas por Stitch.

## Diseno y assets

Export Stitch actual:

- [design/stitch/rovi-pocket-12933692853021831749/README.md](/Users/newproject/Documents/GitHub/leadvibes/apps/rovi-pocket/design/stitch/rovi-pocket-12933692853021831749/README.md)

Prompting y definicion de flows:

- [../../docs/ROVI_POCKET_FIGMA_PROMPTS.md](/Users/newproject/Documents/GitHub/leadvibes/docs/ROVI_POCKET_FIGMA_PROMPTS.md)

Guia de repo y submodulo:

- [../../docs/ROVI_POCKET_REPO_SETUP.md](/Users/newproject/Documents/GitHub/leadvibes/docs/ROVI_POCKET_REPO_SETUP.md)

## Estado funcional actual

- `Dashboard`: `Modo Momentum`, señales de cierre, radar vivo, ejecucion de un toque y agenda protegida.
- `Leads`: busqueda, filtros, stream del pipeline y `Lead Insight Lab`.
- `Agenda`: timeline diario y planner IA.
- `IA`: copiloto conversacional con contexto del lead y acciones sugeridas.
- `Perfil`: metas, integraciones y estado del broker.

## Como probar el mockup demo

Al abrir la app:

1. inicia la `demo guiada`,
2. recorre `Dashboard -> Leads -> IA -> Agenda -> Perfil` desde la guia flotante,
3. oculta o retoma la guia cuando quieras desde el rail lateral,
4. prueba los atajos rapidos desde el popup dedicado,
5. valida toasts, bitacora y cambios locales de estado sobre leads.

Todo esto corre con estado local y datos demo, sin dependencia de backend.

## Acceso real al backend

La app ya soporta:

- login real contra `POST /api/auth/login`
- carga de usuario actual con `GET /api/auth/me`
- carga de leads con `GET /api/leads`
- carga de detalle de lead con `GET /api/leads/:id`
- carga de actividad reciente con `GET /api/dashboard/recent-activity`
- generacion de script con `POST /api/leads/:id/generate-script`

Si el backend no responde, puedes entrar por `modo demo` sin romper el flujo.

## Siguiente etapa recomendada

1. Crear `Pocket API` o capa BFF sobre FastAPI actual.
2. Sustituir `mock.ts` por clientes de datos reales.
3. Agregar auth real y storage seguro.
4. Integrar Google Calendar, importacion de contactos y automatizaciones MVP.
5. Reemplazar placeholders de accion por flows productivos.

## Documento de implementacion

- [docs/IMPLEMENTATION_STATUS.md](/Users/newproject/Documents/GitHub/leadvibes/apps/rovi-pocket/docs/IMPLEMENTATION_STATUS.md)
