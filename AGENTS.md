# AGENTS.md

## Purpose
This repository contains the Debtbox admin dashboard frontend. It is a React 19 + TypeScript + Vite application for business-critical Debtbox admin workflows around merchants, customers, debts, support tickets, authentication, and operational administration.

Future contributors and coding agents must keep changes small, safe, and consistent with the current codebase. Do not introduce new architecture, libraries, or broad refactors unless a task explicitly requires it and the repository has no existing pattern to reuse.

## Local Setup
- Package manager: `pnpm` (`pnpm-lock.yaml` is committed; lockfile version 9).
- Node target: Node 20 is used by `Dockerfile` and `.github/workflows/deploy.yml`. No `engines` field or `.nvmrc` is currently defined.
- Install dependencies: `pnpm install`.
- Recommended CI-style install: `pnpm install --frozen-lockfile`.
- Run locally: `pnpm dev`.
- Build: `pnpm build` (`tsc -b && vite build`).
- Lint: `pnpm lint`.
- Preview production build: `pnpm preview`.
- Manual GitHub Pages deploy: `pnpm run deploy`.
- Docker development: `docker-compose up app`.
- Docker production: `docker-compose up production`.

## Environment And Config
- API base URL is read from `VITE_API_BASE_URL` in `src/utils/const.ts`.
- If `VITE_API_BASE_URL` is absent, the app defaults to `https://api.debtbox.sa/v0.0.1/api`.
- Router and Vite base path use `VITE_BASE_PATH` where referenced, defaulting to `/debtbox-admin/`.
- `src/vite-env.d.ts` currently declares only `VITE_API_BASE_URL`; add new Vite env vars there when introducing them.
- There is no committed `.env.example`. `SETUP.md` documents:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

- GitHub Pages deployment is configured in `.github/workflows/deploy.yml` with Node 20, pnpm 10, `pnpm install --frozen-lockfile`, and `VITE_BASE_PATH=/debtbox-admin/`.
- `Dockerfile` builds with Node 20 Alpine, installs pnpm globally, and serves production assets through nginx.
- `nginx.conf` contains client-side routing fallback, static asset caching, gzip, and basic security headers.

## Project Structure
- `src/main.tsx`: React entry point. Mounts `App`, imports Tailwind and i18n, provides React Query, and configures the global Sonner toaster.
- `src/App.tsx`: BrowserRouter setup, base path handling, document direction/language syncing, and session-expiry popup handling.
- `src/routes`: top-level public/protected route selection based on the `access_token` cookie.
- `src/components/layout`: `MainLayout`, `Navbar`, `Sidebar`, and `UserDropdown`.
- `src/components/shared`: reusable UI primitives and patterns such as `Button`, `Input`, `Select`, `Textarea`, `Checkbox`, `MultiSelect`, `Table`, `FilterBar`, pagination, language dropdown, and session-expiry popup.
- `src/features`: feature modules. Current modules include `auth`, `dashboard`, `customers`, `merchants`, `debtsManagement`, `supportTickets`, and a static `user-management` page.
- `src/features/<feature>/routes`: nested feature routes where present.
- `src/features/<feature>/views`: page-level components.
- `src/features/<feature>/components`: feature-specific UI components.
- `src/features/<feature>/api`: endpoint functions and React Query hooks.
- `src/features/<feature>/schemas`: form schemas where used.
- `src/types`: shared DTOs and API error types.
- `src/stores`: Zustand stores for user and session state.
- `src/lib`: axios, React Query client, React Query helper types, and `useQueryWithCallback`.
- `src/utils`: shared helpers for class merging, storage/cookies, constants, dates, language cookie lookup, and document direction.
- `public/locales`: translation JSON files currently present for English and Arabic.

## Routing Conventions
- Top-level routing is defined in `src/routes/index.tsx` with `useRoutes`.
- Auth is determined by the `access_token` cookie from `src/utils/storage.ts`.
- Protected routes are wrapped by `src/routes/protected/ProtectedRoutes.tsx`, which renders `MainLayout`.
- Public routes are wrapped by `src/routes/public/PublicRoutes.tsx`.
- Feature route modules usually expose a `FeatureRoutes` component using `Routes` and `Route`.
- Customer, merchant, and debt routes lazy-load list/detail views.
- Support ticket routes currently import views directly and include a wildcard redirect back to `/support-tickets`.
- Add new navigation entries in `src/components/layout/Sidebar.tsx` only when the route should be visible in the main admin navigation, and use translation keys for labels.

