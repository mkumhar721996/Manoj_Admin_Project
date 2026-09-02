import { beforeEach, describe, expect, it } from "vitest";
import {
  authenticateFacebookUser,
  authenticateOtpUser,
  createUserFromFacebookProfile,
  createUserFromOtpProfile,
  findFacebookCollision,
  findOtpCollision,
  linkFacebookToExistingUser,
  linkOtpToExistingUser,
} from "./userStore";

describe("userStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("createUserFromFacebookProfile", () => {
    it("appends a new user linked to the Facebook profile with a generated id", () => {
      createUserFromFacebookProfile({
        id: "fb-1",
        name: "Jane Doe",
        email: "jane@example.com",
      });

      const stored = JSON.parse(localStorage.getItem("users") ?? "[]");
      expect(stored).toHaveLength(1);
      expect(stored[0]).toMatchObject({
        facebookId: "fb-1",
        name: "Jane Doe",
        email: "jane@example.com",
      });
      expect(typeof stored[0].id).toBe("string");
      expect(stored[0].id.length).toBeGreaterThan(0);
    });
  });

  describe("authenticateFacebookUser", () => {
    it("returns the stored user when a matching Facebook registration exists", () => {
      const registered = createUserFromFacebookProfile({
        id: "fb-1",
        name: "Jane Doe",
        email: "jane@example.com",
      });

      const result = authenticateFacebookUser({
        id: "fb-1",
        name: "Jane Doe",
        email: "jane@example.com",
      });

      expect(result).toEqual(registered);
    });

    it("returns null when no matching Facebook registration exists", () => {
      const result = authenticateFacebookUser({
        id: "fb-404",
        name: "No One",
        email: "no@one.com",
      });

      expect(result).toBeNull();
    });
  });

  describe("createUserFromOtpProfile", () => {
    it("appends a new user linked to the OTP identifier with a generated id", () => {
      createUserFromOtpProfile({
        identifier: "jane@example.com",
        name: "Jane Doe",
      });

      const stored = JSON.parse(localStorage.getItem("users") ?? "[]");
      expect(stored).toHaveLength(1);
      expect(stored[0]).toMatchObject({
        otpIdentifier: "jane@example.com",
        name: "Jane Doe",
      });
      expect(stored[0].facebookId).toBeUndefined();
      expect(typeof stored[0].id).toBe("string");
      expect(stored[0].id.length).toBeGreaterThan(0);
    });
  });

  describe("authenticateOtpUser", () => {
    it("returns the stored user when a matching OTP registration exists", () => {
      const registered = createUserFromOtpProfile({
        identifier: "jane@example.com",
        name: "Jane Doe",
      });

      const result = authenticateOtpUser("jane@example.com");

      expect(result).toEqual(registered);
    });

    it("returns null when no matching OTP registration exists", () => {
      const result = authenticateOtpUser("no@one.com");

      expect(result).toBeNull();
    });
  });

  describe("findFacebookCollision", () => {
    it("returns the OTP-created user whose identifier matches the Facebook email", () => {
      const otpUser = createUserFromOtpProfile({
        identifier: "jane@example.com",
        name: "Jane Doe",
      });

      const result = findFacebookCollision({
        id: "fb-1",
        name: "Jane Doe",
        email: "jane@example.com",
      });

      expect(result).toEqual(otpUser);
    });

    it("returns undefined when no OTP user has a matching identifier", () => {
      const result = findFacebookCollision({
        id: "fb-1",
        name: "Jane Doe",
        email: "jane@example.com",
      });

      expect(result).toBeUndefined();
    });

    it("returns undefined when the matching user already has a facebookId", () => {
      createUserFromOtpProfile({
        identifier: "jane@example.com",
        name: "Jane Doe",
      });
      const users = JSON.parse(localStorage.getItem("users") ?? "[]");
      users[0].facebookId = "fb-already-linked";
      localStorage.setItem("users", JSON.stringify(users));

      const result = findFacebookCollision({
        id: "fb-1",
        name: "Jane Doe",
        email: "jane@example.com",
      });

      expect(result).toBeUndefined();
    });
  });

  describe("findOtpCollision", () => {
    it("returns the Facebook-created user whose email matches the OTP identifier", () => {
      const fbUser = createUserFromFacebookProfile({
        id: "fb-1",
        name: "Jane Doe",
        email: "jane@example.com",
      });

      const result = findOtpCollision("jane@example.com");

      expect(result).toEqual(fbUser);
    });

    it("returns undefined when no Facebook user has a matching email", () => {
      const result = findOtpCollision("jane@example.com");

      expect(result).toBeUndefined();
    });

    it("returns undefined when the matching user already has an otpIdentifier", () => {
      createUserFromFacebookProfile({
        id: "fb-1",
        name: "Jane Doe",
        email: "jane@example.com",
      });
      const users = JSON.parse(localStorage.getItem("users") ?? "[]");
      users[0].otpIdentifier = "already-linked";
      localStorage.setItem("users", JSON.stringify(users));

      const result = findOtpCollision("jane@example.com");

      expect(result).toBeUndefined();
    });
  });

  describe("linkFacebookToExistingUser", () => {
    it("sets the facebookId on the existing user without creating a duplicate", () => {
      const otpUser = createUserFromOtpProfile({
        identifier: "jane@example.com",
        name: "Jane Doe",
      });

      const linked = linkFacebookToExistingUser(otpUser.id, {
        id: "fb-1",
        name: "Jane Doe",
        email: "jane@example.com",
      });

      expect(linked).toMatchObject({
        id: otpUser.id,
        otpIdentifier: "jane@example.com",
        facebookId: "fb-1",
      });
      const stored = JSON.parse(localStorage.getItem("users") ?? "[]");
      expect(stored).toHaveLength(1);
      expect(stored[0]).toEqual(linked);
    });
  });

  describe("linkOtpToExistingUser", () => {
    it("sets the otpIdentifier on the existing user without creating a duplicate", () => {
      const fbUser = createUserFromFacebookProfile({
        id: "fb-1",
        name: "Jane Doe",
        email: "jane@example.com",
      });

      const linked = linkOtpToExistingUser(fbUser.id, "jane@example.com");

      expect(linked).toMatchObject({
        id: fbUser.id,
        facebookId: "fb-1",
        otpIdentifier: "jane@example.com",
      });
      const stored = JSON.parse(localStorage.getItem("users") ?? "[]");
      expect(stored).toHaveLength(1);
      expect(stored[0]).toEqual(linked);
    });
  });

  describe("account linking round trip", () => {
    it("resolves to the same account via either method after linking Facebook onto an OTP account", () => {
      const otpUser = createUserFromOtpProfile({
        identifier: "jane@example.com",
        name: "Jane Doe",
      });
      const fbProfile = { id: "fb-1", name: "Jane Doe", email: "jane@example.com" };

      linkFacebookToExistingUser(otpUser.id, fbProfile);

      expect(authenticateFacebookUser(fbProfile)?.id).toBe(otpUser.id);
      expect(authenticateOtpUser("jane@example.com")?.id).toBe(otpUser.id);
    });

    it("resolves to the same account via either method after linking OTP onto a Facebook account", () => {
      const fbUser = createUserFromFacebookProfile({
        id: "fb-1",
        name: "Jane Doe",
        email: "jane@example.com",
      });

      linkOtpToExistingUser(fbUser.id, "jane@example.com");

      expect(authenticateOtpUser("jane@example.com")?.id).toBe(fbUser.id);
      expect(
        authenticateFacebookUser({
          id: "fb-1",
          name: "Jane Doe",
          email: "jane@example.com",
        })?.id,
      ).toBe(fbUser.id);
    });
  });
});
