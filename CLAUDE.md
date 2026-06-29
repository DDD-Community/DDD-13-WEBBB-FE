# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev          # start dev server (Turbopack)
pnpm build        # production build
pnpm lint:eslint  # ESLint
pnpm lint:prettier # Prettier check
```

No test suite is configured.

## Architecture

**Stack**: Next.js 16.2.1 (App Router), React 19, TypeScript, Tailwind CSS v4, TanStack Query v5, Zustand v5, react-hook-form + Zod.

### Route structure

```
app/
  (landing)/          # unauthenticated landing page (/)
  (auth)/             # login, signup — no session required
  (protected)/        # onboarding, write, my, settings — session required
  home/               # main feed
  post/[id]/          # post detail + comments
  api/[...path]/      # generic server-side proxy (see below)
  api/auth/           # auth-specific routes that set/clear httpOnly cookies
  oauth/callback/     # OAuth code exchange entry point
```

Route guard lives in `proxy.ts` (not `middleware.ts`): checks for the refresh cookie and redirects unauthenticated users to `/login` for protected paths.

### API proxy pattern

`app/api/[...path]/route.ts` is the single entry point for all client API calls. It:

1. Reads the `ACCESS_TOKEN_COOKIE` httpOnly cookie and forwards it as `Authorization: Bearer`.
2. On 401, calls `lib/backend.ts:refreshWithCookie()` to exchange the refresh token, then retries once.
3. On failed refresh, clears auth cookies.

Clients call `/api/*` paths (same-origin). `NEXT_PUBLIC_API_BASE_URL` is empty by default (same-origin). The actual backend origin is `API_ORIGIN` (server-side env var only).

Auth cookies (`ACCESS_TOKEN_COOKIE` = `5959-st`, `REFRESH_TOKEN_COOKIE` = `5959-rt`) are httpOnly and set only from server-side routes in `app/api/auth/` and `lib/authCookies.ts`.

### Services layer

- `services/client.ts` — `http.get/post/patch/delete` wrappers; throws `ApiError` on non-2xx or `success: false`. All responses follow `ApiResponse<T>` envelope; `client.ts` unwraps to `data`.
- `services/endpoints/` — domain functions by feature (`auth`, `post`, `comment`, `users`, `mypage`). These are plain async functions, not hooks.
- `services/types.ts` — shared backend enums (`JobRole`, `CareerYear`, `CommentTone`, `EmotionType`, `MonsterStatus`, `PostOrder`) and the `ApiResponse<T>` / `CursorPage` types.
- `services/query-keys.ts` — TanStack Query key factories (`postKeys`, `userKeys`, `myPageKeys`). Always use these; don't inline key arrays.

### State management

- `store/useAuthStore.ts` — Zustand + `persist` (localStorage key `auth`). Holds `AuthUser | null`. Check `_hasHydrated` before rendering auth-gated UI to avoid flicker.
- `store/useWriteStore.ts` — ephemeral write-page state (content + selected comment tone). Not persisted.

### Styling

Tailwind CSS v4 — **no `tailwind.config.js`**. Theme is declared via `@theme` in `styles/colors.css`. Custom colors follow the pattern `--color-{name}-{10|20|30}` (10 = tint/transparent, 20 = base, 30 = dark). Custom typography and shadows are in the respective CSS files under `styles/`.

### SVGs

SVGs are imported as React components (configured via `@svgr/webpack` in `next.config.ts` turbopack rules):

```tsx
import CharacterSvg from "./character.svg";
// <CharacterSvg /> works as a component
```

Type declarations for SVG imports are in `svg.d.ts`.

### Forms & validation

`react-hook-form` + Zod. Schemas live in `schemas/`. Email, password, nickname, onboarding field schemas are in `schemas/auth.ts`.

### Enum label maps

`const/map.ts` contains Korean display labels for backend enums (`JOB_ROLE`, `CAREER_YEAR`, `COMMENT_TONE`, `CHARACTER_LABEL`) and inverse maps (`JOB_ROLE_BY_LABEL`, `CAREER_YEAR_BY_LABEL`) for form-to-API conversion.
