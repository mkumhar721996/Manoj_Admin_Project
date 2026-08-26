import type { User } from "../../types/user";

const STORAGE_KEY = "session";

export function setCurrentUser(user: User): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    console.error("Failed to save session");
  }
}

export function getCurrentUser(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function clearCurrentUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.error("Failed to clear session");
  }
}
