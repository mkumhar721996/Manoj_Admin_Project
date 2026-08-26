import type { User } from "../../types/user";
import type { FacebookProfile } from "./facebookAuth";

const STORAGE_KEY = "users";

function readUsers(): User[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
}

export function findUserByFacebookId(facebookId: string): User | undefined {
  return readUsers().find((user) => user.facebookId === facebookId);
}

export function createUserFromFacebookProfile(profile: FacebookProfile): User {
  const users = readUsers();
  const user: User = {
    id: crypto.randomUUID(),
    facebookId: profile.id,
    name: profile.name,
    email: profile.email,
  };
  users.push(user);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  return user;
}

export function authenticateFacebookUser(profile: FacebookProfile): User | null {
  return findUserByFacebookId(profile.id) ?? null;
}
