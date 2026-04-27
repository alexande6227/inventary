import { useEffect } from "react";

export function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return undefined;

    const timer = window.setTimeout(onDone, 2400);
    return () => window.clearTimeout(timer);
  }, [message, onDone]);

  return (
    <div className={`toast ${message ? "is-visible" : ""}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
