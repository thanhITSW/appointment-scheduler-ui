# Dealership Service Scheduler

React SPA for **Service Advisors** — view appointments, book service visits, integrated with [Appointment API](../appointment-api/README.md).

**System design:** [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) · **API contract:** [appointment-api/docs/API.md](../appointment-api/docs/API.md)

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
- Availability preview before booking (technician + bay names)
- Appointment detail — status, resources, customer phone, VIN

---

## Quick start

### 1. Backend

```bash
cd ../appointment-api
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

## Service layer

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
| Scenario | Dealership Appointment Scheduling |
| System design | [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) |
| Frontend service layer | `src/services/*` |
| Backend + tests | [`appointment-api`](../appointment-api/) — `mvn test` |
| Video walkthrough | Record locally (login → dashboard → create → detail) |

---

## License

Internal / challenge project.