## API And Data Fetching
- Use the shared axios instance from `src/lib/axios.ts`.
- `axios` is configured with:
  - `baseURL` from `API_BASE_URL`
  - JSON content type
  - 10 second timeout
  - `paramsSerializer.indexes = null`
  - request interceptor that injects `Authorization: Bearer <access_token>` unless `skipAuth` is set
  - centralized 401 refresh/session-expiry behavior
  - network-error toast through Sonner
- Endpoint modules live under `src/features/<feature>/api`.
- Query hooks use `@tanstack/react-query`.
- Query helper types live in `src/lib/react-query.ts`.
- Existing query hooks use `useQueryWithCallback` from `src/lib/hooks/useQueryWithCallback.ts` when an `onSuccess` callback is needed.
- Mutations use `useMutation` and accept optional `MutationConfig`.
- API calls should include `Accept-Language` using `getLanguageFromCookie()` where existing endpoint modules do.
- Keep response shapes typed locally in the API module or reuse DTOs from `src/types`.
- Do not swallow API errors. Use the existing axios, React Query, and toast patterns so errors remain visible to users.

## State Management
- Global state uses Zustand only.
- `src/stores/UserStore.ts` stores safe user profile fields for navbar/dropdown display.
- `src/stores/SessionStore.ts` stores session-expiry popup state.
- Auth tokens are stored in cookies through `src/utils/storage.ts` as `access_token` and `refresh_token`.
- `ProfileSync` fetches `GET /admin/me` in the protected layout and syncs safe profile fields into `UserStore`.
- Keep new state local unless it is truly shared across routes/components. If global state is required, follow the existing small Zustand store pattern.

## Auth And Permissions
- Login is implemented in `src/features/auth/views/Login.tsx` using `react-hook-form`, Zod, `useLogin`, cookies, `UserStore`, and a full-page redirect so route selection re-reads cookies.
- Token refresh is centralized in `src/lib/axios.ts` and `src/features/auth/api/refreshAuthToken.ts`.
- Session expiry clears auth tokens, clears React Query state, clears local storage, shows `SessionExpiryPopup`, and redirects to login.
- Auth API types include roles and permissions in `src/features/auth/types/auth.ts`, but route/action permission guards are not currently implemented in the UI.
- Do not claim a screen is permission-protected unless the code actually enforces it. If adding restricted admin actions, first search for an existing guard pattern; if none exists, coordinate the smallest consistent approach with backend role/permission data.

## Forms And Validation
- Forms use `react-hook-form`.
- Validation uses Zod with `zodResolver`.
- Shared form controls live in `src/components/shared` and should be reused before creating new inputs.
- Existing forms define schemas near the feature or component, for example `src/features/auth/schemas/loginSchema.ts` and modal/page-local schemas.
- Validation messages are mixed today: some use translation keys/functions and some use hardcoded English strings. Prefer translated messages for new user-facing validation where the surrounding module already uses i18n.
- Preserve business validation for sensitive workflows. Do not weaken checks for debts, payments, merchants, customers, support tickets, fees, payouts, settlements, or admin actions.
- When preparing API payloads, follow existing patterns that omit empty optional fields instead of sending misleading blank values.

## Tables, Filters, Lists, And Pagination
- Reuse `src/components/shared/Table.tsx` for table layouts.
- Reuse `FilterBar` for search, multi-select filters, date ranges, active filter chips, and clear-all behavior where it fits.
- Reuse existing pagination components (`CustomPagination` via `Table` or shared pagination components) instead of creating a new pagination UI.
- Table pages commonly keep filter/page state in the page component, reset page to 0 on filter changes, and pass API pagination into the table.
- Keep loading, empty states, row actions, and detail navigation consistent with nearby customer, merchant, debt, and support ticket screens.

