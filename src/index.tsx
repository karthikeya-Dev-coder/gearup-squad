import ReactDOM from "react-dom/client";
import "./app/globals.css";
import App from "./App";

// Suppress ResizeObserver loop completed with undelivered notifications error
// This is a benign error from Radix UI / Vaul in development mode
const debounce = (callback: (...args: any[]) => void, delay: number) => {
  let tid: any;
  return (...args: any[]) => {
    clearTimeout(tid);
    tid = setTimeout(() => callback(...args), delay);
  };
};

const errorHandler = (e: ErrorEvent) => {
  if (e.message.includes('ResizeObserver loop completed with undelivered notifications') ||
    e.message.includes('ResizeObserver loop limit exceeded') ||
    e.message.includes('WebSocket connection to')) {
    e.stopImmediatePropagation();
  }
};

// Global interceptors to keep the console clean from benign dev-mode warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && (
    args[0].includes('aria-hidden') ||
    args[0].includes('ResizeObserver') ||
    args[0].includes('startTransition') // Silence React Router future flag noise
  )) return;
  originalWarn(...args);
};

const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && (
    args[0].includes('WebSocket connection to') ||
    args[0].includes('ResizeObserver')
  )) return;
  originalError(...args);
};

window.addEventListener('error', errorHandler);
window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
  if (e.reason?.message?.includes('ResizeObserver loop completed with undelivered notifications') ||
    e.reason?.message?.includes('WebSocket connection')) {
    e.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
