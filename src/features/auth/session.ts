import type { User } from "../../types/user";

const STORAGE_KEY = "session";

export function setCurrentUser(user: User): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function getCurrentUser(): User | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function clearCurrentUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}
