# Ably Laravel → React (Vite) Realtime Playground

A React + Vite front‑end wired to a Laravel backend via Ably + Laravel Echo. The landing page demonstrates:

- Live status updates (broadcast from Laravel → Ably → Echo)
- Notifications stream
- Public broadcast demo
- Direct chat (user ↔ user) via per‑user channel

## Quick Start

1) Install dependencies

```bash
npm install
```

2) Configure environment

Create `.env` with:

```bash
VITE_ABLY_AUTH_URL=http://ably_laravel.test/api/ably/token
VITE_API_BASE_URL=http://ably_laravel.test
# Optional if you use API key mode
# VITE_ABLY_API_KEY=xxx:yyy
# VITE_ABLY_CLIENT_ID=local-dev
```

3) Run the dev server

```bash
npm run dev
```

Ensure the Laravel app is running and broadcasts the demo events on the following endpoints:

- POST `/api/status-demo`
- POST `/api/notify-demo`
- POST `/api/broadcast-demo`
- POST `/api/dm-send`

## Channels and Events

- `public-demo` → `.MessageSent`
- `notify-demo` → `.DemoNotificationSent`
- `status-demo` → `.DemoStatusChanged`
- `chat.user.{userId}` → `.DirectMessageSent`

Client uses `@ably/laravel-echo` with `Ably.Realtime` token auth from `VITE_ABLY_AUTH_URL`.

## File Structure

```text
ably-laravel-to-react/
├─ .gitignore
├─ README.md
├─ eslint.config.js
├─ index.html
├─ package.json
├─ package-lock.json
├─ public/
│  └─ vite.svg
├─ src/
│  ├─ App.css
│  ├─ App.jsx               # Main app component (simplified)
│  ├─ components/           # 4 main functional components
│  │  ├─ Card.jsx          # Reusable card wrapper
│  │  ├─ ChatTesting.jsx   # Real-time messaging component
│  │  ├─ NotificationTest.jsx # Notification system component
│  │  ├─ LiveStatusTesting.jsx # Live status updates component
│  │  └─ DirectChat.jsx    # User-to-user messaging component
│  ├─ utils/
│  │  └─ api.js            # API utilities and constants
│  ├─ app.js                # Example subscription (parity with Laravel sample)
│  ├─ assets/
│  │  └─ react.svg
│  ├─ realtime-setup.js     # axios baseURL, Echo + Ably client config
│  ├─ hooks/
│  │  ├─ useChat.js         # Chat functionality hook
│  │  ├─ useNotifications.js # Notification functionality hook
│  │  ├─ useStatus.js       # Status updates functionality hook
│  │  └─ useDirectChat.js   # Direct messaging functionality hook
│  ├─ index.css             # Global styles + Tailwind import
│  └─ main.jsx              # App bootstrap (imports realtime-setup.js)
└─ vite.config.js           # Vite + Tailwind plugin
```

## Notes

- CORS: React posts use `withCredentials: false` for demo endpoints; Ably token auth uses `xhrWithCredentials` so your Laravel session/CSRF may be used if needed.
- In dev, React Strict Mode can mount effects twice; listeners are cleaned up to prevent duplicate subscriptions.
