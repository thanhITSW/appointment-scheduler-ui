# Unified Service Scheduler

React SPA for **Service Advisors** — appointment scheduling to replace manual booking, integrated with [Appointment Scheduler API](../appointment-scheduler-api/README.md).

**Challenge:** Scenario A — Unified Service Scheduler · **Service layer focus:** [backend](../appointment-scheduler-api/) (`mvn test`) · **This repo:** advisor UI + typed HTTP client

**System design:** [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) · **API contract:** [appointment-scheduler-api/docs/API.md](../appointment-scheduler-api/docs/API.md)

---

## Tech stack

| Layer | Choice |
|-------|--------|
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Components | Material UI 9 + MUI X Date Pickers |
| Routing | React Router DOM 7 |
| Server state | TanStack Query 5 |
| HTTP | Axios |
| Forms | React Hook Form + Zod |
| Dates | Dayjs |

---

## Features

- Staff login (`employeeId` + password) with JWT session
- Dashboard — today's appointments, stats, technician/bay counts
- Appointment list — filter by date/status, search by customer name
- Create appointment — existing customer (search) or new customer + vehicle inline
- Availability preview before booking (technician + bay names at the selected dealership)
- Appointment detail — status, resources, customer phone, VIN

---

## Quick start

### 1. Backend

```bash
cd ../appointment-scheduler-api
cp .env.example .env
docker compose up -d
mvn spring-boot:run
```

### 2. Frontend

```bash
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:8080

npm install
npm run dev
```

- UI: http://localhost:5173  
- Swagger: http://localhost:8080/swagger  

### Demo login

| employeeId | Role | Password |
|------------|------|----------|
| `adv01` | ADVISOR | `Admin@123` |

---

## Routes

| Path | Page |
|------|------|
| `/login` | Login |
| `/` | Dashboard |
| `/appointments` | Appointment list |
| `/appointments/new` | Create appointment |
| `/appointments/:id` | Appointment detail |

---

## API map (screens)

| Screen | APIs |
|--------|------|
| Login | `POST /api/v1/public/auth/login` |
| Dashboard | `GET /api/v1/private/appointments`, technicians, bays |
| Appointment list | `GET /api/v1/private/appointments` |
| Create | public customers/vehicles + check-availability + create |
| Detail | `GET /api/v1/private/appointments/{id}` + customer/vehicle |

Booking uses **public** endpoints; staff list/detail use **private** endpoints with Bearer token.

---

## HTTP client layer

HTTP calls live in `src/services/` (`appointment`, `auth`, `customer`, `vehicle`, …), wrapped by TanStack Query hooks in `src/hooks/`.

---

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run preview  # preview production build
npm run lint     # oxlint
```

---

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8080` | Appointment API origin |

---

## Challenge submission

| Requirement | Deliverable |
|-------------|-------------|
| Scenario | A — The Unified Service Scheduler |
| System design | [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) + [API SYSTEM_DESIGN](../appointment-scheduler-api/SYSTEM_DESIGN.md) |
| Service layer (primary) | [`appointment-scheduler-api`](../appointment-scheduler-api/) — booking + availability + locks · `mvn test` |
| Frontend | This SPA — advisor UX calling the API |
| Video walkthrough | Record locally (login → dashboard → create → detail) |

---

## License

Internal / challenge project.
