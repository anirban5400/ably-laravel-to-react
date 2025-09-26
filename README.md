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

## 🏗️ Architecture Overview

This React application has been refactored into a professional, modular structure with 4 main functional components, each with their own custom hooks and utilities.

## 📁 File Structure

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
│  ├─ components/
│  │  ├─ Card.jsx                 # Reusable card wrapper component
│  │  ├─ Navigation.jsx           # Navigation and breadcrumb component
│  │  ├─ ChatTesting.jsx          # Real-time messaging component
│  │  ├─ NotificationTest.jsx     # Notification system component
│  │  ├─ LiveStatusTesting.jsx    # Live status updates component
│  │  └─ DirectChat.jsx           # User-to-user messaging component
│  ├─ pages/
│  │  ├─ LandingPage.jsx          # Main landing page with feature cards
│  │  └─ RealtimePlayground.jsx   # Realtime feature testing page
│  ├─ hooks/
│  │  ├─ useChat.js              # Chat functionality hook
│  │  ├─ useNotifications.js     # Notification functionality hook
│  │  ├─ useStatus.js            # Status updates functionality hook
│  │  └─ useDirectChat.js        # Direct messaging functionality hook
│  ├─ utils/
│  │  ├─ api.js                  # API utilities and constants
│  │  └─ lazy-realtime-setup.js  # Lazy loading for Ably connection
│  ├─ App.jsx                     # Main app component with routing
│  ├─ App.css                     # Global styles
│  └─ main.jsx                    # Application entry point
└─ vite.config.js                 # Vite + Tailwind plugin
```

## 🛣️ Routing Structure

The application uses React Router DOM for client-side routing:

### **Routes:**
- **`/`** - Landing page with feature cards
- **`/realtime-feature-playground`** - Realtime feature testing page

### **Navigation:**
- **Sticky Navigation Bar** - Always visible with home button and breadcrumbs
- **Breadcrumb Navigation** - Shows current location in the app
- **Back Button** - Easy navigation back to home

### **Lazy Loading Optimization:**
- **Landing Page** (`/`) - No Ably connection, fast loading
- **Playground Page** (`/realtime-feature-playground`) - Ably connection initialized on demand
- **Smart Loading** - Connection only established when real-time features are needed
- **Error Handling** - Graceful fallback if connection fails

## 🧩 Component Details

### 1. **ChatTesting Component**
- **Purpose**: Real-time messaging functionality
- **Hook**: `useChat`
- **Features**:
  - Send messages to public channel
  - Receive real-time messages
  - Message history display
  - Loading states and error handling

### 2. **NotificationTest Component**
- **Purpose**: Notification system
- **Hook**: `useNotifications`
- **Features**:
  - Send notifications with different types (info, success, warning, error)
  - Receive real-time notifications
  - Notification history display
  - Form validation

### 3. **LiveStatusTesting Component**
- **Purpose**: Live status updates
- **Hook**: `useStatus`
- **Features**:
  - Announce user status (online/offline)
  - Receive real-time status updates
  - Status history display
  - Pre-populated with sample data

### 4. **DirectChat Component**
- **Purpose**: User-to-user messaging
- **Hook**: `useDirectChat`
- **Features**:
  - Connect to private channels
  - Send direct messages between users
  - Real-time message delivery
  - Connection status management

## 🎣 Custom Hooks

Each component uses a dedicated custom hook that encapsulates:
- **State Management**: Component-specific state
- **Side Effects**: WebSocket listeners and cleanup
- **API Calls**: HTTP requests with error handling
- **Business Logic**: Component-specific functionality

### Hook Benefits:
- **Separation of Concerns**: UI logic separated from business logic
- **Reusability**: Hooks can be reused across components
- **Testability**: Hooks can be tested independently
- **Maintainability**: Clear, focused responsibilities

## 🛠️ Utilities

### `api.js`
- **`parsePayload()`**: Safely parse WebSocket payloads
- **`post()`**: Standardized API POST requests
- **`API_ENDPOINTS`**: Centralized endpoint constants

### `lazy-realtime-setup.js`
- **`initializeRealtime()`**: Lazy initialization of Ably connection
- **`disconnectRealtime()`**: Clean disconnection and cleanup
- **`getEcho()`**: Get Echo instance with auto-initialization
- **`getAblyClient()`**: Get Ably client with auto-initialization

## 🔧 Key Features

### Professional Code Structure:
- ✅ **Modular Components**: Each feature in its own component
- ✅ **Custom Hooks**: Business logic separated from UI
- ✅ **Error Handling**: Comprehensive error management with user-friendly messages
- ✅ **Loading States**: User feedback during operations
- ✅ **TypeScript-Ready**: JSDoc comments for better IDE support
- ✅ **Clean Code**: Readable, maintainable, and well-documented
- ✅ **Separation of Concerns**: Clear boundaries between layers

### Real-time Features:
- ✅ **WebSocket Integration**: Laravel Echo + Ably
- ✅ **Channel Management**: Automatic cleanup and reconnection
- ✅ **Event Handling**: Robust payload parsing
- ✅ **State Synchronization**: Real-time UI updates
- ✅ **Lazy Loading**: Connection only when needed
- ✅ **Network Error Handling**: Timeout and connection error management

### Performance Optimizations:
- ✅ **Lazy Loading**: Ably connection only on demand
- ✅ **Memory Management**: Proper cleanup on component unmount
- ✅ **Error Recovery**: Graceful fallback for connection issues
- ✅ **Production Build**: Optimized and minified assets

## 🧪 Testing

Each component is designed to be easily testable:
- **Unit Tests**: Test individual hooks and components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows

## 📈 Benefits of This Structure

1. **Maintainability**: Easy to modify individual features
2. **Scalability**: Simple to add new real-time features
3. **Reusability**: Components and hooks can be reused
4. **Testability**: Clear separation makes testing easier
5. **Performance**: Optimized re-renders and memory usage
6. **Developer Experience**: Clear, readable, and well-documented code

## Building for Production

To create a production build:

```bash
npm run build
```

This creates a `dist/` folder with optimized, minified files ready for deployment.

### Previewing the Build

To test your production build locally, you can serve the `dist` folder using several methods:

**Option 1: Using npx serve (recommended)**
```bash
npx serve dist -p 3000
```
Then open http://localhost:3000

**Option 2: Using Python HTTP server**
```bash
cd dist && python3 -m http.server 8080
```
Then open http://localhost:8080

**Option 3: Using PHP (if available)**
```bash
cd dist && php -S localhost:8000
```
Then open http://localhost:8000

### Stopping Local Servers

To stop any running local servers:

```bash
# Stop server on specific port
kill $(lsof -ti:3000)  # For port 3000
kill $(lsof -ti:8080)  # For port 8080

# Or check what's running on ports
lsof -i :3000
lsof -i :8080
```

## Notes

- CORS: React posts use `withCredentials: false` for demo endpoints; Ably token auth uses `xhrWithCredentials` so your Laravel session/CSRF may be used if needed.
- In dev, React Strict Mode can mount effects twice; listeners are cleaned up to prevent duplicate subscriptions.
- The production build includes optimized assets and lazy loading for better performance.