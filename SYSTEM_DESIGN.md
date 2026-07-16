# System Design — Unified Service Scheduler (Frontend)

## 1. Overview

### Purpose

Provide a **Service Advisor console** that replaces manual dealership booking: schedule a service for a vehicle at a dealership, check bay + technician availability, and persist the confirmed appointment — backed by the [Appointment Scheduler API](../appointment-scheduler-api/README.md).

This repository is the **advisor UI** for **Scenario A: The Unified Service Scheduler** (Ownership domain). The challenge **service layer** (booking rules, availability, concurrency) is implemented in [`appointment-scheduler-api`](../appointment-scheduler-api/).

### Challenge scenario selected

| Item | Choice |
|------|--------|
| Scenario | **A — The Unified Service Scheduler** |
| Domain | Ownership |
| Implementation focus | **Backend service layer** (see companion API) + this React SPA |
| Companion backend | [`appointment-scheduler-api`](../appointment-scheduler-api/) (Spring Boot REST) |

### Main features (implemented)

| Feature | Screen / layer | Backend dependency |
|---------|----------------|-------------------|
| Staff login | `/login` | `POST /api/v1/public/auth/login` |
| Dashboard overview | `/` | Private appointments + technicians/bays |
| Appointment list & filters | `/appointments` | `GET /api/v1/private/appointments` |
| Create appointment (existing or new customer) | `/appointments/new` | Public booking flow + availability check |
| Appointment detail | `/appointments/:id` | Private appointment + customer/vehicle enrichment |

### Scope

- **In scope:** Advisor-facing SPA, typed HTTP client, form validation, error i18n, TanStack Query cache
- **Out of scope (future):** Availability calendar view, status change / cancel / reschedule UI, role-based menus, automated FE tests, token refresh on 401
- **Backend owns:** dealership-scoped allocation, skill matching, pessimistic locks, `CONFIRMED` booking record (`mvn test`)

---

## 2. Functional requirements (UI)

| ID | Requirement | How it is met |
|----|-------------|---------------|
| **UI-FR-1** | Advisor can sign in | `LoginPage` → `auth.service.login` → JWT in `localStorage` (`uss.auth`) |
| **UI-FR-2** | View today's appointments | `DashboardPage` filters list by current date |
| **UI-FR-3** | Search / filter appointments | `AppointmentListPage` — date, status, client-side name search |
| **UI-FR-4** | Book for existing customer | Autocomplete customer search → vehicles → check availability → create |
| **UI-FR-5** | Book for new customer | Inline customer + vehicle form → create entities → check → book |
| **UI-FR-6** | Preview slot before booking | `checkAvailability` mutation; UI shows technician/bay preview |
| **UI-FR-7** | View appointment details | Detail page with status, resources, customer phone, VIN |

Booking uses **public** APIs (no JWT required for create path); list/detail use **private** APIs with Bearer token injected by Axios.

---

## 3. Non-functional requirements

| Area | Target | Design choice |
|------|--------|---------------|
| **Type safety** | Compile-time API contracts | Shared `types/index.ts` mirrors backend DTOs |
| **Validation** | Block invalid forms before API | Zod schemas + React Hook Form |
| **Caching** | Avoid redundant master-data calls | TanStack Query with `MASTER_STALE_TIME` (10 min) |
| **Fresh transactional data** | Lists reflect recent bookings | `TRANSACTION_STALE_TIME = 0` for appointments |
| **Errors** | User-friendly messages | Axios interceptor → `ApiError` → `translateMessageCode` (en/vi) |
| **Security** | Token not in URL | JWT in `localStorage`; `withCredentials` for session cookie |
| **Maintainability** | Thin pages, fat services | Pages compose hooks; HTTP lives in `src/services/*` |

---

## 4. Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                     Browser (React 19 SPA)                   │
├─────────────────────────────────────────────────────────────┤
│  Pages          │  Login, Dashboard, List, Create, Detail   │
│  Components     │  Layout, Table, StatusChip, Dialogs       │
│  Hooks          │  AuthProvider, useAppointments, mutations │
│  Service layer  │  appointment.service, auth.service, …     │
│  Infrastructure │  axios (interceptors), i18n, Zod schemas  │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS / JSON
                             ▼
              ┌──────────────────────────────┐
              │  Appointment API (Spring Boot) │
              │  Public + Private REST         │
              └──────────────────────────────┘
