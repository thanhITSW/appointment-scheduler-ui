# Dealership Service Scheduler

React UI for Service Advisors to create and manage vehicle service appointments, check technician/bay availability, and confirm bookings.

## Stack

- React 19 + TypeScript + Vite
- Material UI + MUI X Date Pickers
- React Router DOM
- TanStack Query + Axios
- React Hook Form + Zod
- Dayjs

## Getting started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env`:

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL |
| `VITE_USE_STUBS` | `true` (default) uses in-memory mock data; set `false` to call the real API |

## Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – typecheck + production build
- `npm run preview` – preview production build

## Routes

| Path | Page |
|------|------|
| `/` | Dashboard |
| `/appointments` | Appointment list |
| `/appointments/new` | Create appointment |
| `/appointments/:id` | Appointment detail |

## Project layout

```
src/
  app/           App, router, providers
  components/    common + layout
  hooks/         queries, mutations, useCheckAvailability
  pages/         Dashboard, List, Create, Detail
  services/      Axios API clients (stub-aware)
  schemas/       Zod form schemas
  types/         Shared TypeScript types
  mocks/         In-memory stub store
  i18n/          English strings + t() helper
  theme/         MUI theme
```

## Auth

Protected routes redirect to `/login`. Demo credentials (stub mode):

- Email: `advisor@dealership.com`
- Password: `password`

Session is stored in `localStorage` under `dss.auth`. Sign out from the avatar menu in the header.

## Create appointment – customer modes

- **Existing Customer**: pick customer → pick vehicle for that customer
- **New Customer**: enter customer + vehicle details; confirming the appointment creates both in stub store (and they appear in subsequent searches)
