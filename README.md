# SmartMart Client

Frontend application for SmartMart built with React (Create React App).

## Tech Stack

- React 19
- React Router
- Redux Toolkit
- Axios
- Recharts

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- SmartMart server running locally or deployed

## Environment Configuration

The app reads API base URL from `REACT_APP_API_BASE_URL`.
The login page demo card can also use:

- `REACT_APP_DEMO_USERNAME`
- `REACT_APP_DEMO_PASSWORD`

Current files:

- `.env` (shared/default): points to deployed Render backend
- `.env.development.local` (local-only): points to local backend

Example values:

```env
# .env
REACT_APP_API_BASE_URL=https://smartmart-server-g79g.onrender.com
REACT_APP_DEMO_USERNAME=MartAdmin
REACT_APP_DEMO_PASSWORD=admin12345

# .env.development.local
REACT_APP_API_BASE_URL=http://localhost:5000
```

Note: restart the dev server after changing `.env` files.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm start
```

3. Open:

```text
http://localhost:3000
```

If port 3000 is busy, CRA will prompt for another port.

## Available Scripts

- `npm start` -> run development server
- `npm run build` -> production build in `build/`
- `npm test` -> run tests
- `npm run eject` -> eject CRA config (irreversible)

## Build for Deployment

```bash
npm run build
```

This creates optimized static files in `build/`.

## Troubleshooting

- Blank data in UI: verify `REACT_APP_API_BASE_URL` points to the correct backend.
- CORS/API errors: confirm backend is running and allows client origin.
- Env change not applied: stop and restart `npm start`.

## Redeploy Checklist (Frontend)

1. Confirm API URL target (`.env` for deployed target, `.env.development.local` for local dev).
2. Run `npm run build` locally to validate production build.
3. Commit and push changes.
4. Trigger deployment in your hosting platform.
