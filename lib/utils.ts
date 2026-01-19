import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Generate a unique ID for database records */
export function generateId(): string {
  return crypto.randomUUID();
}

/** Generate a tracking ID for phishing links (shorter, URL-safe) */
export function generateTrackingId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Format a date for display */
export function formatDate(date: Date | string | null): string {
  if (!date) {
    return "—";
  }
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Format a date with time for display */
export function formatDateTime(date: Date | string | null): string {
  if (!date) {
    return "—";
  }
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
