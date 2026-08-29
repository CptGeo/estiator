# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Estiator is an open-source F&B (Food & Beverage) business management platform built as a Master's Thesis prototype. It handles reservations, tables, employees, customers, schedules, and business settings. **This is an academic prototype — not production-ready.**

## Commands

### Client (`/client`)
```bash
npm run dev          # Start dev server (port 80)
npm run dev:expose   # Dev server exposed to network
npm run build        # Type-check + Vite production build
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run preview      # Preview production build
```

### Server (`/server`)
```bash
./gradlew bootRun    # Start Spring Boot server (HTTPS port 8443)
./gradlew test       # Run JUnit tests
./gradlew build      # Build JAR
```

### Full stack (Docker)
```bash
docker compose up --build    # Build and run all three containers
```

## Architecture

### Monorepo Structure
Three top-level directories map directly to three Docker containers:
- `/client` — React/TypeScript SPA (Vite)
- `/server` — Spring Boot REST API (Java 21)
- `/database` — MySQL 8 init scripts (`db-init.sql`)

### Client Architecture

**Path aliases** (configured in `vite.config.ts`):
| Alias | Path |
|-------|------|
| `@components` | `src/components` |
| `@context` | `src/context` |
| `@core` | `src/core` |
| `@hooks` | `src/hooks` |
| `@layouts` | `src/layouts` |
| `@pages` | `src/pages` |
| `@settings` | `src/settings.json` |

**Data flow**: Pages/components → custom `useQuery*` hooks (TanStack Query) → `getReq`/`postReq`/`patchReq`/`deleteReq` wrappers in `core/utils.ts` → axios `client` instance (`core/request.ts`) → Spring Boot API at `https://<hostname>:8443`.

**Routing** (`App.tsx`): React Router v6 with nested layouts:
- `/admin/*` — `PrivateLayout` with `[ROLE_ADMIN, ROLE_MODERATOR]` permissions
- `/admin/employees/*` — `PrivateLayout` with `[ROLE_ADMIN]` only
- `/client/*` — `PrivateLayout` with `[ROLE_CLIENT]` permissions
- `/login`, `/register`, `/passwordReset`, `/resetPassword` — `UnauthorizedOnlyLayout` (redirects authenticated users away)

**Context providers** (all wrapped at app root):
- `NotificationProvider` — toast notifications via `useNotification()`
- `QueryClientProvider` — TanStack Query client
- `AuthProvider` (inside router) — JWT auth state via `useAuth()`
- `DrawerProvider` — sidebar drawer state via inside `PrivateLayout`
- `TablesProvider` — selected table state for the floor plan grid

**Authorization**: `PermissionGuard` component for UI-level gating; `PrivateLayout` handles route-level redirects. Both use `userIsAllowed()` from `core/auth.ts`.

**All shared types** live in `core/types.ts`. All route path strings are centralized in the `allRoutes` map in `core/utils.ts`.

### Server Architecture

Standard Spring layered architecture under `com.kalyvianakis.estiator.io`:

```
controller/  →  service/ (interface + impl)  →  repository/  →  model/
```

Additional packages:
- `dto/` — Request/response objects (LoginRequest, SignupRequest, ReservationRequest, etc.)
- `enums/` — `ReservationStatus`, `ScheduleStatus`, `UserStatus` (each stored as `Short` in DB)
- `component/patcher/` — PATCH semantics via `IPatcher<T>` (merge non-null fields from partial update)
- `utils/` — JWT filter, helpers, exception handlers
- `utils/config/` — `SecurityConfig`, `ConnectorConfig` (Tomcat SSL), `SimpleMailMessageExt`
- `specifications/` — JPA Specifications for dynamic queries
- `metamodel/` — JPA static metamodel

## Key Patterns and Non-Obvious Details

### Status Stored as `Short` in DB
Both `Reservation` and `User` entities store status as a numeric `Short` in the database column (`statusValue`) but expose it as a typed enum (`status`) via `@Transient`. JPA lifecycle callbacks sync them:
- `@PostLoad` → fills `status` enum from `statusValue`
- `@PrePersist`/`@PreUpdate` → writes `statusValue` from `status`

**Reservation statuses**: `0=Pending`, `1=Cancelled`, `2=Confirmed`, `3=Booked`, `4=Completed`

**Reservation lifecycle**: Pending → Confirmed → Booked → Completed/Cancelled → (archived). Transitions are enforced in `ReservationService` — e.g., `complete()` requires `Booked` status.

### JWT Token in localStorage
The token is stored in localStorage as a JSON-stringified string (double-encoded). The client parses it with `JSON.parse()` before attaching as `Bearer` header. `decryptJwt()` in `core/auth.ts` decodes the payload (which embeds the full `UserData` object) client-side without a server round-trip.

### CORS Handling
Spring's CORS support is **disabled** in `SecurityConfig`. CORS headers are set manually in `JwtAuthFilter` on every response. The server runs HTTPS-only on port 8443.

### Client Connects Dynamically
`core/request.ts` uses `location.hostname` for the API base URL (`https://<hostname>:8443`), so the same client build works both in Docker and local development without rebuilding.

### `immune` Flag on Users
The initial admin user (`admin@estiator.io`) is seeded with `immune=1` in `db-init.sql`. Immune users cannot be deleted or demoted. Admins created later via `/auth/signup/admin` are not immune by default.

### Email Notifications
`EmailSenderService` sends transactional emails (reservation created/confirmed/cancelled/completed, user created, password reset). All write endpoints accept an optional `?inform=false` query param to suppress emails — useful for testing or bulk operations.

### Table Floor Plan
Tables have `x`/`y` grid coordinates. The `/admin/tables` page renders a drag-and-drop floor plan using `@dnd-kit/core`. Table positions are persisted via PATCH requests. `src/settings.json` holds local UI settings like `gridSize` and multipliers.

### Conflict Detection
`ReservationRepository` uses native SQL queries to detect time-overlap conflicts on the same table+date. Conflict count is computed per-reservation and attached as a `@Transient` field when listing all reservations.

## Environment Configuration

| File | Purpose |
|------|---------|
| `database.env` | MySQL credentials for Docker (copy from `example.database.env`) |
| `server/.env` | Server secrets: `JWT_SECRET`, `SSL_KEYSTORE_PASSWORD`, `SMTP_*`, `EMAIL_*`, `CLIENT_*` |
| `server/src/main/resources/application.properties` | Spring config; reads from `.env` via `spring.config.import` |

For local development, edit `application.properties` directly. For Docker, use the env files.

## Default Credentials

| Email | Password | Role |
|-------|----------|------|
| `admin@estiator.io` | `12341234` | Admin (full access, immune) |
| `moderator@estiator.io` | `12341234` | Moderator (read + limited write) |

## Role Summary

| Role | Access |
|------|--------|
| `ROLE_ADMIN` | Full access including employee management and DELETE operations |
| `ROLE_MODERATOR` | Admin dashboard (reservations, tables, customers, settings) but no employee management or deletes |
| `ROLE_CLIENT` | Own reservations and personal settings only |
| `ROLE_GUEST` | No authenticated access |
