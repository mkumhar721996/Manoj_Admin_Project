import { beforeEach, describe, expect, it } from "vitest";
import {
  authenticateFacebookUser,
  createUserFromFacebookProfile,
  updateUser,
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

  describe("updateUser", () => {
    it("persists updated name, phone, and email for the given user id", async () => {
      const user = createUserFromFacebookProfile({
        id: "fb-1",
        name: "Jane Doe",
        email: "jane@example.com",
      });

      const updated = await updateUser(user.id, {
        name: "Jane Smith",
        phone: "555-0100",
        email: "jane.smith@example.com",
      });

      expect(updated).toMatchObject({
        id: user.id,
        facebookId: user.facebookId,
        name: "Jane Smith",
        phone: "555-0100",
        email: "jane.smith@example.com",
      });

      const stored = JSON.parse(localStorage.getItem("users") ?? "[]");
      const storedUser = stored.find((u: { id: string }) => u.id === user.id);
      expect(storedUser).toMatchObject({
        name: "Jane Smith",
        phone: "555-0100",
        email: "jane.smith@example.com",
      });
    });
  });
});
