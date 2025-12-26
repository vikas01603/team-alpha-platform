# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository overview

This repo is a multi-module management system composed of three feature modules and a shared utilities package:
- `homepage-module/` – public marketing site (Team 1)
- `client-module/` – client-facing portal (Team 2)
- `admin-module/` – internal admin dashboard (Team 3)
- `shared/` – cross-cutting backend utilities (database, auth, middleware, role constants)

The detailed intended folder layout and responsibilities are documented in `docs/team Alpha - internship.txt`. Treat that document as the source of truth for structural conventions.

## High-level architecture

### Module boundaries

Each feature module is structured as an independent frontend + backend pair:
- `homepage-module/frontend/`
- `homepage-module/backend/`
- `client-module/frontend/`
- `client-module/backend/`
- `admin-module/frontend/`
- `admin-module/backend/`

Frontends are React single-page apps organized under `src/` into:
- `pages/` – top-level route views (e.g., `Home.jsx`, `Dashboard.jsx`, `Bookings.jsx`)
- `components/` – reusable UI pieces
- `services/` – API client logic encapsulating HTTP calls to the corresponding backend (e.g., `blog.service.js`, `payment.service.js`, `leads.service.js`)
- `App.jsx` – root component and router integration

Backends are Express-style Node services organized under `src/` into:
- `routes/` – route definitions grouped by domain (e.g., `inquiry.routes.js`, `booking.routes.js`, `auth.routes.js`)
- `controllers/` – request handlers implementing module-specific business logic
- `models/` – persistence models (e.g., Mongo/Mongoose models like `Inquiry.model.js`, `Blog.model.js`, `Gallery.model.js`)
- `config/` – service-specific configuration (e.g., `db.js` for database connection wiring)
- `app.js` – Express app composition (middleware, routes, etc.)
- `server.js` – process entrypoint that imports `app` and starts listening on a port

The `shared/` package contains cross-module backend concerns:
- `shared/database/mongo.js` – MongoDB/Mongoose connection helper(s)
- `shared/auth/jwt.js` – JWT-related helpers (signing/verifying tokens)
- `shared/middlewares/auth.middleware.js` – authentication/authorization middleware
- `shared/middlewares/error.middleware.js` – global error handling middleware
- `shared/constants/roles.js` – role identifiers used across modules (e.g., `ADMIN`, `CLIENT`)

When extending any backend, prefer reusing pieces from `shared/` rather than re-implementing core concerns like DB access or auth.

### Cross-cutting design notes

- Each module backend should mount only its own routes and use shared middlewares/utilities from `shared/`.
- Frontends rely on their `services/` layer as the single place where API endpoints and request shapes are defined; pages/components should not hard-code backend URLs.
- The repo does not currently define a gateway or API aggregator; modules are expected to be deployed as separate services.

## Development commands

At the time of writing, `package.json` files are minimal and do not define `scripts` for dev servers, builds, or tests. Most work will involve either:
- Adding appropriate `scripts` fields and tooling (e.g., React build tooling, test runners), and/or
- Running Node entrypoints directly where they exist.

### Installing dependencies

There is a root `package.json` marked `"private": true` but it does not yet define workspaces or scripts. For now, treat each module as an independent Node project.

Install dependencies per module (once scripts/dependencies are added):
- Homepage frontend: `cd homepage-module/frontend` then `npm install`
- Homepage backend: `cd homepage-module/backend` then `npm install`
- Client frontend: `cd client-module/frontend` then `npm install`
- Client backend: `cd client-module/backend` then `npm install`
- Admin frontend: `cd admin-module/frontend` then `npm install`
- Admin backend: `cd admin-module/backend` then `npm install`

If you introduce a workspace or monorepo tool (e.g., npm/pnpm/yarn workspaces, Turborepo), update this section accordingly and centralize installation at the repo root.

### Running backends

Currently, only `homepage-module/backend/server.js` is wired to an `app.js` implementation; the other backends have `server.js` placeholders that will need to be fleshed out before they provide functionality.

Homepage backend (Express):
- `cd homepage-module/backend`
- `node server.js`

When you implement the admin/client backends, follow the same pattern:
- Create `src/app.js` exporting an Express app
- Wire `server.js` to import `app` and call `app.listen(PORT)`
- Start with `node server.js` (or add an `npm run dev` script via nodemon/ts-node as needed)

### Running frontends

The frontend `package.json` files (`admin-module/frontend/package.json`, `client-module/frontend/package.json`, `homepage-module/frontend/package.json`) currently only declare `name` (and `version`) and do not include dev/build scripts or dependencies.

Before you can run any frontend, you will need to:
1. Choose a tooling stack (e.g., Vite, CRA, Next.js, plain webpack) and add the appropriate dependencies.
2. Define scripts such as `"start"`, `"dev"`, and `"build"` in each frontend `package.json`.
3. Then run them with `npm run dev` / `npm start` / `npm run build` from the respective frontend directory.

Do not assume any particular tooling is present until you add it; check the `package.json` for scripts first.

### Linting and tests

No linting or testing tools are configured yet in any of the `package.json` files (no `eslint`, `jest`, `vitest`, etc. scripts are present).

If you need tests or linting:
- Add the relevant dev dependencies and `scripts` to the appropriate `package.json`.
- Document new commands here (e.g., `npm test`, `npm run lint`) and how to run a single test file or test suite (e.g., `npm test -- path/to/file.test.js`).

## How to work effectively as an AI agent

- Use `docs/team Alpha - internship.txt` as the canonical description of the intended folder structure and module responsibilities.
- When asked to add features, respect the module boundaries: keep homepage/client/admin concerns in their respective modules and reuse `shared/` utilities where possible.
- Before assuming a command (build, lint, test) exists, inspect the nearest `package.json` and update it explicitly if new tooling is required.
- When introducing shared backend logic, prefer centralizing it under `shared/` and importing it into module backends rather than duplicating code.
