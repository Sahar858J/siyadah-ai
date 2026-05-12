# Siyadah AI

A premium cinematic AI SaaS frontend — an AI operating system that lets users orchestrate an AI workforce. Frontend-only, with mock data, local state, and localStorage persistence.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + TailwindCSS + Framer Motion + shadcn/ui + wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- Frontend: `artifacts/siyadah-ai/src/`
  - Pages: `src/pages/` (LandingPage, LoginPage, ChatPage)
  - Chat components: `src/components/chat/`
  - Layout: `src/components/layout/`
  - Context: `src/context/AppContext.tsx` (language + t() helper)
  - Translations: `src/lib/translations.ts` (EN + AR)
  - Auth: `src/lib/auth.ts` (localStorage session)
  - Employee detection: `src/lib/employeeDetection.ts`
  - Employee data: `src/lib/employeeData.ts`
  - Mock AI: `src/lib/mockAI.ts`
  - Theme: `src/index.css` (monochrome dark palette)
- API: `artifacts/api-server/src/`
- DB schema: `lib/db/src/schema/`
- API contract: `lib/api-spec/openapi.yaml`

## Architecture decisions

- Frontend-only app: no backend, no API calls. All state in React + localStorage.
- Fake auth: any email/password saves a session to localStorage, redirects to /chat.
- Dynamic AI employees: keyword detection in chat messages triggers employee card creation.
- Bilingual: English (LTR) + Arabic (RTL) with IBM Plex Sans Arabic font. Language saved to localStorage.
- Always-dark: monochrome black/white design — #0D0D0D background, no colorful gradients.

## Product

Siyadah AI is a premium AI workspace where users chat with an AI that dynamically creates AI "employees" based on the conversation. Landing page showcases the product; login gates the workspace; the chat page shows a 3-column layout (minimal sidebar, chat center, AI employees panel).

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The `t()` function in AppContext uses flat dot-notation keys (e.g. `"hero.cta_primary"`), NOT nested object paths.
- localStorage keys: `siyadah_session`, `siyadah_language`, `siyadah_chat_history`
- Arabic RTL: set via `document.documentElement.dir` when language changes.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
