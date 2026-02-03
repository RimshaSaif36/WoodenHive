import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Generate or return a persistent guest user id for non-logged-in users
export function getOrCreateGuestId() {
  if (typeof window === "undefined") return null;

  const storageKey = "guest_user_id";
  let guestId = window.localStorage.getItem(storageKey);

  if (guestId) return guestId;

  // Create a 24-character hex string so it can be used as a Mongo ObjectId
  const chars = "abcdef0123456789";
  let newId = "";
  for (let i = 0; i < 24; i += 1) {
    newId += chars[Math.floor(Math.random() * chars.length)];
  }

  window.localStorage.setItem(storageKey, newId);
  return newId;
}