## UI, Styling, And i18n
- Styling uses Tailwind CSS v4 through `@tailwindcss/vite` and `src/tailwind.css`.
- Theme tokens are defined in `src/tailwind.css`, including primary colors and semantic colors.
- Class merging utilities are `clsx` and `cn` (`src/utils/cn.ts`, using `clsx` + `tailwind-merge`).
- Icons use `lucide-react` where possible.
- Toasts use `sonner`; the global toaster is mounted in `src/main.tsx`.
- i18n uses `i18next`, `react-i18next`, `i18next-http-backend`, and `i18next-icu`.
- Translation files are loaded from `/debtbox-admin/locales/{{lng}}.json`.
- `i18n.ts` lists `en`, `ar`, `ur`, and `bn` as supported languages, but the committed locale files are currently `public/locales/en.json` and `public/locales/ar.json`.
- The language dropdown currently exposes English and Arabic.
- Document direction is set by `src/utils/setDocDirection.tsx`; Arabic uses RTL, other languages use LTR.
- Use logical Tailwind classes such as `start`, `end`, `ms`, `me`, `ps`, and `pe` where layout must support RTL.
- Do not hardcode visible user-facing text when surrounding code uses translation keys. Add matching keys to both `en.json` and `ar.json` for new UI strings.

## TypeScript And Code Style
- The project is strict TypeScript. `tsconfig.app.json` enables `strict`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, and related checks.
- The alias `@/*` maps to `src/*` in both TypeScript and Vite.
- Use type-only imports where applicable.
- Keep DTOs explicit and aligned with backend response shapes.
- ESLint is configured in `eslint.config.js` for TypeScript, React hooks, and Vite React refresh. There is no separate test script currently.
- Preserve the local quote/formatting style of the file you edit. The repo contains both single-quote and double-quote files; avoid unrelated formatting churn.

## Debtbox Business Context
Debtbox is a KSA fintech/admin platform for managing debt, payment, merchant, customer, support, and operational workflows. Admin UI changes can affect finance, compliance, support, onboarding, and configuration work.

Common domain concepts in or near this app include:
- merchants
- customers
- debts
- payments and repayment status
- fees
- payouts and settlements
- support tickets
- sales and operations workflows
- roles and permissions
- onboarding and registration approval
- KSA integrations such as Nafath, Nafith, and Wathq where relevant

Business-sensitive expectations:
- Financial values must be clear, consistently formatted, and not misleading.
- Status labels must match backend/domain meaning.
- Admin actions should clearly communicate consequences and avoid accidental destructive changes.
- Preserve distinctions between manual and automated flows if a module already models them.
- Preserve auditability and action-history patterns if present.
- Treat merchant/customer identity and registration data as sensitive.

## Required Workflow For Future Tasks
Before coding:
- Identify the relevant route, feature module, page, components, API calls, DTOs, stores, utilities, and translations.
- Find one to three similar implementations in the repo and follow them.
- Search for existing shared components, hooks, services, constants, helpers, and types before creating anything new.
- Check whether auth, permissions, i18n, RTL, financial display, or business wording are relevant.

During coding:
- Keep the change scoped to the task.
- Follow the existing feature-folder layout and naming style.
- Reuse `axios`, React Query, Zustand, react-hook-form, Zod, shared components, Tailwind tokens, and i18n patterns.
- Handle loading, empty, error, and disabled states consistently.
- Avoid dead code, debug logs, commented-out code, speculative abstractions, duplicated logic, and unrelated refactors.

Before finishing:
- Run `pnpm build` when dependencies are installed and the change affects TypeScript/runtime behavior.
- Run `pnpm lint` when dependencies are installed.
- If dependencies or pnpm are unavailable, state that verification could not be run and why.
- Review the diff for accidental formatting churn, leaked secrets, weak validation, inconsistent labels, and broken RTL/i18n.

## Things To Avoid
- Adding dependencies without a strong reason.
- Creating a parallel API client, routing pattern, form pattern, state manager, styling system, or table/filter implementation.
- Hardcoding credentials, tokens, API endpoints, or environment-specific secrets.
- Rendering restricted or destructive actions without checking existing auth/permission patterns.
- Guessing business behavior for debt, payment, settlement, payout, customer, merchant, sanad, nafath, nafith, Wathq, fees, reconciliation, support, sales, or admin flows.
- Broad rewrites of working modules.

## Delivery Expectations
When completing a coding task, include:
- What relevant codebase patterns were found.
- What existing components/hooks/services/types were reused.
- Files changed.
- Verification run, or why verification could not be run.
- Any risks, assumptions, missing backend behavior, or unclear business rules.

