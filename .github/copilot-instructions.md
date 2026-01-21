# GitHub Copilot / Agent instructions for Smart Grocery Admin

**TL;DR:** This repo contains a React admin UI (Create React App) and an Express/Mongo backend. Run the backend first (uses `MONGO_URI` + `JWT_SECRET` in `.env`), seed the admin with `node seedAdmin.js`, then start the frontend with `npm start` inside the client folder.

## Project layout (big picture)
- `Server/` (server) — Express API + Mongoose models. Entry: `Server.js` (ESM). Connects to MongoDB via `config/db.js` using `process.env.MONGO_URI`.
- `adminpanel/` (client) — React app (Create React App). App code in `src/`. Uses MUI and Redux Toolkit slices in `src/Store/`.
- `uploads/` — file storage for images, served statically by the server at `/uploads`.

## Key behaviors & architectural notes 🔧
- Auth model: Admins authenticate via `POST /admin/login` and receive a JWT (1d). The frontend stores the token in `localStorage` under `token` and sends it using `Authorization: Bearer <token>` (see `src/Api/axios.js`).
- Route separation: Some routes are registered twice—under `/admin` (admin-only, protected by `protectAdmin`) and under `/api` (public endpoints like product listings). Check `Server.js` before changing route registration.
- Middleware variation: Two protectors exist: `Middlewares/auth.middleware.js` and `Middlewares/Protectadmin.js`. Be careful which one a route uses — they differ slightly in checks and response messages.
- File uploads use multer (`Middlewares/upload.middleware.js`) and are limited to images (5MB, 5 files max). Uploaded files are placed in `uploads/` and exposed at `/uploads/<filename>`.
- Database seeding: `seedAdmin.js` creates an admin account (email `admin@smartgrocery.com` / `admin123`) — relies on `.env` for DB connection.

## Developer workflows (how to run / debug) ▶️
- Backend
  - Ensure `.env` exists with `MONGO_URI` and `JWT_SECRET`.
  - Seed admin (optional): `node seedAdmin.js` (from `server/` directory).
  - Start server: `node Server.js` or `npm start` in `server/` (script uses `node server.js`).
- Frontend
  - From `adminpanel/` (client) run: `npm install` then `npm start` (CRA development server).
  - API base URL: `http://localhost:5000` (see `src/Api/axios.js`).

## Common patterns & conventions 🧭
- Redux: asynchronous operations use `createAsyncThunk`. Errors from the server are passed through `rejectWithValue(err.response?.data?.message)` and slices read `state.error` for display.
- Auth flow: `adminLogin` action stores JWT + admin in state and writes `token` to `localStorage`. Components rely on `token` state to redirect (see `Login.js`).
- Controllers respond with simple JSON `{ message }` on errors and well-formed objects on success. Use status codes as implemented (401/403/404/500).
- Server uses ESM (`type: module` in `server/package.json`) — use `import` syntax and pay attention to default exports vs named exports.

## Important files to review for edits 🔍
- Server: `Server.js`, `config/db.js`, `Controllers/*`, `routes/*`, `Models/*`, `Middlewares/*`, `seedAdmin.js`.
- Client: `src/Api/axios.js`, `src/Store/*` (slices), `src/Pages/*` for typical UI patterns.

## Useful examples you can use right away
- Login request: `POST /admin/login` body `{ email, password }` → returns `{ token, admin }`.
- Create product (admin): `POST /admin/products` with `Authorization: Bearer <token>` and `multipart/form-data` including `images` array and product fields.
- Public product list: `GET /api/products` (no auth required).

## Safety & quick checks before PRs
- If modifying auth or routes: double-check which prefix is used (`/admin` vs `/api`) and which middleware (`protectAdmin` vs `verifyJWT/isAdmin`) is expected.
- When adding file uploads, respect the multer config (image MIME types, size limit) and ensure `uploads/` permissions are correct.
- If altering DB models, ensure migrations (if any) are handled by seeding or a migration script; there are no migrations present — prefer additive, compatible changes where possible.

---
If anything here is unclear or you want small examples added (e.g., a short cURL snippet for each endpoint), tell me which area to expand and I'll update this file. ✅
