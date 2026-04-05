# Rovi Pocket — Subproyecto Seed

Estado actual: semilla local dentro del repo principal
Objetivo: evolucionar a repositorio independiente conectado por submódulo

## Qué es este folder

Este directorio existe para arrancar `Rovi Pocket` sin frenar la definición funcional, técnica y de diseño.

La estrategia recomendada es:

1. iniciar aquí el subproyecto dentro del repo principal,
2. definir arquitectura, diseño y alcance,
3. extraer este folder a un repositorio independiente,
4. reconectarlo al repo principal como `git submodule`.

## Ruta propuesta

```text
apps/rovi-pocket/
```

## Estructura inicial

```text
apps/rovi-pocket/
├── README.md
├── design/
├── docs/
└── src/
```

## Cómo comenzamos

### Fase 1: definición dentro del monorepo

Durante esta fase usamos este folder para:

- documentar alcance y flows,
- recibir diseños y prototipos,
- definir arquitectura del app shell,
- preparar Sprint 0 y Sprint 1,
- acordar el contrato de `Pocket API`.

### Fase 2: bootstrap del proyecto móvil

Cuando aprobemos el diseño base y el setup técnico:

```bash
cd apps/rovi-pocket
npx create-expo-app@latest --template default@sdk-55 .
```

Después:

```bash
npx expo install expo-notifications expo-contacts expo-sqlite
npx expo install @tanstack/react-query zustand react-hook-form zod
```

Nota:

- `sdk-55` es buena opción si queremos arrancar con stack más nuevo.
- Si el equipo quiere máxima compatibilidad con Expo Go durante setup inicial, podemos usar `sdk-54`.

## Estrategia para convertirlo en repo independiente + submódulo

La guía exacta está en:

- [../../docs/ROVI_POCKET_REPO_SETUP.md](/Users/newproject/Documents/GitHub/leadvibes/docs/ROVI_POCKET_REPO_SETUP.md)

Resumen:

1. desarrollar aquí el arranque,
2. hacer `git subtree split --prefix=apps/rovi-pocket`,
3. empujar ese historial a un repo nuevo `rovi-pocket`,
4. reemplazar este folder por `git submodule`.

## Próximos entregables aquí

- app shell Expo
- navegación por tabs
- home/dashboard placeholder
- lead list placeholder
- lead detail placeholder
- pantalla del Agente IA
- carpeta de assets y tokens

## Insumos de diseño

Cuando tengas diseños, prototipos o referencias, los puedes ordenar así:

```text
apps/rovi-pocket/design/
├── references/
├── wireframes/
├── prototypes/
└── exports/
```

También puedes usar los prompts de Figma en:

- [../../docs/ROVI_POCKET_FIGMA_PROMPTS.md](/Users/newproject/Documents/GitHub/leadvibes/docs/ROVI_POCKET_FIGMA_PROMPTS.md)
