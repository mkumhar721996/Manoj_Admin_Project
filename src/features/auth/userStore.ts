import type { User } from "../../types/user";
import type { FacebookProfile } from "./facebookAuth";
import type { OtpProfile } from "./otpAuth";

const STORAGE_KEY = "users";

function readUsers(): User[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
}

function writeUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
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
  writeUsers(users);
  return user;
}

export function authenticateFacebookUser(profile: FacebookProfile): User | null {
  return findUserByFacebookId(profile.id) ?? null;
}

export function findUserByOtpIdentifier(identifier: string): User | undefined {
  return readUsers().find((user) => user.otpIdentifier === identifier);
}

export function createUserFromOtpProfile(profile: OtpProfile): User {
  const users = readUsers();
  const user: User = {
    id: crypto.randomUUID(),
    otpIdentifier: profile.identifier,
    name: profile.name,
  };
  users.push(user);
  writeUsers(users);
  return user;
}

export function authenticateOtpUser(identifier: string): User | null {
  return findUserByOtpIdentifier(identifier) ?? null;
}

export function findFacebookCollision(profile: FacebookProfile): User | undefined {
  return readUsers().find(
    (user) => user.otpIdentifier === profile.email && !user.facebookId,
  );
}

export function findOtpCollision(identifier: string): User | undefined {
  return readUsers().find(
    (user) => user.email === identifier && !user.otpIdentifier,
  );
}

export function linkFacebookToExistingUser(
  userId: string,
  profile: FacebookProfile,
): User {
  const users = readUsers();
  const index = users.findIndex((user) => user.id === userId);
  if (index === -1) {
    throw new Error(`Cannot link Facebook account: user ${userId} not found`);
  }
  const updated: User = { ...users[index], facebookId: profile.id };
  users[index] = updated;
  writeUsers(users);
  return updated;
}

export function linkOtpToExistingUser(userId: string, identifier: string): User {
  const users = readUsers();
  const index = users.findIndex((user) => user.id === userId);
  if (index === -1) {
    throw new Error(`Cannot link OTP identifier: user ${userId} not found`);
  }
  const updated: User = { ...users[index], otpIdentifier: identifier };
  users[index] = updated;
  writeUsers(users);
  return updated;
}