```

### Layering

1. **Presentation** — `src/pages/*`, `src/components/*` (MUI)
2. **Application hooks** — `src/hooks/queries/*`, `src/hooks/mutations/*`, `useCheckAvailability`
3. **Service layer** — `src/services/*` (one module per API domain)
4. **Cross-cutting** — `axios.ts`, `schemas/`, `utils/`, `i18n/`

Service modules live in `src/services/`; hooks in `src/hooks/`.

---

## 5. Data flow diagrams

### 5.1 Authentication

```text
LoginPage
   │ submit employeeId + password
   ▼
auth.service.login()
   ▼
POST /api/v1/public/auth/login
   ▼
AuthProvider stores { token, refreshToken, user } → localStorage
   ▼
axios interceptor adds Authorization: Bearer <token>
   ▼
ProtectedRoute allows /dashboard, /appointments/*
```

### 5.2 Create appointment (new customer)

```text
CreateAppointmentPage (customerMode = new)
   │
   ├─► createCustomer()        POST /public/customers
   ├─► createVehicle()       POST /public/customers/{id}/vehicles
   ├─► checkAvailability()   POST /public/appointments/check-availability
   │       └─► UI shows technician + bay preview (not reserved)
   └─► createAppointment()   POST /public/appointments
           └─► invalidate appointment queries → navigate to detail
```

### 5.3 Appointment list (staff)

```text
AppointmentListPage
   │
   ▼
useAppointments({ date, status, sort })
   │
   ▼
getAppointmentsList() → GET /api/v1/private/appointments
   │
   ▼
Client-side filter by customer name keyword
```

---

## 6. HTTP client layer

The challenge requires a **service layer** on backend **or** frontend. This submission implements the domain service layer on the **backend**; this repo provides a typed HTTP client over REST:

| Module | Responsibility |
|--------|----------------|
| `axios.ts` | Base URL, Bearer token, error normalization |
| `auth.service.ts` | login, logout, refresh |
| `appointment.service.ts` | list, detail, check, create, status, cancel, reschedule |
| `customer.service.ts` | search, create (public); get (private) |
| `vehicle.service.ts` | list by customer, create |
| `dealership.service.ts` | list dealerships |
| `serviceType.service.ts` | list service types |
| `technician.service.ts` | list technicians (dashboard) |
| `serviceBay.service.ts` | list bays (dashboard) |

Hooks in `src/hooks/` call services and manage React Query cache keys (`constants/queryKeys.ts`).

---

## 7. Routing & access control

| Path | Guard | Page |
|------|-------|------|
| `/login` | `GuestRoute` (redirect if authenticated) | Login |
| `/` | `ProtectedRoute` | Dashboard |
| `/appointments` | `ProtectedRoute` | List |
| `/appointments/new` | `ProtectedRoute` | Create |
| `/appointments/:id` | `ProtectedRoute` | Detail |

Unauthenticated users are redirected to `/login` with `state.from` preserved for future deep-link support.

---

## 8. State management strategy

| State type | Tool | Notes |
|------------|------|-------|
| Server data | TanStack Query | Queries for lists; mutations invalidate keys |
| Auth session | React Context + localStorage | `AuthProvider` |
| Form state | React Hook Form | Create appointment, login |
| UI feedback | Snackbar context | Success / error toasts |
| Ephemeral UI | `useState` | Filters, dialogs, availability preview |

No global Redux/Zustand — server state stays in React Query.

---

## 9. Error handling

Backend returns:

```json
{ "messageCode": "error.appointment.no_available_technician", "message": "..." }
```

Flow:

1. Axios response interceptor reads `messageCode`
2. `translateMessageCode()` maps to en/vi strings in `i18n/locales/*/errors.ts`
3. Pages use `getApiErrorMessage(error)` for display

Known booking conflict codes are documented in [appointment-scheduler-api/docs/API.md](../appointment-scheduler-api/docs/API.md).

---

## 10. API usage split (public vs private)

| Operation | API visibility | Rationale |
|-----------|----------------|-----------|
| Login / logout | Public | Auth endpoints |
| Customer search & create | Public | Same flow as kiosk/guest booking |
| Vehicle create | Public | Booking prerequisite |
| Check availability & create appointment | Public | Backend allocates resources; advisor UI reuses booking API |
| Appointment list & detail | Private | Staff-only board |
| Technicians / bays (dashboard stats) | Private | Operational visibility |

This mirrors the backend design: booking logic is centralized; staff APIs add management and listing.

---

## 11. Future improvements

| Idea | Notes |
|------|-------|
| Availability calendar | Sidebar placeholder; technician/bay timeline view |
| Status actions on detail | Wire `updateAppointmentStatus`, `cancel`, `reschedule` |
| Token refresh | Auto-refresh on 401 using `refreshToken` |
| Role-based navigation | Hide master-data routes for ADVISOR vs MANAGER |
| E2E / unit tests | Vitest + MSW for services; Playwright for booking flow |
| Pagination UI | Read `x-total-count` header from list APIs |
| Optimistic updates | For status changes after mutations added |

---

## References

- [README.md](README.md) — run instructions
- [appointment-scheduler-api/SYSTEM_DESIGN.md](../appointment-scheduler-api/SYSTEM_DESIGN.md) — backend design
- [appointment-scheduler-api/docs/API.md](../appointment-scheduler-api/docs/API.md) — REST contract
