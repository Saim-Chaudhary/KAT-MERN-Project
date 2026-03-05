# Backend README

This directory contains the Express/MongoDB API for the KAT‑MERN project.

## Setup

1. Copy `.env.example` to `.env` and populate the values:
   - `MONGO_URI` – connection string for MongoDB
   - `PORT` – port to run the server on (defaults to 5000)
   - `NODE_ENV` – e.g. `development` or `production`
   - `JWT_SECRET` – secret used to sign JWT tokens
   - `CLIENT_URL` – allowed frontend origin for CORS

2. Install dependencies from the workspace root (the `package.json` covers backend):
   ```bash
   npm install
   ```

3. Start the server in development mode:
   ```bash
   npm run dev
   ```

## API Overview

Base URL is `/api/v1`.

### Authentication
- `POST /users` – register a new user
- `POST /users/login` – log in and receive a JWT
- `GET /users/profile` – get current user, requires `Authorization: Bearer <token>`

### Packages
- `GET /packages` – public listing (cached, paginated)
- `GET /packages/:id` – cached detail view
- POST/PUT/DELETE `/packages` – modification requires admin role (see `role` field on `User` model)

### Hotels
- `GET /hotels` – public listing (cached, paginated)
- `GET /hotels/:id` – cached detail
- POST/PUT/DELETE `/hotels` – admin only

### Bookings
- `GET /bookings` – authenticated users see their own bookings; admins see all
- `POST /bookings` – create a booking (user field auto‑assigned)
- `GET /bookings/:id` – view a booking (ownership enforced)
- PUT/DELETE `/bookings/:id` – admin only

### Analytics
- `GET /analytics` – admin only; returns request counts grouped by route (requires Redis)


**Utilities & features**

- Advanced search/filtering on resources supporting text, price, active status, and geo queries (`utils/filter.js`)
- Caching using Redis for expensive GET requests (`utils/cache.js`)
- File upload endpoint (`/upload`) using multer; files stored under `uploads/` and exposed statically
- Real-time notifications via socket.io when bookings are created/updated
- Pagination helper (`utils/paginate.js`)
- Service layer separating business logic (`services/` folder)
- Role‑based authorization with generic `roleCheck` middleware
- Logging via Winston (`utils/logger.js`)
- Analytics middleware records hit counts per route and exposes admin endpoint `/analytics`
- Monitoring endpoint available at `/status` (powered by express-status-monitor)
- Rate limiting applied globally, security headers via Helmet

Use the controllers, routes, and middleware in this directory as templates when adding new resources.