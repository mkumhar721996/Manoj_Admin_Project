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

export async function updateUser(
  id: string,
  facebookId: string,
  updates: Partial<Pick<User, "name" | "phone" | "email">>,
): Promise<User> {
  const users = readUsers();
  let updatedUser: User | undefined;
  const nextUsers = users.map((user) => {
    if (user.id !== id || user.facebookId !== facebookId) return user;
    updatedUser = { ...user, ...updates };
    return updatedUser;
  });
  if (!updatedUser) {
    throw new Error(`No user found with id ${id} owned by facebookId ${facebookId}`);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUsers));
  return updatedUser;
}
